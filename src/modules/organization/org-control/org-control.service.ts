import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  ControlWizard,
  ControlWizardType,
  OrganizationControl,
  ControlWizardSchedule,
  SystemIntegration,
  SystemIntegrationCategory,
  ControlWizardForm,
  ControlWizardFormField,
} from '../../../shared/db/typeorm/entities';

import { CreateControlWizardDto } from './dto/org-control.dto';
import { UpsertControlWizardScheduleDto } from './dto/schedules/schedules.dto';
import {
  UpsertControlWizardFormDto,
  UpsertControlWizardFormFieldDto,
} from './dto/forms/forms.dto';

import dayjs from 'dayjs';

@Injectable()
export class OrgControlService {
  constructor(
    @InjectRepository(OrganizationControl)
    private readonly organizationControlRepository: Repository<OrganizationControl>,
    @InjectRepository(SystemIntegration)
    private readonly systemIntegrationRepository: Repository<SystemIntegration>,
    @InjectRepository(ControlWizard)
    private readonly controlWizardRepository: Repository<ControlWizard>,
    @InjectRepository(ControlWizardSchedule)
    private readonly controlWizardScheduleRepository: Repository<ControlWizardSchedule>,
    @InjectRepository(ControlWizardForm)
    private readonly controlWizardFormRepository: Repository<ControlWizardForm>,
    @InjectRepository(ControlWizardFormField)
    private readonly controlWizardFormFieldRepository: Repository<ControlWizardFormField>,
  ) {}

  async getSystemIntegrations(category: SystemIntegrationCategory) {
    const systemIntegrations = await this.systemIntegrationRepository.find({
      where: { category },
    });
    return systemIntegrations;
  }

  // get control wizard by category
  async getControlWizardByCategory(
    categoryId: number,
    isDefault = false,
    organizationId?: string,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        categoryId,
        type: isDefault ? ControlWizardType.DEFAULT : ControlWizardType.CUSTOM,
        organizationId: isDefault ? IsNull() : organizationId,
      },
      relations: [
        'category',
        'control',
        'forms',
        'forms.fields',
        'forms.fields.options',
        'schedules',
        'approvals',
        'documents',
        'reports',
      ],
    });
    return controlWizard;
  }

  async getControlWizardSchedules(
    controlWizardId: string,
    isDefault = true,
    organizationId?: string,
  ) {
    const schedules = await this.controlWizardScheduleRepository.find({
      where: {
        controlWizardId,
      },
      relations: ['controlWizard'],
    });

    if (!schedules.length) {
      throw new BadRequestException('Control wizard schedule not found');
    }

    if (
      !isDefault &&
      schedules.some(
        (schedule) => schedule.controlWizard?.organizationId !== organizationId,
      )
    ) {
      throw new BadRequestException('Invalid control wizard id');
    }

    return schedules;
  }

  async getControlWizardForms(
    controlWizardId: string,
    isDefault = true,
    organizationId?: string,
  ) {
    const controlWizardForms = await this.controlWizardFormRepository.find({
      where: {
        id: controlWizardId,
      },
      relations: ['controlWizard', 'fields'],
    });

    if (!controlWizardForms) {
      throw new BadRequestException('Control wizard not found');
    }

    if (
      !isDefault &&
      controlWizardForms.some(
        (form) => form.controlWizard?.organizationId !== organizationId,
      )
    ) {
      throw new BadRequestException('Invalid control wizard id');
    }

    return controlWizardForms;
  }

  async createControlWizard(
    organizationId: string,
    payload: CreateControlWizardDto,
  ) {
    const defaultControlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: payload.defaultControlWizardId,
        organizationId: IsNull(),
        type: ControlWizardType.DEFAULT,
      },
    });

    if (!defaultControlWizard) {
      throw new BadRequestException(
        'Default control wizard not found for this category',
      );
    }

    const orgHasControlWizard = await this.controlWizardRepository.findOne({
      where: {
        organizationId,
        categoryId: defaultControlWizard.categoryId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (orgHasControlWizard) {
      throw new BadRequestException(
        'Control wizard already exists for this organization',
      );
    }

    const controlWizard = this.controlWizardRepository.create({
      ...defaultControlWizard,
      organizationId,
      type: ControlWizardType.CUSTOM,
      mode: payload.mode,
      isRecurring: payload.isRecurring,
      requiresApproval: payload.requiresApproval,
      requiresEvidence: payload.requiresEvidence,
      title: payload.title,
      description: payload.description,
    });
    await this.controlWizardRepository.save(controlWizard);

    return controlWizard;
  }

  async upsertControlWizardSchedule(
    organizationId: string,
    controlWizardId: string,
    payload: UpsertControlWizardScheduleDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    let schedule: ControlWizardSchedule | null = null;
    const updatePayload = {
      ...(payload.isNew && { controlWizardId }),
      interval: payload.interval,
      method: payload.method,
      startDate: payload.startDate
        ? dayjs(payload.startDate).startOf('day').toDate()
        : dayjs().add(1, 'day').startOf('day').toDate(),
      preferredTime: payload.preferredTime,
      ...(payload.scheduleConfig && {
        scheduleConfig: {
          ...(payload.scheduleConfig.dayOfWeek && {
            dayOfWeek: parseInt(payload.scheduleConfig.dayOfWeek),
          }),
          ...(payload.scheduleConfig.dayOfMonth && {
            dayOfMonth: parseInt(payload.scheduleConfig.dayOfMonth),
          }),
          ...(payload.scheduleConfig.monthOfYear && {
            monthOfYear: parseInt(payload.scheduleConfig.monthOfYear),
          }),
        },
      }),
    };

    if (payload.isNew) {
      schedule = this.controlWizardScheduleRepository.create(updatePayload);

      await this.controlWizardScheduleRepository.save(schedule);
    } else {
      const updateResult = await this.controlWizardScheduleRepository.update(
        {
          id: payload.scheduleId,
          controlWizardId,
        },
        updatePayload,
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard schedule',
        );
      }

      schedule = await this.controlWizardScheduleRepository.findOne({
        where: {
          id: payload.scheduleId,
        },
        relations: ['controlWizard'],
      });
    }

    return schedule;
  }

  async upsertControlWizardForm(
    organizationId: string,
    controlWizardId: string,
    payload: UpsertControlWizardFormDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    const form = {
      ...(payload.isNew && { controlWizardId }),
      type: payload.type,
      title: payload.title,
      description: payload.description,
      formConfig: payload.formConfig,
      isActive: payload.isActive,
    };

    if (payload.isNew) {
      const newForm = this.controlWizardFormRepository.create(form);
      await this.controlWizardFormRepository.save(newForm);
    } else {
      const updateResult = await this.controlWizardFormRepository.update(
        { id: payload.formId },
        {
          ...form,
          version: () => `version + 1`,
        },
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard form',
        );
      }

      const updatedForm = await this.controlWizardFormRepository.findOne({
        where: { id: payload.formId },
        relations: ['controlWizard', 'fields'],
      });

      return updatedForm;
    }
  }

  async upsertControlWizardFormField(
    organizationId: string,
    controlWizardId: string,
    payload: UpsertControlWizardFormFieldDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    const fieldObject = {
      ...(payload.isNew && { controlWizardId }),
      ...(payload.isNew && { formId: payload.formId }),
      type: payload.type,
      label: payload.label,
      description: payload.description,
      options: payload.options,
      validation: payload.validation,
      scoring: payload.scoring,
      isRequired: payload.isRequired,
      isConditional: payload.isConditional,
      order: payload.order,
    };

    if (payload.isNew) {
      const newField =
        this.controlWizardFormFieldRepository.create(fieldObject);
      await this.controlWizardFormFieldRepository.save(newField);
    } else {
      const updateResult = await this.controlWizardFormFieldRepository.update(
        { id: payload.fieldId },
        fieldObject,
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard form field',
        );
      }

      const updatedField = await this.controlWizardFormFieldRepository.findOne({
        where: { id: payload.fieldId },
        relations: ['controlWizard', 'form'],
      });

      return updatedField;
    }
  }
  // generate control wizards for organization => simply map default wizards specific to the organization
  // update control wizard by category
  // update control form setting
  // update control wizard schedule
  // update control wizard approvals
}
