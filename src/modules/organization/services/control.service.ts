import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import {
  ControlWizard,
  ControlWizardType,
  OrganizationControl,
  ControlWizardSchedule,
  SystemIntegration,
  SystemIntegrationCategory,
  ControlWizardForm,
  ControlWizardFormField,
  ControlWizardDocument,
  Framework,
  FrameworkStatus,
  SystemIntegrationStatus,
  ControlCategory,
} from '../../../shared/db/typeorm/entities';

import { CreateControlWizardDto } from '../dto/org-controls';
import { UpsertControlWizardScheduleDto } from '../dto/org-controls/schedules/schedules.dto';
import {
  UpsertControlWizardFormDto,
  UpsertControlWizardFormFieldDto,
} from '../dto/org-controls/forms/forms.dto';

import dayjs from 'dayjs';
import { UpsertControlWizardDocumentDto } from '../dto/org-controls/document/document.dto';

@Injectable()
export class ControlService {
  private readonly logger = new Logger(ControlService.name);
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
    @InjectRepository(ControlWizardDocument)
    private readonly controlWizardDocumentRepository: Repository<ControlWizardDocument>,
    @InjectRepository(Framework)
    private readonly frameworkRepository: Repository<Framework>,
    @InjectRepository(ControlCategory)
    private readonly controlCategoryRepository: Repository<ControlCategory>,
  ) {}

  async getControlWizardSetupStatus(organizationId: string, controlId: string) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        organizationId,
        controlId: parseInt(controlId),
      },
    });

    if (!controlWizard) {
      return null;
    }

    return controlWizard.status;
  }

  async getUniqueControlCategoriesByFrameworks(frameworkIds: number[]) {
    return this.controlCategoryRepository.find({
      where: {
        frameworks: { id: In(frameworkIds) },
      },
      relations: ['controls'],
    });
  }

  async getFrameworks(status?: FrameworkStatus) {
    return this.frameworkRepository.find({
      where: { status: status || FrameworkStatus.ACTIVE },
      relations: ['controlCategories'],
    });
  }

  async getSystemIntegrationCategories(
    status?: string,
  ): Promise<SystemIntegrationCategory[]> {
    if (!status) return Object.values(SystemIntegrationCategory);

    // Use query builder to get unique categories
    const categories = await this.systemIntegrationRepository
      .createQueryBuilder('integration')
      .select('DISTINCT integration.category', 'category')
      .where('integration.status = :status', { status })
      .getRawMany();

    return categories.map(
      (result: { category: SystemIntegrationCategory }) => result.category,
    );
  }

  async getSystemIntegrations(
    category: SystemIntegrationCategory,
    status?: SystemIntegrationStatus,
  ) {
    const systemIntegrations = await this.systemIntegrationRepository.find({
      where: { category, status: status || SystemIntegrationStatus.ACTIVE },
    });
    return systemIntegrations;
  }

  // get control wizard by controlId
  async getControlWizardByControlId(
    controlId: string,
    isDefault = false,
    organizationId?: string,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        controlId: parseInt(controlId),
        type: isDefault
          ? ControlWizardType.SYSTEM_DEFINED
          : ControlWizardType.CUSTOM,
        organizationId: isDefault ? IsNull() : organizationId,
      },
      relations: [
        'category',
        'control',
        'forms',
        'forms.fields',
        'schedules',
        'approvals',
        'documents',
        'reports',
      ],
    });

    if (!controlWizard) {
      throw new BadRequestException('Control wizard not found');
    }

    return controlWizard;
  }

  /**
   * Smart control wizard retrieval that automatically determines whether to return
   * a custom organization wizard or the default system wizard based on setup status
   */
  async getControlWizardSmart(controlId: string, organizationId: string) {
    // First check if the organization already has a custom wizard for this control
    this.logger.log(
      `Getting control wizard smart for controlId: ${controlId} and organizationId: ${organizationId}`,
    );
    const setupStatus = await this.getControlWizardSetupStatus(
      organizationId,
      controlId,
    );

    // If organization has a custom wizard (any status), use it
    if (setupStatus !== null) {
      return await this.getControlWizardByControlId(
        controlId,
        false,
        organizationId,
      );
    }

    // If no custom wizard exists, return the default system wizard
    return await this.getControlWizardByControlId(
      controlId,
      true,
      organizationId,
    );
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
      relations: ['controlWizard', 'assignedUsers'],
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

  async getControlWizardFormFields(
    controlWizardId: string,
    formId: string,
    isDefault = true,
    organizationId?: string,
  ) {
    const controlWizardFormFields =
      await this.controlWizardFormFieldRepository.find({
        where: {
          formId,
          form: {
            controlWizardId,
          },
          ...(isDefault && {
            controlWizard: {
              organizationId,
            },
          }),
        },
        relations: ['controlWizard', 'form'],
      });

    if (!controlWizardFormFields) {
      throw new BadRequestException('Control wizard form field not found');
    }

    if (
      !isDefault &&
      controlWizardFormFields.some(
        (field) => field.form.controlWizard?.organizationId !== organizationId,
      )
    ) {
      throw new BadRequestException('Invalid control wizard id');
    }

    return controlWizardFormFields;
  }

  async getControlWizardDocuments(
    controlWizardId: string,
    isDefault = true,
    organizationId?: string,
  ) {
    const controlWizardDocuments =
      await this.controlWizardDocumentRepository.find({
        where: {
          controlWizardId,
          ...(isDefault && {
            controlWizard: {
              organizationId,
            },
          }),
        },
        relations: ['controlWizard', 'versions'],
      });

    if (!controlWizardDocuments) {
      throw new BadRequestException('Control wizard document not found');
    }

    if (
      !isDefault &&
      controlWizardDocuments.some(
        (document) => document.controlWizard?.organizationId !== organizationId,
      )
    ) {
      throw new BadRequestException('Invalid control wizard id');
    }

    return controlWizardDocuments;
  }

  async createControlWizard(
    organizationId: string,
    payload: CreateControlWizardDto,
  ) {
    const defaultControlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: payload.defaultControlWizardId,
        organizationId: IsNull(),
        type: ControlWizardType.SYSTEM_DEFINED,
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
      id: undefined,
    });
    await this.controlWizardRepository.save(controlWizard);

    // link forms to the control wizard

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
    // is default updated

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

  async upsertControlWizardDocument(
    organizationId: string,
    controlWizardId: string,
    payload: UpsertControlWizardDocumentDto,
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

    const document = {
      ...(payload.isNew && { controlWizardId }),
      title: payload.title,
      description: payload.description,
      type: payload.type,
      documentConfig: payload.documentConfig,
    };

    if (payload.isNew) {
      const newDocument = this.controlWizardDocumentRepository.create(document);
      await this.controlWizardDocumentRepository.save(newDocument);
    } else {
      const updateResult = await this.controlWizardDocumentRepository.update(
        { id: payload.documentId },
        document,
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard document',
        );
      }

      const updatedDocument =
        await this.controlWizardDocumentRepository.findOne({
          where: { id: payload.documentId },
          relations: ['controlWizard', 'versions'],
        });

      if (!updatedDocument) {
        throw new InternalServerErrorException(
          'Failed to update control wizard document',
        );
      }

      return updatedDocument;
    }
  }

  // assign user to a control via the wizard
  // invite user to the portal if not exisiting
  // list all users in the organization

  // update form
  // remove form field
  // add form field
  // add a form to the control

  // update schedules
  // add a schedule
  // - link a schedule to a form and control wizard
  // - assign a user to a schedule

  // generate control wizards for organization => simply map default wizards specific to the organization
  // update control wizard by category
  // update control form setting
  // update control wizard schedule
  // update control wizard approvals
}
