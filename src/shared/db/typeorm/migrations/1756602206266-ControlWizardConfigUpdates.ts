import { MigrationInterface, QueryRunner } from 'typeorm';

export class Undefined1756602206266 implements MigrationInterface {
  name = 'Undefined1756602206266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP CONSTRAINT "FK_53f6f4191fdf04456a15705a78c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_form_schedules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "controlWizardFormId" uuid NOT NULL, "scheduleId" uuid NOT NULL, "lastTriggerAt" TIMESTAMP WITH TIME ZONE, "totalTriggered" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1aac8875e9a7819fe31b75d543f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_wizard_schedule_assigned_users" ("scheduleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_3e0231c13a5a5a15e6c63a4e606" PRIMARY KEY ("scheduleId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_72b1d867f764c84c6f3d070103" ON "control_wizard_schedule_assigned_users" ("scheduleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4877002cbdaa305597a87bb38c" ON "control_wizard_schedule_assigned_users" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "assignedUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_report_schedules_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "autoGenerate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "scheduleType"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_report_schedules_scheduletype_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "endDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "preferredTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "nextGenerationAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "scheduleConfig"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "distributionConfig"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "nextExecutionAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "reminderConfig" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "notificationConfig" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" ADD "submittedByEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "scheduleId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" ADD "formId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_schedules" ADD CONSTRAINT "FK_2cf5b0b9acbbd6dc3da339bcc8c" FOREIGN KEY ("controlWizardFormId") REFERENCES "control_wizard_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_schedules" ADD CONSTRAINT "FK_66c417898771b4f055361ae20f7" FOREIGN KEY ("scheduleId") REFERENCES "control_wizard_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD CONSTRAINT "FK_53f6f4191fdf04456a15705a78c" FOREIGN KEY ("reportId") REFERENCES "control_wizard_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD CONSTRAINT "FK_a74f963c80aa72d9b6179fd0461" FOREIGN KEY ("scheduleId") REFERENCES "control_wizard_schedules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" ADD CONSTRAINT "FK_ee73862140fb07a2f80946dcdfc" FOREIGN KEY ("formId") REFERENCES "control_wizard_forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedule_assigned_users" ADD CONSTRAINT "FK_72b1d867f764c84c6f3d0701032" FOREIGN KEY ("scheduleId") REFERENCES "control_wizard_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedule_assigned_users" ADD CONSTRAINT "FK_4877002cbdaa305597a87bb38c1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedule_assigned_users" DROP CONSTRAINT "FK_4877002cbdaa305597a87bb38c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedule_assigned_users" DROP CONSTRAINT "FK_72b1d867f764c84c6f3d0701032"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" DROP CONSTRAINT "FK_ee73862140fb07a2f80946dcdfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP CONSTRAINT "FK_a74f963c80aa72d9b6179fd0461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP CONSTRAINT "FK_53f6f4191fdf04456a15705a78c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_schedules" DROP CONSTRAINT "FK_66c417898771b4f055361ae20f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_schedules" DROP CONSTRAINT "FK_2cf5b0b9acbbd6dc3da339bcc8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" DROP COLUMN "formId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" DROP COLUMN "scheduleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_form_submissions" DROP COLUMN "submittedByEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "notificationConfig"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "reminderConfig"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "nextExecutionAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "distributionConfig" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "scheduleConfig" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "nextGenerationAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "preferredTime" TIME`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "endDate" date`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_report_schedules_scheduletype_enum" AS ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom')`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "scheduleType" "public"."control_wizard_report_schedules_scheduletype_enum" NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "autoGenerate" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_report_schedules_status_enum" AS ENUM('active', 'paused', 'disabled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD "status" "public"."control_wizard_report_schedules_status_enum" NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "assignedUserId" uuid`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4877002cbdaa305597a87bb38c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_72b1d867f764c84c6f3d070103"`,
    );
    await queryRunner.query(
      `DROP TABLE "control_wizard_schedule_assigned_users"`,
    );
    await queryRunner.query(`DROP TABLE "control_wizard_form_schedules"`);
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_report_schedules" ADD CONSTRAINT "FK_53f6f4191fdf04456a15705a78c" FOREIGN KEY ("reportId") REFERENCES "control_wizard_reports"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
