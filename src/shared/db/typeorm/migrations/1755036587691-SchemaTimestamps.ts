import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaTimestamps1755036587691 implements MigrationInterface {
  name = 'SchemaTimestamps1755036587691';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "frameworks" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "frameworks" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_results" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questionnaires" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ALTER COLUMN "createdAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invites" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ALTER COLUMN "createdAt" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_countries" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questionnaires" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_results" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "controls" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "controls" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(`ALTER TABLE "frameworks" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "frameworks" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "evidence" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" DROP COLUMN "createdAt"`,
    );
  }
}
