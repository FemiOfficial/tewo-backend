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

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 2 })
  countryCode: string;

  @Column({ type: 'varchar', length: 50, default: 'free_tier' })
  subscriptionPlan: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user) => user.organization)
  users: User[];

  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.organization,
  )
  organizationControls: OrganizationControl[];

  @OneToMany(
    () => OrganizationIntegration,
    (integration) => integration.organization,
  )
  integrations: OrganizationIntegration[];

  @OneToMany(() => Policy, (policy) => policy.organization)
  policies: Policy[];

  @OneToMany(
    () => SecurityQuestionnaire,
    (questionnaire) => questionnaire.organization,
  )
  securityQuestionnaires: SecurityQuestionnaire[];

  @OneToMany(() => Audit, (audit) => audit.organization)
  audits: Audit[];

  @OneToMany(() => PublicTrustPage, (trustPage) => trustPage.organization)
  publicTrustPages: PublicTrustPage[];

  @OneToMany(() => DocumentRequest, (request) => request.organization)
  documentRequests: DocumentRequest[];

  @OneToMany(() => AuditLog, (log) => log.organization)
  auditLogs: AuditLog[];
}
