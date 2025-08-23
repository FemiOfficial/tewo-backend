import { MigrationInterface, QueryRunner } from 'typeorm';

export class ControlWizardMigrations1755959657510
  implements MigrationInterface
{
  name = 'ControlWizardMigrations1755959657510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_executions_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'failed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_executions_type_enum" AS ENUM('scheduled', 'manual', 'on_demand')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_executions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduleId" uuid NOT NULL, "status" "public"."control_wizard_executions_status_enum" NOT NULL, "type" "public"."control_wizard_executions_type_enum" NOT NULL, "scheduledAt" TIMESTAMP NOT NULL, "startedAt" TIMESTAMP, "completedAt" TIMESTAMP, "executionResult" jsonb, "executedByUserId" uuid, "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f42ef522d0e5c415e21e69126b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_schedules_interval_enum" AS ENUM('daily', 'weekly', 'monthly', 'quarterly', 'semi_annually', 'annually', 'custom')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_schedules_method_enum" AS ENUM('automated', 'manual', 'hybrid')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardId" uuid NOT NULL, "interval" "public"."control_wizard_schedules_interval_enum" NOT NULL, "customIntervalDays" integer, "method" "public"."control_wizard_schedules_method_enum" NOT NULL, "startDate" date NOT NULL, "endDate" date, "preferredTime" TIME, "scheduleConfig" jsonb, "isActive" boolean NOT NULL DEFAULT true, "assignedUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_156ff6976f6c68d5563b7d5445d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_form_fields_type_enum" AS ENUM('text', 'textarea', 'select', 'multi_select', 'boolean', 'number', 'date', 'time', 'datetime', 'file_upload', 'signature', 'rating', 'matrix', 'conditional')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_form_fields" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "formId" uuid NOT NULL, "fieldKey" character varying(100) NOT NULL, "label" character varying(255) NOT NULL, "description" text, "type" "public"."control_wizard_form_fields_type_enum" NOT NULL, "options" jsonb, "validation" jsonb, "isRequired" boolean NOT NULL DEFAULT false, "isConditional" boolean NOT NULL DEFAULT false, "order" integer NOT NULL DEFAULT '0', "scoring" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7114b78f9c0128900dce2d83cc8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_form_submissions_status_enum" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_form_submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "formId" uuid NOT NULL, "submittedByUserId" uuid NOT NULL, "status" "public"."control_wizard_form_submissions_status_enum" NOT NULL DEFAULT 'draft', "formData" jsonb NOT NULL, "scoring" jsonb, "comments" text, "submittedAt" TIMESTAMP, "reviewedAt" TIMESTAMP, "reviewedByUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c99c758fbd473bcc272a418e7a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_forms_type_enum" AS ENUM('assessment', 'checklist', 'questionnaire', 'audit_form', 'incident_report', 'risk_assessment', 'compliance_review')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_forms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardId" uuid NOT NULL, "type" "public"."control_wizard_forms_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "description" text, "formConfig" jsonb, "isActive" boolean NOT NULL DEFAULT true, "version" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_54a253a883b1fc66bbd7b1537bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_document_versions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "documentId" uuid NOT NULL, "versionNumber" integer NOT NULL, "title" character varying(255) NOT NULL, "description" text, "fileLocation" character varying(500), "fileType" character varying(100), "fileSize" bigint, "fileHash" character varying(64), "changeLog" jsonb, "createdByUserId" uuid NOT NULL, "isPublished" boolean NOT NULL DEFAULT false, "publishedAt" TIMESTAMP, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8f422537638306f099885340464" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_documents_type_enum" AS ENUM('policy', 'procedure', 'standard', 'guideline', 'template', 'checklist', 'report', 'certificate', 'contract', 'audit_trail')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_documents_status_enum" AS ENUM('draft', 'under_review', 'approved', 'published', 'archived', 'expired')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardId" uuid NOT NULL, "type" "public"."control_wizard_documents_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" "public"."control_wizard_documents_status_enum" NOT NULL DEFAULT 'draft', "documentConfig" jsonb, "metadata" jsonb, "assignedUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2f9f41d28f4cfe4191bfe7cb8df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_approval_stages_status_enum" AS ENUM('pending', 'in_progress', 'approved', 'rejected', 'skipped')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_approval_stages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "approvalId" uuid NOT NULL, "stageNumber" integer NOT NULL, "title" character varying(255) NOT NULL, "description" text, "status" "public"."control_wizard_approval_stages_status_enum" NOT NULL DEFAULT 'pending', "approvers" jsonb NOT NULL, "requiredApprovals" integer, "timeoutHours" integer, "escalationConfig" jsonb, "startedAt" TIMESTAMP, "completedAt" TIMESTAMP, "dueDate" TIMESTAMP, "stageResult" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_58a41064931f9cd4b2f3ed26d45" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_approvals_type_enum" AS ENUM('sequential', 'parallel', 'any_one', 'majority', 'all')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_approvals_status_enum" AS ENUM('pending', 'in_progress', 'approved', 'rejected', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_approvals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardId" uuid NOT NULL, "type" "public"."control_wizard_approvals_type_enum" NOT NULL, "status" "public"."control_wizard_approvals_status_enum" NOT NULL DEFAULT 'pending', "approvalConfig" jsonb, "escalationConfig" jsonb, "currentStageId" uuid, "dueDate" TIMESTAMP, "completedAt" TIMESTAMP, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1c1b5b1296995b686fb1aeffe4a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_report_schedules_scheduletype_enum" AS ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_report_schedules_status_enum" AS ENUM('active', 'paused', 'disabled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_report_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reportId" uuid NOT NULL, "scheduleType" "public"."control_wizard_report_schedules_scheduletype_enum" NOT NULL, "status" "public"."control_wizard_report_schedules_status_enum" NOT NULL DEFAULT 'active', "scheduleConfig" jsonb NOT NULL, "preferredTime" TIME, "startDate" date NOT NULL, "endDate" date, "autoGenerate" boolean NOT NULL DEFAULT true, "autoDistribute" boolean NOT NULL DEFAULT false, "distributionConfig" jsonb, "lastGeneratedAt" TIMESTAMP, "nextGenerationAt" TIMESTAMP, "totalGenerated" integer NOT NULL DEFAULT '0', "totalDistributed" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_33db580c95021735108497b9c6b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_reports_type_enum" AS ENUM('compliance_report', 'audit_report', 'risk_assessment', 'incident_report', 'access_review', 'policy_review', 'performance_metrics', 'executive_summary')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardId" uuid NOT NULL, "type" "public"."control_wizard_reports_type_enum" NOT NULL, "title" character varying(255) NOT NULL, "description" text, "reportConfig" jsonb NOT NULL, "contentConfig" jsonb, "distributionConfig" jsonb, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8021eab72b652d549238baa1db0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizards_type_enum" AS ENUM('default', 'system_defined', 'custom')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizards_status_enum" AS ENUM('draft', 'active', 'paused', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizards_mode_enum" AS ENUM('automated', 'manual', 'hybrid', 'workflow')`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid, "controlId" integer, "categoryId" integer NOT NULL, "frameworkId" integer NOT NULL, "title" character varying(255) NOT NULL, "description" text NOT NULL, "type" "public"."control_wizards_type_enum" NOT NULL, "status" "public"."control_wizards_status_enum" NOT NULL DEFAULT 'draft', "mode" "public"."control_wizards_mode_enum" NOT NULL, "isRecurring" boolean NOT NULL DEFAULT false, "requiresApproval" boolean NOT NULL DEFAULT false, "requiresEvidence" boolean NOT NULL DEFAULT false, "generatesReport" boolean NOT NULL DEFAULT false, "categorySpecificConfig" jsonb, "metadata" jsonb, "createdByUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_95b7a31558e14e0b567315d21fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_executions" ADD CONSTRAINT "FK_f1eccaac094727bc7188e7abb4f" FOREIGN KEY ("scheduleId") REFERENCES "control_wizard_schedules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_executions" ADD CONSTRAINT "FK_52e91736ee85ba54e7d229ee2a0" FOREIGN KEY ("executedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD CONSTRAINT "FK_ea13bfddbfbeeb812edd267459e" FOREIGN KEY ("controlWizardId") REFERENCES "control_wizards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_fields" ADD CONSTRAINT "FK_fc7b4ca4995541a9159589a8038" FOREIGN KEY ("formId") REFERENCES "control_wizard_forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" ADD CONSTRAINT "FK_48b6881c961eca761f57f86a438" FOREIGN KEY ("formId") REFERENCES "control_wizard_forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" ADD CONSTRAINT "FK_85ba7711aa7bb2359abbb8ce31d" FOREIGN KEY ("submittedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" ADD CONSTRAINT "FK_434db14993efb8b2ff0619ea538" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" ADD CONSTRAINT "FK_7b9b1186c5e998022335aeb9f25" FOREIGN KEY ("controlWizardId") REFERENCES "control_wizards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_document_versions" ADD CONSTRAINT "FK_73b0b25d8e57c8a3a4dfb9b8ae8" FOREIGN KEY ("documentId") REFERENCES "control_wizard_documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_document_versions" ADD CONSTRAINT "FK_469fcc4e940fadf2e28c5d514a0" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_documents" ADD CONSTRAINT "FK_cab3d4df3a744b8c95bddf3b22a" FOREIGN KEY ("controlWizardId") REFERENCES "control_wizards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approval_stages" ADD CONSTRAINT "FK_9eb7f2d48324bfee8c7d23220b2" FOREIGN KEY ("approvalId") REFERENCES "control_wizard_approvals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" ADD CONSTRAINT "FK_f56e6d90ccbbe779bbade9985e0" FOREIGN KEY ("controlWizardId") REFERENCES "control_wizards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD CONSTRAINT "FK_53f6f4191fdf04456a15705a78c" FOREIGN KEY ("reportId") REFERENCES "control_wizard_reports"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" ADD CONSTRAINT "FK_f3a74eec481c5c816ef229d7e0f" FOREIGN KEY ("controlWizardId") REFERENCES "control_wizards"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_d2ffb791c0b95cb6284c52852a6" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_f3afb858d98466af2435f438a9e" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_608b8b4ba4bf2ca500531bcebc4" FOREIGN KEY ("categoryId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_433e96b7ce0260c3e365108a824" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_2cfd2c29f5af33694319d71f840" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_2cfd2c29f5af33694319d71f840"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_433e96b7ce0260c3e365108a824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_608b8b4ba4bf2ca500531bcebc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_f3afb858d98466af2435f438a9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_d2ffb791c0b95cb6284c52852a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" DROP CONSTRAINT "FK_f3a74eec481c5c816ef229d7e0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP CONSTRAINT "FK_53f6f4191fdf04456a15705a78c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" DROP CONSTRAINT "FK_f56e6d90ccbbe779bbade9985e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approval_stages" DROP CONSTRAINT "FK_9eb7f2d48324bfee8c7d23220b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_documents" DROP CONSTRAINT "FK_cab3d4df3a744b8c95bddf3b22a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_document_versions" DROP CONSTRAINT "FK_469fcc4e940fadf2e28c5d514a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_document_versions" DROP CONSTRAINT "FK_73b0b25d8e57c8a3a4dfb9b8ae8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" DROP CONSTRAINT "FK_7b9b1186c5e998022335aeb9f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" DROP CONSTRAINT "FK_434db14993efb8b2ff0619ea538"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" DROP CONSTRAINT "FK_85ba7711aa7bb2359abbb8ce31d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" DROP CONSTRAINT "FK_48b6881c961eca761f57f86a438"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_fields" DROP CONSTRAINT "FK_fc7b4ca4995541a9159589a8038"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP CONSTRAINT "FK_ea13bfddbfbeeb812edd267459e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_executions" DROP CONSTRAINT "FK_52e91736ee85ba54e7d229ee2a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_executions" DROP CONSTRAINT "FK_f1eccaac094727bc7188e7abb4f"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizards"`);
    await queryRunner.query(`DROP TYPE "public"."control_wizards_mode_enum"`);
    await queryRunner.query(`DROP TYPE "public"."control_wizards_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."control_wizards_type_enum"`);
    await queryRunner.query(`DROP TABLE "control_wizard_reports"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_reports_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_report_schedules"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_report_schedules_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_report_schedules_scheduletype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_approvals"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_approvals_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_approvals_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_approval_stages"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_approval_stages_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_documents"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_documents_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_documents_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_document_versions"`);
    await queryRunner.query(`DROP TABLE "control_wizard_forms"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_forms_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_form_submissions"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_form_submissions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_form_fields"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_form_fields_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_schedules"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_schedules_method_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_schedules_interval_enum"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_executions"`);
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_executions_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_executions_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
