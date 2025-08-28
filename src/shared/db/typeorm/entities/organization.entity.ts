import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrganizationControl } from './organization-control.entity';
import { OrganizationIntegration } from './organization-integration.entity';
import { Policy } from './policy.entity';
import { SecurityQuestionnaire } from './security-questionnaire.entity';
import { Audit } from './audit.entity';
import { PublicTrustPage } from './public-trust-page.entity';
import { DocumentRequest } from './document-request.entity';
import { AuditLog } from './audit-log.entity';
import { OrganizationCountry } from './organization-country.entity';
import { Invite } from './invites.entity';
import { UserRoles } from './user-roles.entity';
import { OrganizationFrameworks } from './organization-frameworks.entity';
import { ObjectType, registerEnumType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

export enum OrganizationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive',
}

registerEnumType(OrganizationStatus, {
  name: 'OrganizationStatus',
});

@Entity('organizations')
@ObjectType()
export class Organization {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'free_tier' })
  subscriptionPlan: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50, default: OrganizationStatus.PENDING })
  @Field(() => OrganizationStatus)
  status: OrganizationStatus;

  @Column({ type: 'uuid', nullable: true })
  @Field()
  ownerId: string;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @Field(() => [UserRoles])
  @OneToMany(() => UserRoles, (userRole) => userRole.organization)
  userRoles: UserRoles[];

  @Field(() => [OrganizationControl])
  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.organization,
  )
  organizationControls: OrganizationControl[];

  @Field(() => [OrganizationIntegration])
  @OneToMany(
    () => OrganizationIntegration,
    (integration) => integration.organization,
  )
  integrations: OrganizationIntegration[];

  // @Field(() => [Policy])
  @OneToMany(() => Policy, (policy) => policy.organization)
  policies: Policy[];

  // @Field(() => [SecurityQuestionnaire])
  @OneToMany(
    () => SecurityQuestionnaire,
    (questionnaire) => questionnaire.organization,
  )
  securityQuestionnaires: SecurityQuestionnaire[];

  // @Field(() => [Audit])
  @OneToMany(() => Audit, (audit) => audit.organization)
  audits: Audit[];

  // @Field(() => [PublicTrustPage])
  @OneToMany(() => PublicTrustPage, (trustPage) => trustPage.organization)
  publicTrustPages: PublicTrustPage[];

  // @Field(() => [DocumentRequest])
  @OneToMany(() => DocumentRequest, (request) => request.organization)
  documentRequests: DocumentRequest[];

  // @Field(() => [AuditLog])
  @OneToMany(() => AuditLog, (log) => log.organization)
  auditLogs: AuditLog[];

  // @Field(() => [Invite])
  @OneToMany(() => Invite, (invite) => invite.organization)
  invites: Invite[];

  // @Field(() => [OrganizationCountry])
  @OneToMany(() => OrganizationCountry, (orgCountry) => orgCountry.organization)
  organizationCountries: OrganizationCountry[];

  @Field(() => [OrganizationFrameworks])
  @OneToMany(
    () => OrganizationFrameworks,
    (orgFramework) => orgFramework.organization,
  )
  organizationFrameworks: OrganizationFrameworks[];
}
