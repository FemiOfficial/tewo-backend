import { MigrationInterface, QueryRunner } from 'typeorm';

export class ControlWizardUpdates1756422494824 implements MigrationInterface {
  name = 'ControlWizardUpdates1756422494824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" ADD "assessmentConfig" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_documents" ADD "templateId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" ADD "formId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" ADD "reportId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" ADD "templateId" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."control_wizard_forms_type_enum" RENAME TO "control_wizard_forms_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_forms_type_enum" AS ENUM('assessment', 'checklist', 'questionnaire', 'audit_form', 'incident_report', 'risk_assessment', 'compliance_review', 'custom')`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" ALTER COLUMN "type" TYPE "public"."control_wizard_forms_type_enum" USING "type"::"text"::"public"."control_wizard_forms_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_forms_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_433e96b7ce0260c3e365108a824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ALTER COLUMN "frameworkId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_433e96b7ce0260c3e365108a824" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_433e96b7ce0260c3e365108a824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ALTER COLUMN "frameworkId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_433e96b7ce0260c3e365108a824" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."control_wizard_forms_type_enum_old" AS ENUM('assessment', 'checklist', 'questionnaire', 'audit_form', 'incident_report', 'risk_assessment', 'compliance_review')`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" ALTER COLUMN "type" TYPE "public"."control_wizard_forms_type_enum_old" USING "type"::"text"::"public"."control_wizard_forms_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."control_wizard_forms_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."control_wizard_forms_type_enum_old" RENAME TO "control_wizard_forms_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_reports" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" DROP COLUMN "reportId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_approvals" DROP COLUMN "formId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_documents" DROP COLUMN "templateId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_forms" DROP COLUMN "assessmentConfig"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
