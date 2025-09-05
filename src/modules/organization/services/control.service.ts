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
  User,
  ScheduleConfig,
  NotificationConfig,
  ReminderConfig,
  ControlWizardReportSchedule,
  ControlWizardReport,
  ReportContentConfig,
  ReportDistributionConfig,
  ReportConfig,
  ControlWizardApprovalStage,
  ControlWizardApproval,
} from '../../../shared/db/typeorm/entities';

import { CreateControlWizardDto } from '../dto/org-controls';
import {
  AssignControlWizardScheduleToFormDto,
  UpsertControlWizardScheduleDto,
} from '../dto/org-controls/schedules/schedules.dto';
import {
  UpsertControlWizardFormDto,
  UpsertControlWizardFormFieldDto,
} from '../dto/org-controls/forms/forms.dto';

import dayjs from 'dayjs';
import { UpsertControlWizardDocumentDto } from '../dto/org-controls/document/document.dto';
import { ControlWizardFormSchedule } from 'src/shared/db/typeorm/entities/control-wizard-form-schedule.entity';
import { UpsertControlReportConfigDto } from '../dto/org-controls/report/report.dto';
import { AssignControlWizardReportToScheduleDto } from '../dto/org-controls/report/report.dto';
import { UpsertControlWizardApprovalDto } from '../dto/org-controls/approvals/approvals.dto';
import { UpsertControlWizardApprovalStageDto } from '../dto/org-controls/approvals/approvals.dto';
import { SubmitApprovalDecisionDto } from '../dto/org-controls/approvals/approvals.dto';
import { ControlApprovalSubmission } from 'src/shared/db/typeorm/entities/control-approval-submission.entity';
import { ApprovalSubmissionStatus } from 'src/shared/db/typeorm/entities/control-approval-submission.entity';
import {
  ControlApprovalStageSubmission,
  StageStatus,
} from 'src/shared/db/typeorm/entities/control-approval-stage-submission.entity';
import { AssignUserToControlDto } from '../dto/org-controls/users/users.dto';
// import { InviteUserToPortalDto } from '../dto/org-controls/users/users.dto';
// import { RemoveFormFieldDto } from '../dto/org-controls/forms/forms.dto';
// import { RemoveFormDto } from '../dto/org-controls/forms/forms.dto';
// import { RemoveDocumentDto } from '../dto/org-controls/document/document.dto';
// import { RemoveScheduleDto } from '../dto/org-controls/schedules/schedules.dto';
// import { RemoveReportDto } from '../dto/org-controls/report/report.dto';
// import { RemoveApprovalDto } from '../dto/org-controls/approvals/approvals.dto';
// import { RemoveApprovalStageDto } from '../dto/org-controls/approvals/approvals.dto';

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
    @InjectRepository(ControlWizardReport)
    private readonly controlWizardReportRepository: Repository<ControlWizardReport>,
    @InjectRepository(ControlWizardFormSchedule)
    private readonly controlWizardFormScheduleRepository: Repository<ControlWizardFormSchedule>,
    @InjectRepository(ControlWizardReportSchedule)
    private readonly controlWizardReportScheduleRepository: Repository<ControlWizardReportSchedule>,
    @InjectRepository(ControlWizardForm)
    private readonly controlWizardFormRepository: Repository<ControlWizardForm>,
    @InjectRepository(ControlWizardFormField)
    private readonly controlWizardFormFieldRepository: Repository<ControlWizardFormField>,
    @InjectRepository(ControlWizardDocument)
    private readonly controlWizardDocumentRepository: Repository<ControlWizardDocument>,
    @InjectRepository(Framework)
    private readonly frameworkRepository: Repository<Framework>,
    @InjectRepository(ControlWizardApproval)
    private readonly controlWizardApprovalRepository: Repository<ControlWizardApproval>,
    @InjectRepository(ControlWizardApprovalStage)
    private readonly controlWizardApprovalStageRepository: Repository<ControlWizardApprovalStage>,
    @InjectRepository(ControlCategory)
    private readonly controlCategoryRepository: Repository<ControlCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ControlApprovalSubmission)
    private readonly controlApprovalSubmissionRepository: Repository<ControlApprovalSubmission>,
    @InjectRepository(ControlApprovalStageSubmission)
    private readonly controlApprovalStageSubmissionRepository: Repository<ControlApprovalStageSubmission>,
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
          'Failed to upsert control wizard form',
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

    const form = await this.controlWizardFormRepository.findOne({
      where: {
        id: payload.formId,
        controlWizardId,
      },
    });

    if (!form) {
      throw new BadRequestException('Invalid form id');
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

    let assignedUsers: User[] = [];
    if (payload.assignedUsers?.length) {
      assignedUsers = await this.userRepository.find({
        where: { id: In(payload.assignedUsers) },
      });
    }

    let schedule: ControlWizardSchedule | null = null;
    const updatePayload = {
      ...(payload.isNew && { controlWizardId }),
      interval: payload.interval,
      method: payload.method,
      isActive: payload.setIsActive,
      assignedUsers,
      startDate: payload.startDate
        ? dayjs(payload.startDate).startOf('day').toDate()
        : dayjs().add(1, 'day').startOf('day').toDate(),
      preferredTime: payload.preferredTime,
      ...(payload.scheduleConfig && {
        scheduleConfig: payload.scheduleConfig as ScheduleConfig,
      }),
      ...(payload.notificationConfig && {
        notificationConfig: payload.notificationConfig as NotificationConfig,
      }),
      ...(payload.reminderConfig && {
        reminderConfig: payload.reminderConfig as ReminderConfig,
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

  async upsertControlReportConfig(
    organizationId: string,
    payload: UpsertControlReportConfigDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: payload.controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    if (payload.isNew && controlWizard.generatesReport === false) {
      throw new BadRequestException(
        'Control wizard does not generate reports, update the control wizard to generate reports',
      );
    }

    if (payload.formId) {
      const form = await this.controlWizardFormRepository.findOne({
        where: { id: payload.formId, controlWizardId: payload.controlWizardId },
      });
      if (!form) {
        throw new BadRequestException('Invalid form id');
      }
    }

    const report = {
      ...(payload.isNew && { controlWizardId: payload.controlWizardId }),
      ...(payload.isNew && { templateId: payload.templateId }),
      type: payload.type,
      title: payload.title,
      ...(payload.formId && { formId: payload.formId }),
      description: payload.description,
      reportConfig: payload.reportConfig as ReportConfig,
      contentConfig: payload.contentConfig as ReportContentConfig,
      distributionConfig:
        payload.distributionConfig as ReportDistributionConfig,
      isActive: payload.setIsActive,
    };

    if (payload.isNew) {
      const newReport = this.controlWizardReportRepository.create(report);
      return this.controlWizardReportRepository.save(newReport);
    } else {
      const updateResult = await this.controlWizardReportRepository.update(
        { id: payload.reportId },
        report,
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard report',
        );
      }

      const updatedReport = await this.controlWizardReportRepository.findOne({
        where: { id: payload.reportId },
        relations: ['controlWizard', 'schedules'],
      });

      return updatedReport;
    }
  }

  async assignControlWizardFormToSchedule(
    organizationId: string,
    payload: AssignControlWizardScheduleToFormDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: payload.controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    const form = await this.controlWizardFormRepository.findOne({
      where: { id: payload.formId, controlWizardId: payload.controlWizardId },
    });

    if (!form) {
      throw new BadRequestException('Invalid form id');
    }

    const schedule = await this.controlWizardScheduleRepository.findOne({
      where: { id: payload.scheduleId },
    });

    if (!schedule) {
      throw new BadRequestException('Invalid schedule id');
    }

    const existingSchedule =
      await this.controlWizardFormScheduleRepository.findOne({
        where: { controlWizardFormId: payload.formId, scheduleId: schedule.id },
      });

    if (existingSchedule) {
      throw new BadRequestException('Schedule already assigned to form');
    }

    const newSchedule = this.controlWizardFormScheduleRepository.create({
      controlWizardFormId: payload.formId,
      scheduleId: schedule.id,
    });

    await this.controlWizardFormScheduleRepository.save(newSchedule);

    return newSchedule;
  }

  async assignControlWizardReportToSchedule(
    organizationId: string,
    payload: AssignControlWizardReportToScheduleDto,
  ) {
    const report = await this.controlWizardReportRepository.findOne({
      where: { id: payload.reportId },
      relations: ['controlWizard'],
    });

    if (!report || report.controlWizard?.organizationId !== organizationId) {
      throw new BadRequestException('Invalid report id');
    }

    const schedule = await this.controlWizardScheduleRepository.findOne({
      where: {
        id: payload.scheduleId,
      },
      relations: ['controlWizard'],
    });

    if (
      !schedule ||
      schedule.controlWizard?.organizationId !== organizationId
    ) {
      throw new BadRequestException('Invalid schedule id');
    }

    const existingSchedule =
      await this.controlWizardReportScheduleRepository.findOne({
        where: { reportId: payload.reportId, scheduleId: schedule.id },
      });

    if (existingSchedule) {
      throw new BadRequestException('Report already assigned to schedule');
    }

    const newSchedule = this.controlWizardReportScheduleRepository.create({
      reportId: payload.reportId,
      scheduleId: schedule.id,
      autoDistribute: payload.autoDistribute,
    });

    await this.controlWizardReportScheduleRepository.save(newSchedule);

    return newSchedule;
  }

  async upsertControlWizardApproval(
    organizationId: string,
    payload: UpsertControlWizardApprovalDto,
  ) {
    const controlWizard = await this.controlWizardRepository.findOne({
      where: {
        id: payload.controlWizardId,
        organizationId,
        type: ControlWizardType.CUSTOM,
      },
    });

    if (!controlWizard) {
      throw new BadRequestException('Invalid control wizard id');
    }

    // Validate form/report if provided
    if (payload.formId) {
      const form = await this.controlWizardFormRepository.findOne({
        where: { id: payload.formId, controlWizardId: payload.controlWizardId },
      });
      if (!form) {
        throw new BadRequestException('Invalid form id');
      }
    }

    if (payload.reportId) {
      const report = await this.controlWizardReportRepository.findOne({
        where: { id: payload.reportId },
        relations: ['controlWizard'],
      });
      if (!report || report.controlWizard?.id !== payload.controlWizardId) {
        throw new BadRequestException('Invalid report id');
      }
    }

    const approvalData = {
      ...(payload.isNew && { controlWizardId: payload.controlWizardId }),
      ...(payload.formId && { formId: payload.formId }),
      ...(payload.reportId && { reportId: payload.reportId }),
      type: payload.type,
      approvalConfig: payload.approvalConfig,
      escalationConfig: payload.escalationConfig,
      ...(payload.dueDate && { dueDate: new Date(payload.dueDate) }),
    };

    let approval: ControlWizardApproval | null = null;

    if (payload.isNew) {
      approval = this.controlWizardApprovalRepository.create(approvalData);
      await this.controlWizardApprovalRepository.save(approval);

      // Create stages if provided
      if (payload.stages?.length) {
        for (const stageDto of payload.stages) {
          await this.upsertControlWizardApprovalStage(
            organizationId,
            approval.id,
            stageDto,
          );
        }
      }
    } else {
      const updateResult = await this.controlWizardApprovalRepository.update(
        { id: payload.approvalId },
        approvalData,
      );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update control wizard approval',
        );
      }

      approval = await this.controlWizardApprovalRepository.findOne({
        where: { id: payload.approvalId },
        relations: ['controlWizard', 'stages'],
      });

      // Update stages if provided
      if (payload.stages?.length) {
        for (const stageDto of payload.stages) {
          await this.upsertControlWizardApprovalStage(
            organizationId,
            approval!.id,
            stageDto,
          );
        }
      }
    }

    return approval;
  }

  async upsertControlWizardApprovalStage(
    organizationId: string,
    approvalId: string,
    payload: UpsertControlWizardApprovalStageDto,
  ) {
    const approval = await this.controlWizardApprovalRepository.findOne({
      where: { id: approvalId },
      relations: ['controlWizard'],
    });

    if (
      !approval ||
      approval.controlWizard?.organizationId !== organizationId
    ) {
      throw new BadRequestException('Invalid approval id');
    }

    const stageData = {
      ...(payload.isNew && { approvalId }),
      stageNumber: payload.stageNumber,
      title: payload.title,
      description: payload.description,
      approvers: payload.approvers,
      requiredApprovals: payload.requiredApprovals,
      timeoutHours: payload.timeoutHours,
      escalationConfig: payload.escalationConfig,
    };

    if (payload.isNew) {
      const stage = this.controlWizardApprovalStageRepository.create(stageData);
      return await this.controlWizardApprovalStageRepository.save(stage);
    } else {
      const updateResult =
        await this.controlWizardApprovalStageRepository.update(
          { id: payload.stageId },
          stageData,
        );

      if (updateResult.affected === 0) {
        throw new InternalServerErrorException(
          'Failed to update approval stage',
        );
      }

      return await this.controlWizardApprovalStageRepository.findOne({
        where: { id: payload.stageId },
        relations: ['approval'],
      });
    }
  }

  async submitApprovalDecision(
    organizationId: string,
    userId: string,
    payload: SubmitApprovalDecisionDto,
  ) {
    const approval = await this.controlWizardApprovalRepository.findOne({
      where: { id: payload.approvalId },
      relations: ['controlWizard', 'stages'],
    });

    if (
      !approval ||
      approval.controlWizard?.organizationId !== organizationId
    ) {
      throw new BadRequestException('Invalid approval id');
    }

    let approvalSubmission: ControlApprovalSubmission | null = null;
    // if no stage id, this is processed as a new submission
    if (!payload.stageId) {
      // this is processed as a new submission but first validate if there is a pending submission
      // where the user is the approver
      const isAnySubmissionPending =
        await this.controlApprovalSubmissionRepository.findOne({
          where: {
            status: ApprovalSubmissionStatus.PENDING,
            approval: {
              stages: {
                approvers: {
                  userId: userId,
                  isRequired: true,
                },
              },
            },
          },
          relations: ['approval', 'approval.stages'],
        });

      if (isAnySubmissionPending) {
        throw new BadRequestException(
          'You have a pending submission for your approval. Please decide on the pending submission first.',
        );
      }

      const newSubmission = this.controlApprovalSubmissionRepository.create({
        approvalId: payload.approvalId,
        controlWizardId: approval.controlWizardId,
        status: ApprovalSubmissionStatus.PENDING,
      });

      approvalSubmission =
        await this.controlApprovalSubmissionRepository.save(newSubmission);

      return this.controlApprovalSubmissionRepository.findOne({
        where: { id: approvalSubmission.id },
        relations: ['stagesSubmissions'],
      });
    }

    approvalSubmission = await this.controlApprovalSubmissionRepository.findOne(
      {
        where: { approvalId: payload.approvalId },
      },
    );

    if (!approvalSubmission) {
      throw new BadRequestException('Invalid approval id');
    }

    const stage = approval.stages.find((s) => s.id === payload.stageId);
    if (!stage) {
      throw new BadRequestException('Invalid stage id');
    }

    // Check if user is authorized to approve this stage
    const userApprover = stage.approvers.find((a) => a.userId === userId);
    if (!userApprover) {
      throw new BadRequestException(
        'You are not authorized to approve this stage, please contact the administrator.',
      );
    }

    if (payload.decision === StageStatus.SKIPPED && userApprover.isRequired) {
      throw new BadRequestException(
        'You cannot skip this stage, it is required for the approval process.',
      );
    }

    const approvalStageSubmission =
      await this.controlApprovalStageSubmissionRepository.findOne({
        where: { approvalStageId: stage.id, userId: userId },
      });

    if (!approvalStageSubmission) {
      const newApprovalStageSubmission =
        this.controlApprovalStageSubmissionRepository.create({
          approvalStageId: stage.id,
          userId: userId,
          status: payload.decision,
          comments: payload.comment ? [payload.comment] : [],
          attachments: payload.attachments,
          decidedAt: [StageStatus.APPROVED, StageStatus.REJECTED].includes(
            payload.decision,
          )
            ? new Date()
            : undefined,
          approvalSubmissionId: approvalSubmission.id,
        });

      await this.controlApprovalStageSubmissionRepository.save(
        newApprovalStageSubmission,
      );
    } else {
      await this.controlApprovalStageSubmissionRepository.update(
        { id: approvalStageSubmission.id },
        {
          status: payload.decision,
          decidedAt: [StageStatus.APPROVED, StageStatus.REJECTED].includes(
            payload.decision,
          )
            ? new Date()
            : undefined,
          comments: payload.comment
            ? [...(approvalStageSubmission.comments || []), payload.comment]
            : [],
          attachments: payload.attachments
            ? [
                ...(approvalStageSubmission.attachments || []),
                ...payload.attachments,
              ]
            : [],
        },
      );

      await this.controlApprovalStageSubmissionRepository.save(
        approvalStageSubmission,
      );
    }

    const currentSubmissionState =
      await this.controlApprovalSubmissionRepository.findOne({
        where: { id: approvalSubmission.id },
        relations: ['stagesSubmissions'],
      });

    if (
      currentSubmissionState &&
      currentSubmissionState.stagesSubmissions.every(
        (s) => s.status === StageStatus.APPROVED,
      )
    ) {
      await this.controlApprovalSubmissionRepository.update(
        { id: approvalSubmission.id },
        { status: ApprovalSubmissionStatus.COMPLETED, completedAt: new Date() },
      );
    }

    return currentSubmissionState;
  }

  async getControlWizardApprovals(
    controlWizardId: string,
    organizationId: string,
  ) {
    const approvals = await this.controlWizardApprovalRepository.find({
      where: { controlWizardId },
      relations: ['controlWizard', 'stages'],
    });

    // Verify organization ownership
    if (
      approvals.some(
        (approval) => approval.controlWizard?.organizationId !== organizationId,
      )
    ) {
      throw new BadRequestException('Invalid control wizard id');
    }

    return approvals;
  }

  // async inviteUserToPortal(
  //   organizationId: string,
  //   payload: InviteUserToPortalDto,
  // ) {
  //   // Check if user already exists
  //   const existingUser = await this.userRepository.findOne({
  //     where: { email: payload.email, organizationId },
  //   });

  //   if (existingUser) {
  //     throw new BadRequestException('User already exists in the organization');
  //   }

  //   // Create user invitation (you might want to use a separate invitation entity)
  //   const newUser = this.userRepository.create({
  //     organizationId,
  //     email: payload.email,
  //     firstName: payload.firstName,
  //     lastName: payload.lastName,
  //     isEmailVerified: false,
  //     invitedAt: new Date(),
  //     // Add other required fields based on your User entity
  //   });

  //   await this.userRepository.save(newUser);

  //   // TODO: Send invitation email
  //   // TODO: Create user roles if provided

  //   return newUser;
  // }

  // async getOrganizationUsers(organizationId: string) {
  //   return await this.userRepository.find({
  //     where: { organizationId },
  //     select: ['id', 'email', 'firstName', 'lastName', 'createdAt', 'isActive'],
  //   });
  // }

  // async removeFormField(
  //   organizationId: string,
  //   controlWizardId: string,
  //   fieldId: string,
  // ) {
  //   const controlWizard = await this.controlWizardRepository.findOne({
  //     where: {
  //       id: controlWizardId,
  //       organizationId,
  //       type: ControlWizardType.CUSTOM,
  //     },
  //   });

  //   if (!controlWizard) {
  //     throw new BadRequestException('Invalid control wizard id');
  //   }

  //   const field = await this.controlWizardFormFieldRepository.findOne({
  //     where: { id: fieldId },
  //     relations: ['form'],
  //   });

  //   if (!field || field.form.controlWizardId !== controlWizardId) {
  //     throw new BadRequestException('Invalid form field id');
  //   }

  //   await this.controlWizardFormFieldRepository.delete({ id: fieldId });

  //   return { success: true, message: 'Form field removed successfully' };
  // }

  // async removeForm(
  //   organizationId: string,
  //   controlWizardId: string,
  //   formId: string,
  // ) {
  //   const controlWizard = await this.controlWizardRepository.findOne({
  //     where: {
  //       id: controlWizardId,
  //       organizationId,
  //       type: ControlWizardType.CUSTOM,
  //     },
  //   });

  //   if (!controlWizard) {
  //     throw new BadRequestException('Invalid control wizard id');
  //   }

  //   const form = await this.controlWizardFormRepository.findOne({
  //     where: { id: formId, controlWizardId },
  //   });

  //   if (!form) {
  //     throw new BadRequestException('Invalid form id');
  //   }

  //   await this.controlWizardFormRepository.delete({ id: formId });

  //   return { success: true, message: 'Form removed successfully' };
  // }
}
