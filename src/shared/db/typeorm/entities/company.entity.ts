import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { CompanyControl } from './company-control.entity';
import { CompanyIntegration } from './company-integration.entity';
import { Policy } from './policy.entity';
import { SecurityQuestionnaire } from './security-questionnaire.entity';
import { Audit } from './audit.entity';
import { PublicTrustPage } from './public-trust-page.entity';
import { DocumentRequest } from './document-request.entity';
import { AuditLog } from './audit-log.entity';

@Entity('companies')
export class Company {
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
  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => CompanyControl, (companyControl) => companyControl.company)
  companyControls: CompanyControl[];

  @OneToMany(() => CompanyIntegration, (integration) => integration.company)
  integrations: CompanyIntegration[];

  @OneToMany(() => Policy, (policy) => policy.company)
  policies: Policy[];

  @OneToMany(
    () => SecurityQuestionnaire,
    (questionnaire) => questionnaire.company,
  )
  securityQuestionnaires: SecurityQuestionnaire[];

  @OneToMany(() => Audit, (audit) => audit.company)
  audits: Audit[];

  @OneToMany(() => PublicTrustPage, (trustPage) => trustPage.company)
  publicTrustPages: PublicTrustPage[];

  @OneToMany(() => DocumentRequest, (request) => request.company)
  documentRequests: DocumentRequest[];

  @OneToMany(() => AuditLog, (log) => log.company)
  auditLogs: AuditLog[];
}
