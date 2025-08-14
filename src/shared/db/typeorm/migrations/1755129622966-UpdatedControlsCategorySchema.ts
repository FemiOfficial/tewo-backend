import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedControlsCategorySchema1755129622966
  implements MigrationInterface
{
  name = 'UpdatedControlsCategorySchema1755129622966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "control_categories_frameworks_map" ("frameworksId" integer NOT NULL, "controlCategoriesId" integer NOT NULL, CONSTRAINT "PK_81036804b71d3cec73022a0835a" PRIMARY KEY ("frameworksId", "controlCategoriesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_171ad0163ddcf5f1af4835d610" ON "control_categories_frameworks_map" ("frameworksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35721ac1e59d3b60613789690d" ON "control_categories_frameworks_map" ("controlCategoriesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" DROP COLUMN "frameworkIds"`,
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
      `ALTER TABLE "controls" ADD "frameworkIds" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35721ac1e59d3b60613789690d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_171ad0163ddcf5f1af4835d610"`,
    );
    await queryRunner.query(`DROP TABLE "control_categories_frameworks_map"`);
  }
}
