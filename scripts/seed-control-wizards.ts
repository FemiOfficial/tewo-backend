import { DataSource } from 'typeorm';
import {
  ControlWizard,
  ControlWizardSchedule,
  ControlWizardForm,
  ControlWizardFormField,
  ControlWizardDocument,
  ControlWizardApproval,
  ControlWizardReport,
  ControlWizardType,
  ControlWizardStatus,
  ControlWizardMode,
  ScheduleInterval,
  ExecutionMethod,
  FormType,
  FieldType,
  FieldValidation,
  DocumentType,
  DocumentStatus,
  ApprovalType,
  ApprovalStatus,
  ReportType,
  ReportFormat,
} from '../src/shared/db/typeorm/entities/control-wizard';
import {
  Organization,
  Control,
  ControlCategory,
  Framework,
  User,
} from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';
import * as wizardConfigs from './control-wizard-configs.json';

interface WizardConfig {
  title: string;
  description: string;
  type: string;
  status: string;
  mode: string;
  isRecurring: boolean;
  requiresApproval: boolean;
  requiresEvidence: boolean;
  generatesReport: boolean;
  categorySpecificConfig: Record<string, any>;
  metadata: Record<string, any>;
  schedule?: {
    interval: string;
    method: string;
    startDate: string;
    preferredTime: string;
    scheduleConfig: Record<string, any>;
  };
  form?: {
    type: string;
    title: string;
    description: string;
    config: Record<string, any>;
    fields: Array<{
      fieldKey: string;
      label: string;
      description: string;
      type: string;
      options: Record<string, any>;
      validation: Record<string, any>;
      isRequired: boolean;
      order: number;
      scoring?: Record<string, any>;
    }>;
  };
  document?: {
    type: string;
    title: string;
    description: string;
    status: string;
    config: Record<string, any>;
    metadata: Record<string, any>;
  };
  approval?: {
    type: string;
    config: Record<string, any>;
    escalationConfig: Record<string, any>;
  };
  report?: {
    type: string;
    title: string;
    description: string;
    config: Record<string, any>;
    contentConfig: Record<string, any>;
    distributionConfig: Record<string, any>;
  };
}

async function seedControlWizards() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Get existing data
    const organizations = await getOrganizations(dataSource);
    const frameworks = await getFrameworks(dataSource);
    const controlCategories = await getControlCategories(dataSource);
    const users = await getUsers(dataSource);

    if (!frameworks.length || !controlCategories.length || !users.length) {
      throw new Error(
        'Required data not found. Please run other seed files first.',
      );
    }

    console.log('📋 Found existing data:');
    console.log(`- Organizations: ${organizations.length}`);
    console.log(`- Frameworks: ${frameworks.length}`);
    console.log(`- Control Categories: ${controlCategories.length}`);
    console.log(`- Users: ${users.length}`);

    // Create Data Privacy Wizards
    const dataPrivacyWizards = await createWizardsFromConfig(
      dataSource,
      wizardConfigs.dataPrivacyWizards,
      'Data Privacy',
      frameworks,
      controlCategories,
      users[0], // Use first user as creator
      organizations.length > 0 ? organizations[0] : null, // Optional organization
    );
    console.log('✅ Data Privacy wizards created');

    // Create Access Controls Wizards
    const accessControlWizards = await createWizardsFromConfig(
      dataSource,
      wizardConfigs.accessControlWizards,
      'Access Controls',
      frameworks,
      controlCategories,
      users[0], // Use first user as creator
      organizations.length > 0 ? organizations[0] : null, // Optional organization
    );
    console.log('✅ Access Controls wizards created');

    console.log('🎉 Control Wizard seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${dataPrivacyWizards.length} Data Privacy wizards`);
    console.log(
      `- Created ${accessControlWizards.length} Access Controls wizards`,
    );

    dataPrivacyWizards.forEach((wizard) => {
      console.log(`  - Data Privacy: ${wizard.title}`);
    });

    accessControlWizards.forEach((wizard) => {
      console.log(`  - Access Controls: ${wizard.title}`);
    });
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
  }
}

async function getOrganizations(
  dataSource: DataSource,
): Promise<Organization[]> {
  const orgRepository = dataSource.getRepository(Organization);
  return await orgRepository.find();
}

async function getFrameworks(dataSource: DataSource): Promise<Framework[]> {
  const frameworkRepository = dataSource.getRepository(Framework);
  return await frameworkRepository.find();
}

async function getControlCategories(
  dataSource: DataSource,
): Promise<ControlCategory[]> {
  const categoryRepository = dataSource.getRepository(ControlCategory);
  return await categoryRepository.find();
}

async function getUsers(dataSource: DataSource): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
  return await userRepository.find();
}

async function createWizardsFromConfig(
  dataSource: DataSource,
  wizardConfigs: WizardConfig[],
  categoryName: string,
  frameworks: Framework[],
  controlCategories: ControlCategory[],
  creator: User,
  organization: Organization | null,
): Promise<ControlWizard[]> {
  const wizardRepository = dataSource.getRepository(ControlWizard);
  const scheduleRepository = dataSource.getRepository(ControlWizardSchedule);
  const formRepository = dataSource.getRepository(ControlWizardForm);
  const fieldRepository = dataSource.getRepository(ControlWizardFormField);
  const documentRepository = dataSource.getRepository(ControlWizardDocument);
  const approvalRepository = dataSource.getRepository(ControlWizardApproval);
  const reportRepository = dataSource.getRepository(ControlWizardReport);

  const category = controlCategories.find((cat) => cat.name === categoryName);
  if (!category) {
    throw new Error(`Category '${categoryName}' not found`);
  }

  // Determine framework based on category
  let framework: Framework;
  if (categoryName === 'Data Privacy') {
    framework =
      frameworks.find((fw) => fw.shortCode === 'GDPR') ||
      frameworks.find((fw) => fw.shortCode === 'SOC2') ||
      frameworks[0];
  } else if (categoryName === 'Access Controls') {
    framework =
      frameworks.find((fw) => fw.shortCode === 'SOC2') ||
      frameworks.find((fw) => fw.shortCode === 'ISO27001') ||
      frameworks[0];
  } else {
    framework = frameworks[0];
  }

  if (!framework) {
    throw new Error('No suitable framework found');
  }

  const wizards: ControlWizard[] = [];

  for (const config of wizardConfigs) {
    // Create the main wizard
    const wizardData: any = {
      categoryId: category.id,
      frameworkId: framework.id,
      title: config.title,
      description: config.description,
      type: mapWizardType(config.type),
      status: mapWizardStatus(config.status),
      mode: mapWizardMode(config.mode),
      isRecurring: config.isRecurring,
      requiresApproval: config.requiresApproval,
      requiresEvidence: config.requiresEvidence,
      generatesReport: config.generatesReport,
      categorySpecificConfig: config.categorySpecificConfig,
      metadata: config.metadata,
      createdByUserId: creator.id,
    };

    // Only set organizationId if organization exists
    if (organization) {
      wizardData.organizationId = organization.id;
    }

    const wizard = wizardRepository.create(wizardData);
    const savedWizard = await wizardRepository.save(wizard);
    wizards.push(savedWizard);

    // Create schedule if specified
    if (config.schedule) {
      const schedule = scheduleRepository.create({
        controlWizardId: savedWizard.id,
        interval: mapScheduleInterval(config.schedule.interval),
        method: mapExecutionMethod(config.schedule.method),
        startDate: new Date(config.schedule.startDate),
        preferredTime: config.schedule.preferredTime,
        scheduleConfig: config.schedule.scheduleConfig,
        isActive: true,
      });
      await scheduleRepository.save(schedule);
    }

    // Create form if specified
    if (config.form) {
      const form = formRepository.create({
        controlWizardId: savedWizard.id,
        type: mapFormType(config.form.type),
        title: config.form.title,
        description: config.form.description,
        formConfig: config.form.config,
        isActive: true,
        version: 1,
      });
      const savedForm = await formRepository.save(form);

      // Create form fields
      for (const fieldConfig of config.form.fields) {
        const field = fieldRepository.create({
          formId: savedForm.id,
          fieldKey: fieldConfig.fieldKey,
          label: fieldConfig.label,
          description: fieldConfig.description,
          type: mapFieldType(fieldConfig.type),
          options: fieldConfig.options,
          validation: mapValidation(fieldConfig.validation),
          isRequired: fieldConfig.isRequired,
          order: fieldConfig.order,
          scoring: fieldConfig.scoring,
        });
        await fieldRepository.save(field);
      }
    }

    // Create document if specified
    if (config.document) {
      const document = documentRepository.create({
        controlWizardId: savedWizard.id,
        type: mapDocumentType(config.document.type),
        title: config.document.title,
        description: config.document.description,
        status: mapDocumentStatus(config.document.status),
        documentConfig: config.document.config,
        metadata: config.document.metadata,
        assignedUserId: creator.id,
      });
      await documentRepository.save(document);
    }

    // Create approval if specified
    if (config.approval) {
      const approval = approvalRepository.create({
        controlWizardId: savedWizard.id,
        type: mapApprovalType(config.approval.type),
        status: ApprovalStatus.PENDING,
        approvalConfig: config.approval.config,
        escalationConfig: config.approval.escalationConfig,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });
      await approvalRepository.save(approval);
    }

    // Create report if specified
    if (config.report) {
      const report = reportRepository.create({
        controlWizardId: savedWizard.id,
        type: mapReportType(config.report.type),
        title: config.report.title,
        description: config.report.description,
        reportConfig: config.report.config,
        contentConfig: config.report.contentConfig,
        distributionConfig: {
          recipients: [creator.id],
          ccRecipients: [],
          bccRecipients: [],
          ...config.report.distributionConfig,
        },
        isActive: true,
      });
      await reportRepository.save(report);
    }
  }

  return wizards;
}

// Mapping functions
function mapWizardType(type: string): ControlWizardType {
  switch (type) {
    case 'system_defined':
      return ControlWizardType.SYSTEM_DEFINED;
    case 'custom':
      return ControlWizardType.CUSTOM;
    default:
      return ControlWizardType.CUSTOM;
  }
}

function mapWizardStatus(status: string): ControlWizardStatus {
  switch (status) {
    case 'active':
      return ControlWizardStatus.ACTIVE;
    case 'draft':
      return ControlWizardStatus.DRAFT;
    case 'paused':
      return ControlWizardStatus.PAUSED;
    case 'archived':
      return ControlWizardStatus.ARCHIVED;
    default:
      return ControlWizardStatus.DRAFT;
  }
}

function mapWizardMode(mode: string): ControlWizardMode {
  switch (mode) {
    case 'automated':
      return ControlWizardMode.AUTOMATED;
    case 'manual':
      return ControlWizardMode.MANUAL;
    case 'hybrid':
      return ControlWizardMode.HYBRID;
    case 'workflow':
      return ControlWizardMode.WORKFLOW;
    default:
      return ControlWizardMode.MANUAL;
  }
}

function mapScheduleInterval(interval: string): ScheduleInterval {
  switch (interval) {
    case 'daily':
      return ScheduleInterval.DAILY;
    case 'weekly':
      return ScheduleInterval.WEEKLY;
    case 'monthly':
      return ScheduleInterval.MONTHLY;
    case 'quarterly':
      return ScheduleInterval.QUARTERLY;
    case 'semi_annually':
      return ScheduleInterval.SEMI_ANNUALLY;
    case 'annually':
      return ScheduleInterval.ANNUALLY;
    default:
      return ScheduleInterval.MONTHLY;
  }
}

function mapExecutionMethod(method: string): ExecutionMethod {
  switch (method) {
    case 'automated':
      return ExecutionMethod.AUTOMATED;
    case 'manual':
      return ExecutionMethod.MANUAL;
    case 'hybrid':
      return ExecutionMethod.HYBRID;
    default:
      return ExecutionMethod.MANUAL;
  }
}

function mapFormType(type: string): FormType {
  switch (type) {
    case 'assessment':
      return FormType.ASSESSMENT;
    case 'checklist':
      return FormType.CHECKLIST;
    case 'questionnaire':
      return FormType.QUESTIONNAIRE;
    case 'audit_form':
      return FormType.AUDIT_FORM;
    case 'incident_report':
      return FormType.INCIDENT_REPORT;
    case 'risk_assessment':
      return FormType.RISK_ASSESSMENT;
    case 'compliance_review':
      return FormType.COMPLIANCE_REVIEW;
    default:
      return FormType.QUESTIONNAIRE;
  }
}

function mapFieldType(type: string): FieldType {
  switch (type) {
    case 'text':
      return FieldType.TEXT;
    case 'textarea':
      return FieldType.TEXTAREA;
    case 'select':
      return FieldType.SELECT;
    case 'multi_select':
      return FieldType.MULTI_SELECT;
    case 'boolean':
      return FieldType.BOOLEAN;
    case 'number':
      return FieldType.NUMBER;
    case 'date':
      return FieldType.DATE;
    case 'time':
      return FieldType.TIME;
    case 'datetime':
      return FieldType.DATETIME;
    case 'file_upload':
      return FieldType.FILE_UPLOAD;
    case 'signature':
      return FieldType.SIGNATURE;
    case 'rating':
      return FieldType.RATING;
    case 'matrix':
      return FieldType.MATRIX;
    case 'conditional':
      return FieldType.CONDITIONAL;
    default:
      return FieldType.TEXT;
  }
}

function mapValidation(validation: Record<string, any>): Record<string, any> {
  if (!validation) return {};

  const mappedValidation: Record<string, any> = { ...validation };

  if (validation.rules) {
    mappedValidation.rules = validation.rules.map((rule: string) => {
      switch (rule) {
        case 'required':
          return FieldValidation.REQUIRED;
        case 'email':
          return FieldValidation.EMAIL;
        case 'url':
          return FieldValidation.URL;
        case 'phone':
          return FieldValidation.PHONE;
        case 'min_length':
          return FieldValidation.MIN_LENGTH;
        case 'max_length':
          return FieldValidation.MAX_LENGTH;
        case 'min_value':
          return FieldValidation.MIN_VALUE;
        case 'max_value':
          return FieldValidation.MAX_VALUE;
        case 'pattern':
          return FieldValidation.PATTERN;
        case 'custom':
          return FieldValidation.CUSTOM;
        default:
          return FieldValidation.REQUIRED;
      }
    });
  }

  return mappedValidation;
}

function mapDocumentType(type: string): DocumentType {
  switch (type) {
    case 'policy':
      return DocumentType.POLICY;
    case 'procedure':
      return DocumentType.PROCEDURE;
    case 'standard':
      return DocumentType.STANDARD;
    case 'guideline':
      return DocumentType.GUIDELINE;
    case 'template':
      return DocumentType.TEMPLATE;
    case 'checklist':
      return DocumentType.CHECKLIST;
    case 'report':
      return DocumentType.REPORT;
    case 'certificate':
      return DocumentType.CERTIFICATE;
    case 'contract':
      return DocumentType.CONTRACT;
    case 'audit_trail':
      return DocumentType.AUDIT_TRAIL;
    default:
      return DocumentType.POLICY;
  }
}

function mapDocumentStatus(status: string): DocumentStatus {
  switch (status) {
    case 'draft':
      return DocumentStatus.DRAFT;
    case 'under_review':
      return DocumentStatus.UNDER_REVIEW;
    case 'approved':
      return DocumentStatus.APPROVED;
    case 'published':
      return DocumentStatus.PUBLISHED;
    case 'archived':
      return DocumentStatus.ARCHIVED;
    case 'expired':
      return DocumentStatus.EXPIRED;
    default:
      return DocumentStatus.DRAFT;
  }
}

function mapApprovalType(type: string): ApprovalType {
  switch (type) {
    case 'sequential':
      return ApprovalType.SEQUENTIAL;
    case 'parallel':
      return ApprovalType.PARALLEL;
    case 'any_one':
      return ApprovalType.ANY_ONE;
    case 'majority':
      return ApprovalType.MAJORITY;
    case 'all':
      return ApprovalType.ALL;
    default:
      return ApprovalType.SEQUENTIAL;
  }
}

function mapReportType(type: string): ReportType {
  switch (type) {
    case 'compliance_report':
      return ReportType.COMPLIANCE_REPORT;
    case 'audit_report':
      return ReportType.AUDIT_REPORT;
    case 'risk_assessment':
      return ReportType.RISK_ASSESSMENT;
    case 'incident_report':
      return ReportType.INCIDENT_REPORT;
    case 'access_review':
      return ReportType.ACCESS_REVIEW;
    case 'policy_review':
      return ReportType.POLICY_REVIEW;
    case 'performance_metrics':
      return ReportType.PERFORMANCE_METRICS;
    case 'executive_summary':
      return ReportType.EXECUTIVE_SUMMARY;
    default:
      return ReportType.COMPLIANCE_REPORT;
  }
}

// Run the seed function
if (require.main === module) {
  seedControlWizards()
    .then(() => {
      console.log('🎉 Control Wizard seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedControlWizards };
