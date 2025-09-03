import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccessCodeSecret1755963633362 implements MigrationInterface {
  name = 'AccessCodeSecret1755963633362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_codes" ADD "secret" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "access_codes" ALTER COLUMN "expiresAt" DROP NOT NULL`,
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
      `ALTER TABLE "access_codes" ALTER COLUMN "expiresAt" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "access_codes" DROP COLUMN "secret"`);
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
