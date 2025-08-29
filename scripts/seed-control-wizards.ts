import { QueryRunner } from 'typeorm';
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
} from '../src/shared/db/typeorm/entities';
import {
  Organization,
  Control,
  ControlCategory,
  Framework,
  User,
} from '../src/shared/db/typeorm/entities';
import dataSource from '../typeorm.config';

// Import the JSON config

const wizardConfigs = require('./control-wizard-configs.json');

interface WizardConfig {
  title: string;
  description: string;
  mode: string;
  isRecurring: boolean;
  requiresApproval: boolean;
  requiresEvidence: boolean;
  generatesReport: boolean;
  categorySpecificConfig: Record<string, any>;
  schedules: Array<{
    title: string;
    interval: string;
    method: string;
    preferredTime?: string;
  }>;
  forms: Array<{
    title: string;
    type: string;
    description: string;
    assessmentConfig?: Record<string, any>;
    fields: Array<{
      fieldKey: string;
      label: string;
      type: string;
      isRequired: boolean;
      isConditional?: boolean;
      options?: Record<string, any>;
    }>;
  }>;
  approvals: Array<{
    title: string;
    type: string;
    stages: Array<{
      stageNumber: number;
      title: string;
    }>;
  }>;
  reports: Array<{
    title: string;
    type: string;
    templateId: string;
    description: string;
  }>;
}

async function seedControlWizards() {
  await dataSource.initialize();
  console.log('✅ Database connection established');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    // Get existing data
    const organizations = await getOrganizations(queryRunner);
    const frameworks = await getFrameworks(queryRunner);
    const controlCategories = await getControlCategories(queryRunner);
    const controls = await getControls(queryRunner);
    const users = await getUsers(queryRunner);

    const existingWizards = await getWizards(queryRunner);

    console.log('🔍 Found existing wizards:', existingWizards.length);

    if (
      !frameworks.length ||
      !controlCategories.length ||
      !controls.length ||
      !users.length
    ) {
      throw new Error(
        'Required data not found. Please run other seed files first.',
      );
    }

    console.log('📋 Found existing data:');
    console.log(`- Organizations: ${organizations.length}`);
    console.log(`- Frameworks: ${frameworks.length}`);
    console.log(`- Control Categories: ${controlCategories.length}`);
    console.log(`- Controls: ${controls.length}`);
    console.log(`- Users: ${users.length}`);

    // Create wizards for all controls
    const createdWizards = await createWizardsForAllControls(
      queryRunner,
      controls,
      controlCategories,
      frameworks,
      null, // Use first user as creator
      null, // Optional organization
      wizardConfigs as WizardConfig[],
    );

    console.log('🎉 Control Wizard seeding completed successfully!');

    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Created ${createdWizards.length} control wizards`);

    // Group wizards by category for better display
    const wizardsByCategory = createdWizards.reduce(
      (acc, wizard) => {
        const category = controlCategories.find(
          (cat) => cat.id === wizard.categoryId,
        );
        const categoryName = category?.name || 'Unknown';
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(wizard);
        return acc;
      },
      {} as Record<string, ControlWizard[]>,
    );

    Object.entries(wizardsByCategory).forEach(([category, wizards]) => {
      console.log(`\n${category}:`);
      wizards.forEach((wizard) => {
        console.log(`  - ${wizard.title}`);
      });
    });
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await queryRunner.release();
    console.log('🔌 Database connection closed');
  }
}

async function getOrganizations(
  queryRunner: QueryRunner,
): Promise<Organization[]> {
  const orgRepository = queryRunner.manager.getRepository(Organization);
  return await orgRepository.find();
}

async function getFrameworks(queryRunner: QueryRunner): Promise<Framework[]> {
  const frameworkRepository = queryRunner.manager.getRepository(Framework);
  return await frameworkRepository.find();
}

async function getControlCategories(
  queryRunner: QueryRunner,
): Promise<ControlCategory[]> {
  const categoryRepository = queryRunner.manager.getRepository(ControlCategory);
  return await categoryRepository.find();
}

async function getControls(queryRunner: QueryRunner): Promise<Control[]> {
  const controlRepository = queryRunner.manager.getRepository(Control);
  return await controlRepository.find({
    relations: ['category'],
  });
}

async function getWizards(
  queryRunner: QueryRunner,
): Promise<ControlWizardForm[]> {
  const wizardRepository = queryRunner.manager.getRepository(ControlWizardForm);
  return await wizardRepository.find();
}

async function getUsers(queryRunner: QueryRunner): Promise<User[]> {
  const userRepository = queryRunner.manager.getRepository(User);
  return await userRepository.find();
}

async function createWizardsForAllControls(
  queryRunner: QueryRunner,
  controls: Control[],
  controlCategories: ControlCategory[],
  frameworks: Framework[],
  creator: User | null,
  organization: Organization | null,
  wizardConfigs: WizardConfig[],
): Promise<ControlWizard[]> {
  const wizardRepository = queryRunner.manager.getRepository(ControlWizard);
  const scheduleRepository = queryRunner.manager.getRepository(
    ControlWizardSchedule,
  );
  const formRepository = queryRunner.manager.getRepository(ControlWizardForm);
  const fieldRepository = queryRunner.manager.getRepository(
    ControlWizardFormField,
  );
  const documentRepository = queryRunner.manager.getRepository(
    ControlWizardDocument,
  );
  const approvalRepository = queryRunner.manager.getRepository(
    ControlWizardApproval,
  );
  const reportRepository =
    queryRunner.manager.getRepository(ControlWizardReport);

  const wizards: ControlWizard[] = [];

  for (const control of controls) {
    const category = controlCategories.find(
      (cat) => cat.id === control.categoryId,
    );
    if (!category) {
      console.warn(`⚠️  Control ${control.title} has no category, skipping...`);
      continue;
    }

    // Find matching wizard config by title similarity
    const matchingConfig = findMatchingWizardConfig(
      control.title,
      wizardConfigs,
    );

    if (!matchingConfig) {
      console.warn(
        `⚠️  No matching wizard config found for control ${control.title}, using default...`,
      );
      continue;
    }

    // Determine framework based on category
    let framework: Framework;
    if (category.name === 'Data Privacy') {
      framework =
        frameworks.find((fw) => fw.shortCode === 'GDPR') ||
        frameworks.find((fw) => fw.shortCode === 'NDPR') ||
        frameworks[0];
    } else if (category.name === 'Access Controls') {
      framework =
        frameworks.find((fw) => fw.shortCode === 'SOC2') ||
        frameworks.find((fw) => fw.shortCode === 'ISO27001') ||
        frameworks[0];
    } else {
      framework = frameworks[0];
    }

    if (!framework) {
      console.warn(
        `⚠️  No suitable framework found for category ${category.name}, skipping...`,
      );
      continue;
    }

    // // Create wizard title and description based on control
    const wizardTitle = `${control.title} - Compliance Wizard`;
    const wizardDescription = `Automated compliance wizard for ${control.title.toLowerCase()}. ${control.description}`;

    // // Create the main wizard
    const wizardData = {
      controlId: control.id,
      categoryId: category.id,
      title: wizardTitle,
      description: wizardDescription,
      type: ControlWizardType.SYSTEM_DEFINED,
      status: ControlWizardStatus.ACTIVE,
      mode: mapWizardMode(matchingConfig.mode),
      isRecurring: matchingConfig.isRecurring,
      requiresApproval: matchingConfig.requiresApproval,
      requiresEvidence: matchingConfig.requiresEvidence,
      generatesReport: matchingConfig.generatesReport,
      categorySpecificConfig: matchingConfig.categorySpecificConfig,
      metadata: {
        tags: [category.name, framework.shortCode, 'Compliance', 'Automated'],
        complianceLevel: 'Standard',
        riskLevel: 'Medium',
        controlMapping: {
          controlId: control.id,
          controlIdString: control.controlIdString,
        },
      },
      ...(creator && { createdByUserId: creator.id }),
      ...(organization && { organizationId: organization.id }),
    };

    const wizard = wizardRepository.create(wizardData);
    const savedWizard = await wizardRepository.save(wizard);
    wizards.push(savedWizard);

    if (matchingConfig?.schedules?.length > 0 && matchingConfig.isRecurring) {
      // // Create schedules
      for (const scheduleConfig of matchingConfig.schedules) {
        const schedule = scheduleRepository.create({
          controlWizardId: savedWizard.id,
          interval: mapScheduleInterval(scheduleConfig.interval),
          method: mapExecutionMethod(scheduleConfig.method),
          startDate: new Date(),
          preferredTime: scheduleConfig.preferredTime || '09:00:00',
          scheduleConfig: {},
          isActive: true,
        });
        await scheduleRepository.save(schedule);
      }
    }

    if (matchingConfig?.forms?.length > 0) {
      // // Create forms
      for (const formConfig of matchingConfig.forms) {
        const form = formRepository.create({
          controlWizardId: savedWizard.id,
          type: mapFormType(formConfig.type),
          title: formConfig.title,
          description: formConfig.description,
          formConfig: {
            allowPartialSave: true,
            requireCompletion: true,
            scoringEnabled: true,
            passingScore: 80,
            ...formConfig.assessmentConfig,
          },
          isActive: true,
          version: 1,
        });
        const savedForm = await formRepository.save(form);

        // Create form fields
        for (const fieldConfig of formConfig.fields) {
          const field = fieldRepository.create({
            formId: savedForm.id,
            fieldKey: fieldConfig.fieldKey,
            label: fieldConfig.label,
            description: '',
            type: mapFieldType(fieldConfig.type),
            options: fieldConfig.options || {},
            validation: {
              rules: fieldConfig.isRequired ? [FieldValidation.REQUIRED] : [],
            },
            isRequired: fieldConfig.isRequired,
            order: 1,
            scoring: { points: 10, weight: 1 },
          });
          await fieldRepository.save(field);
        }
      }
    }

    // // Create document
    const document = documentRepository.create({
      controlWizardId: savedWizard.id,
      type: DocumentType.POLICY,
      title: `${control.title} Compliance Document`,
      description: `Compliance documentation for ${control.title.toLowerCase()}`,
      status: DocumentStatus.DRAFT,
      documentConfig: {
        requireApproval: true,
        autoExpiry: true,
        expiryDays: 365,
        versioningEnabled: true,
      },
      metadata: {
        tags: [category.name, 'Policy', 'Compliance'],
        department: 'Compliance',
        owner: 'Compliance Team',
        classification: 'Internal',
      },
    });
    await documentRepository.save(document);

    if (
      matchingConfig?.approvals?.length > 0 &&
      matchingConfig.requiresApproval
    ) {
      // // Create approvals
      for (const approvalConfig of matchingConfig.approvals) {
        const approval = approvalRepository.create({
          controlWizardId: savedWizard.id,
          type: mapApprovalType(approvalConfig.type),
          status: ApprovalStatus.PENDING,
          approvalConfig: {
            requireComments: true,
            allowDelegation: true,
            autoEscalation: true,
            escalationHours: 48,
          },
          escalationConfig: {},
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });
        await approvalRepository.save(approval);
      }
    }

    if (matchingConfig?.reports?.length > 0 && matchingConfig.generatesReport) {
      for (const reportConfig of matchingConfig.reports) {
        const reportData = {
          controlWizardId: savedWizard.id,
          title: reportConfig.title,
          description: reportConfig.description,
          type: mapReportType(reportConfig.type),
          templateId: reportConfig.templateId,
          reportConfig: {
            formats: ['pdf', 'excel'] as ReportFormat[],
            includeCharts: true,
            includeTables: true,
            includeAttachments: false,
          },
          contentConfig: {
            sections: [
              { title: 'Executive Summary', type: 'summary', required: true },
              { title: 'Compliance Score', type: 'metrics', required: true },
              { title: 'Action Items', type: 'actions', required: true },
            ],
          },
          distributionConfig: {
            recipients: [],
            ccRecipients: [],
            bccRecipients: [],
            autoSend: false,
            sendOnCompletion: false,
          },
          isActive: true,
        };
        const report = reportRepository.create(reportData);
        await reportRepository.save(report);
      }
    }

    // // Create reports

    // console.log(`✅ Created wizard for control: ${control.title}`);
  }

  await queryRunner.commitTransaction();

  return wizards;
}

function findMatchingWizardConfig(
  controlTitle: string,
  wizardConfigs: WizardConfig[],
): WizardConfig | null {
  // Simple matching logic - you can enhance this
  const controlLower = controlTitle.toLowerCase();

  return (
    wizardConfigs.find((config) =>
      config.title.toLowerCase().includes(controlLower),
    ) || null
  );
}

// Mapping functions
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
      return ControlWizardMode.HYBRID;
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
    case 'custom':
      return FormType.QUESTIONNAIRE;
    default:
      return FormType.ASSESSMENT;
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
    case 'security_report':
      return ReportType.COMPLIANCE_REPORT; // Fallback
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
