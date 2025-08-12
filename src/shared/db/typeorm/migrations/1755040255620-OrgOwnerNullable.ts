import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgOwnerNullable1755040255620 implements MigrationInterface {
  name = 'OrgOwnerNullable1755040255620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "ownerId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ALTER COLUMN "ownerId" SET NOT NULL`,
    );
  }
}
