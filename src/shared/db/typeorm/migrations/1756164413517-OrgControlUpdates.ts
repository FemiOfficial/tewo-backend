import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgControlUpdates1756164413517 implements MigrationInterface {
  name = 'OrgControlUpdates1756164413517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" RENAME COLUMN "integrationType" TO "systemIntegrationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "frameworks" ADD "status" character varying(255) NOT NULL DEFAULT 'active'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" DROP COLUMN "systemIntegrationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD "systemIntegrationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD CONSTRAINT "FK_aca7707eb6f985ddee6d0015272" FOREIGN KEY ("systemIntegrationId") REFERENCES "system_integrations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "organization_integrations" DROP CONSTRAINT "FK_aca7707eb6f985ddee6d0015272"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" DROP COLUMN "systemIntegrationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD "systemIntegrationId" character varying(50) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "frameworks" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" RENAME COLUMN "systemIntegrationId" TO "integrationType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
