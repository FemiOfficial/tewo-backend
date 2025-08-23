import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMetadata1755988968463 implements MigrationInterface {
  name = 'UserMetadata1755988968463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "metadata" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "metadata"`);
  }
}
