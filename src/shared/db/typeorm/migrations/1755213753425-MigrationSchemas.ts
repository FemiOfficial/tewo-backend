import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationSchemas implements MigrationInterface {
  name = 'MigrationSchemas1755213753425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scheduled_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationControlId" uuid NOT NULL, "title" character varying(255) NOT NULL, "description" text, "scheduleType" character varying(50) NOT NULL, "startDate" date NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdByUserId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5ab29293642d5d17f11fda15c90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_attendees" ("eventOccurrenceId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_48a4d90df652044d27fc393b41e" PRIMARY KEY ("eventOccurrenceId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_occurrences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheduledEventId" uuid NOT NULL, "dueDate" date NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'scheduled', "meetingMinutesUrl" text, "calendarInviteId" character varying(255), "completedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "completedByUserId" uuid, CONSTRAINT "PK_43048141833ab7f9c7fc8c47887" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "evidence" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationControlId" uuid NOT NULL, "eventOccurrenceId" uuid, "uploadedByUserId" uuid NOT NULL, "fileName" character varying(255), "storageUrl" text, "evidenceType" character varying(50) NOT NULL, "metadata" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b864cb5d49854f89917fc0b44b9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_evidence_map" ("auditId" uuid NOT NULL, "evidenceId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_776ce97bdb19931c5bc68d0b0e3" PRIMARY KEY ("auditId", "evidenceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audits" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "organizationFrameworkId" uuid NOT NULL, "name" character varying(255) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'draft', "startDate" date, "endDate" date, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b2d7a2089999197dc7024820f28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_frameworks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "frameworkId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5438b973669bcc8edb969941782" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "frameworks" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "shortCode" character varying(20), "region" jsonb NOT NULL DEFAULT '[]', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_dfaedaffdb18492a02a1f367ac4" UNIQUE ("name"), CONSTRAINT "UQ_f0957a1223e9cff5e5f6c5910cf" UNIQUE ("shortCode"), CONSTRAINT "PK_23e178ce62668c9ce2036b7a3c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "control_categories" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c6ceca3fa17cf9e86f8d7ea123" UNIQUE ("name"), CONSTRAINT "PK_3b91f65662db5fb2d3233484007" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "policy_signatures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "policyId" uuid NOT NULL, "userId" uuid NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending', "signedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1213ceea8e68f1c3fc89f475b94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "policies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "title" character varying(255) NOT NULL, "content" text, "isCustom" boolean NOT NULL DEFAULT false, "version" integer NOT NULL DEFAULT '1', "status" character varying(50) NOT NULL DEFAULT 'draft', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "policy_control_map" ("policyId" uuid NOT NULL, "controlId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_7748a95f6b12876aead02d254f3" PRIMARY KEY ("policyId", "controlId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "controls" ("id" SERIAL NOT NULL, "categoryId" integer NOT NULL, "controlIdString" character varying(50), "title" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_caab9cdc105919cae31de77f61e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_controls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "controlId" integer NOT NULL, "categoryId" integer NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'to_do', "notes" text, "assignedUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_692cfa837727ac2007d17aa0f4f" UNIQUE ("organizationId", "controlId"), CONSTRAINT "PK_10ffaa36e5199995b9c205f849c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scan_results" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "integrationId" uuid NOT NULL, "vulnerabilityId" character varying(255), "description" text, "severity" character varying(50), "filePath" text, "status" character varying(50) NOT NULL DEFAULT 'open', "aiRemediationSuggestion" text, "detectedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_57c295805246213318de81826f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "integrationType" character varying(50) NOT NULL, "encryptedCredentials" text NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'disconnected', "lastSyncAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_5abc5a509e1ed4dd30abc1f2604" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "security_questionnaires" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "question" text NOT NULL, "answer" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c2ede3cf0b89fa809a72ffb366d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public_trust_pages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "publicSlug" character varying(100) NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "passwordHash" character varying(255), "visibleContent" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_b68760e12274e268249e4be9130" UNIQUE ("publicSlug"), CONSTRAINT "PK_da28f87d5b5cc0df7462f719357" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "requesterEmail" character varying(255) NOT NULL, "requestedDocumentName" character varying(255) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'pending_approval', "resolutionNotes" text, "resolvedByUserId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_43076ee267e48f196b68ce008e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "userId" uuid, "actionType" character varying(100) NOT NULL, "targetEntityId" uuid, "details" jsonb, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "currency" character varying(255) NOT NULL, "currencyCode" character varying(255) NOT NULL, "currencySymbol" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ed4961e20b1a74242beccf6b8de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "serviceCountryId" uuid NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "status" character varying(50) NOT NULL DEFAULT 'primary', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_325a3b7067206c1b72faadd272e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "module" character varying(255) NOT NULL, "keys" jsonb NOT NULL, "scope" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "type" character varying(255) NOT NULL DEFAULT 'default', "description" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invites" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "organizationId" uuid NOT NULL, "roleId" uuid NOT NULL, "invitedById" uuid NOT NULL, "status" character varying(255) NOT NULL DEFAULT 'pending', "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aa52e96b44a714372f4dd31a0af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "roleId" uuid NOT NULL, "organizationId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "subscriptionPlan" character varying(50) NOT NULL DEFAULT 'free_tier', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" character varying(50) NOT NULL DEFAULT 'pending', "ownerId" uuid, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "mfaSecret" character varying(255), "mfaMethod" character varying(255) NOT NULL DEFAULT 'email', "isEmailVerified" boolean NOT NULL DEFAULT false, "firstName" character varying(255), "lastName" character varying(255), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "system_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "key" character varying(50) NOT NULL, "category" character varying(50) NOT NULL, "description" character varying(255) NOT NULL, "status" character varying(50) NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_0e83e82091880487ed0090f1c24" UNIQUE ("name"), CONSTRAINT "UQ_27a77598791fe99ef3c6fc36b1b" UNIQUE ("key"), CONSTRAINT "PK_906ed1d97f84b3cad4e6b09a3a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(255) NOT NULL, "type" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "organization" character varying(255), "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "expiresAt" date NOT NULL, CONSTRAINT "PK_702e128569c0cdfeb9cea561cdb" PRIMARY KEY ("id"))`,
    );
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
      `CREATE TABLE "role_permissions" ("roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_d430a02aad006d8a70f3acd7d03" PRIMARY KEY ("roleId", "permissionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b4599f8b8f548d35850afa2d12" ON "role_permissions" ("roleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" ADD CONSTRAINT "FK_fe713702f7e845b3fd0570ff75e" FOREIGN KEY ("organizationControlId") REFERENCES "organization_controls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" ADD CONSTRAINT "FK_de56cfc1af27f8ef8469276cd4f" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" ADD CONSTRAINT "FK_bdd43340f3da1b1aa85984274b8" FOREIGN KEY ("eventOccurrenceId") REFERENCES "event_occurrences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" ADD CONSTRAINT "FK_07eb323a7b08ba51fe4b582f3f4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" ADD CONSTRAINT "FK_d916b4f591be31a2cb4ae34d198" FOREIGN KEY ("scheduledEventId") REFERENCES "scheduled_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" ADD CONSTRAINT "FK_74329a7643bcb62c3241288b021" FOREIGN KEY ("completedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_b85728e129405782bcf8d4d3586" FOREIGN KEY ("organizationControlId") REFERENCES "organization_controls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_ff9e47ec5984a30d8dc14e6e331" FOREIGN KEY ("eventOccurrenceId") REFERENCES "event_occurrences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" ADD CONSTRAINT "FK_cd484f89eb3b720df097f4b2a06" FOREIGN KEY ("uploadedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_evidence_map" ADD CONSTRAINT "FK_df6c3a713629ee45fcf308a2423" FOREIGN KEY ("auditId") REFERENCES "audits"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_evidence_map" ADD CONSTRAINT "FK_ecb074b35f423050cba8dabcdb5" FOREIGN KEY ("evidenceId") REFERENCES "evidence"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audits" ADD CONSTRAINT "FK_59f6393ca7a2c7643fe0368a4d2" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audits" ADD CONSTRAINT "FK_9823f3386d1e32bdc6436acba96" FOREIGN KEY ("organizationFrameworkId") REFERENCES "organization_frameworks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_frameworks" ADD CONSTRAINT "FK_2c587d8b42095cb04bdd71ba1c3" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_frameworks" ADD CONSTRAINT "FK_09453de6aad99a9522749691a57" FOREIGN KEY ("frameworkId") REFERENCES "frameworks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" ADD CONSTRAINT "FK_79dbe67ee9548f967db66f99122" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" ADD CONSTRAINT "FK_6596a3f7fa71688c3d852ac5278" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policies" ADD CONSTRAINT "FK_af702ea1ebe167b21698949f454" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" ADD CONSTRAINT "FK_f869ed536e562d37bf80bb47f9c" FOREIGN KEY ("policyId") REFERENCES "policies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" ADD CONSTRAINT "FK_ccba10ee81a849165912e20d6ff" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" ADD CONSTRAINT "FK_bb9f0f07b9310346c6a68887f94" FOREIGN KEY ("categoryId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD CONSTRAINT "FK_f7c193da9ae13542b81923e9017" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD CONSTRAINT "FK_f86914c7f81333fbbc932b16e5d" FOREIGN KEY ("controlId") REFERENCES "controls"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD CONSTRAINT "FK_392c3d73fe750b94b9c6432c8f5" FOREIGN KEY ("categoryId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" ADD CONSTRAINT "FK_eb4f2ebc3d6907c35d2bddb1f92" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_results" ADD CONSTRAINT "FK_2e30e8b7400b283277b37e681ad" FOREIGN KEY ("integrationId") REFERENCES "organization_integrations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" ADD CONSTRAINT "FK_aeeab9c78c73c37d4d89082ed9a" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questionnaires" ADD CONSTRAINT "FK_c21f49a05c68b7cdfd37bc76758" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" ADD CONSTRAINT "FK_5ab1029a0e52eb5ee358045265b" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" ADD CONSTRAINT "FK_c5045fd967d0f1a5be0b32e9bbd" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" ADD CONSTRAINT "FK_13ac8ad23aed0446ccf42697930" FOREIGN KEY ("resolvedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_2d031e6155834882f54dcd6b4f5" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" ADD CONSTRAINT "FK_a1e0bdec025946238c9aff18568" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" ADD CONSTRAINT "FK_ca31c8b0abf25d96b8a0c6ca853" FOREIGN KEY ("serviceCountryId") REFERENCES "service_countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_9e65b4b3671b77f577afc2a71f1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_ed2fb45d6edb72be56fd189261f" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" ADD CONSTRAINT "FK_512a5c477fc936b04516d7a2d57" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_9197fafc733c4bf1e9adba816ce" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105" FOREIGN KEY ("frameworksId") REFERENCES "frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" ADD CONSTRAINT "FK_35721ac1e59d3b60613789690d5" FOREIGN KEY ("controlCategoriesId") REFERENCES "control_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_35721ac1e59d3b60613789690d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "control_categories_frameworks_map" DROP CONSTRAINT "FK_171ad0163ddcf5f1af4835d6105"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_9197fafc733c4bf1e9adba816ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_512a5c477fc936b04516d7a2d57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_ed2fb45d6edb72be56fd189261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invites" DROP CONSTRAINT "FK_9e65b4b3671b77f577afc2a71f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" DROP CONSTRAINT "FK_ca31c8b0abf25d96b8a0c6ca853"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_countries" DROP CONSTRAINT "FK_a1e0bdec025946238c9aff18568"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_cfa83f61e4d27a87fcae1e025ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_2d031e6155834882f54dcd6b4f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" DROP CONSTRAINT "FK_13ac8ad23aed0446ccf42697930"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document_requests" DROP CONSTRAINT "FK_c5045fd967d0f1a5be0b32e9bbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public_trust_pages" DROP CONSTRAINT "FK_5ab1029a0e52eb5ee358045265b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questionnaires" DROP CONSTRAINT "FK_c21f49a05c68b7cdfd37bc76758"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_integrations" DROP CONSTRAINT "FK_aeeab9c78c73c37d4d89082ed9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scan_results" DROP CONSTRAINT "FK_2e30e8b7400b283277b37e681ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP CONSTRAINT "FK_eb4f2ebc3d6907c35d2bddb1f92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP CONSTRAINT "FK_392c3d73fe750b94b9c6432c8f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP CONSTRAINT "FK_f86914c7f81333fbbc932b16e5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_controls" DROP CONSTRAINT "FK_f7c193da9ae13542b81923e9017"`,
    );
    await queryRunner.query(
      `ALTER TABLE "controls" DROP CONSTRAINT "FK_bb9f0f07b9310346c6a68887f94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" DROP CONSTRAINT "FK_ccba10ee81a849165912e20d6ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_control_map" DROP CONSTRAINT "FK_f869ed536e562d37bf80bb47f9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policies" DROP CONSTRAINT "FK_af702ea1ebe167b21698949f454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" DROP CONSTRAINT "FK_6596a3f7fa71688c3d852ac5278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "policy_signatures" DROP CONSTRAINT "FK_79dbe67ee9548f967db66f99122"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_frameworks" DROP CONSTRAINT "FK_09453de6aad99a9522749691a57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_frameworks" DROP CONSTRAINT "FK_2c587d8b42095cb04bdd71ba1c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audits" DROP CONSTRAINT "FK_9823f3386d1e32bdc6436acba96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audits" DROP CONSTRAINT "FK_59f6393ca7a2c7643fe0368a4d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_evidence_map" DROP CONSTRAINT "FK_ecb074b35f423050cba8dabcdb5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_evidence_map" DROP CONSTRAINT "FK_df6c3a713629ee45fcf308a2423"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_cd484f89eb3b720df097f4b2a06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_ff9e47ec5984a30d8dc14e6e331"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evidence" DROP CONSTRAINT "FK_b85728e129405782bcf8d4d3586"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" DROP CONSTRAINT "FK_74329a7643bcb62c3241288b021"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_occurrences" DROP CONSTRAINT "FK_d916b4f591be31a2cb4ae34d198"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" DROP CONSTRAINT "FK_07eb323a7b08ba51fe4b582f3f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_attendees" DROP CONSTRAINT "FK_bdd43340f3da1b1aa85984274b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" DROP CONSTRAINT "FK_de56cfc1af27f8ef8469276cd4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_events" DROP CONSTRAINT "FK_fe713702f7e845b3fd0570ff75e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b4599f8b8f548d35850afa2d12"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_35721ac1e59d3b60613789690d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_171ad0163ddcf5f1af4835d610"`,
    );
    await queryRunner.query(`DROP TABLE "control_categories_frameworks_map"`);
    await queryRunner.query(`DROP TABLE "access_codes"`);
    await queryRunner.query(`DROP TABLE "system_integrations"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "invites"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TABLE "organization_countries"`);
    await queryRunner.query(`DROP TABLE "service_countries"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "document_requests"`);
    await queryRunner.query(`DROP TABLE "public_trust_pages"`);
    await queryRunner.query(`DROP TABLE "security_questionnaires"`);
    await queryRunner.query(`DROP TABLE "organization_integrations"`);
    await queryRunner.query(`DROP TABLE "scan_results"`);
    await queryRunner.query(`DROP TABLE "organization_controls"`);
    await queryRunner.query(`DROP TABLE "controls"`);
    await queryRunner.query(`DROP TABLE "policy_control_map"`);
    await queryRunner.query(`DROP TABLE "policies"`);
    await queryRunner.query(`DROP TABLE "policy_signatures"`);
    await queryRunner.query(`DROP TABLE "control_categories"`);
    await queryRunner.query(`DROP TABLE "frameworks"`);
    await queryRunner.query(`DROP TABLE "organization_frameworks"`);
    await queryRunner.query(`DROP TABLE "audits"`);
    await queryRunner.query(`DROP TABLE "audit_evidence_map"`);
    await queryRunner.query(`DROP TABLE "evidence"`);
    await queryRunner.query(`DROP TABLE "event_occurrences"`);
    await queryRunner.query(`DROP TABLE "event_attendees"`);
    await queryRunner.query(`DROP TABLE "scheduled_events"`);
  }
}
