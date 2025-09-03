import { MigrationInterface, QueryRunner } from 'typeorm';

export class ControlScheduleTime1756436892338 implements MigrationInterface {
  name = 'ControlScheduleTime1756436892338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP CONSTRAINT "FK_433e96b7ce0260c3e365108a824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" DROP COLUMN "frameworkId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "startDate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "endDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "endDate" TIMESTAMP WITH TIME ZONE`,
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
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "endDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "endDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" DROP COLUMN "startDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizard_schedules" ADD "startDate" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD "frameworkId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_wizards" ADD CONSTRAINT "FK_433e96b7ce0260c3e365108a824" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
