import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedControlsSchema1755126587065 implements MigrationInterface {
  name = 'UpdatedControlsSchema1755126587065';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "controls" DROP CONSTRAINT "FK_098075cc81132317a8f469badfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" RENAME COLUMN "frameworkId" TO "frameworkIds"`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_framework_map" ("frameworksId" integer NOT NULL, "controlsId" integer NOT NULL, CONSTRAINT "PK_15ccf872d13c1a7fe17d9fa2743" PRIMARY KEY ("frameworksId", "controlsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_184fca5029b576a14fef7b832f" ON "control_framework_map" ("frameworksId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e80340d66bc91d39570526e19" ON "control_framework_map" ("controlsId") `,
    );
    await queryRunner.query(`ALTER TABLE "frameworks" DROP COLUMN "region"`);
    await queryRunner.query(
      `ALTER TABLE "frameworks" ADD "region" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" DROP COLUMN "frameworkIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD "frameworkIds" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_framework_map" ADD CONSTRAINT "FK_184fca5029b576a14fef7b832f5" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_framework_map" ADD CONSTRAINT "FK_7e80340d66bc91d39570526e196" FOREIGN KEY ("controlsId") REFERENCES "controls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "control_framework_map" DROP CONSTRAINT "FK_7e80340d66bc91d39570526e196"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_framework_map" DROP CONSTRAINT "FK_184fca5029b576a14fef7b832f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" DROP COLUMN "frameworkIds"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD "frameworkIds" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "frameworks" DROP COLUMN "region"`);
    await queryRunner.query(
      `ALTER TABLE "frameworks" ADD "region" character varying(2) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e80340d66bc91d39570526e19"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_184fca5029b576a14fef7b832f"`,
    );
    await queryRunner.query(`DROP TABLE "control_framework_map"`);
    await queryRunner.query(
      `ALTER TABLE "controls" RENAME COLUMN "frameworkIds" TO "frameworkId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD CONSTRAINT "FK_098075cc81132317a8f469badfa" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
