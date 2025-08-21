import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../organization.entity';
import { Control } from '../control.entity';
import { ControlCategory } from '../control-category.entity';
import { Framework } from '../framework.entity';
import { User } from '../user.entity';
import { ControlWizardSchedule } from './control-wizard-schedule.entity';
import { ControlWizardForm } from './control-wizard-form.entity';
import { ControlWizardDocument } from './control-wizard-document.entity';
import { ControlWizardApproval } from './control-wizard-approval.entity';
import { ControlWizardReport } from './control-wizard-report.entity';

export enum ControlWizardType {
  DEFAULT = 'default',
  SYSTEM_DEFINED = 'system_defined',
  CUSTOM = 'custom',
}

export enum ControlWizardStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum ControlWizardMode {
  AUTOMATED = 'automated', // For access controls, monitoring
  MANUAL = 'manual', // For forms, document uploads
  HYBRID = 'hybrid', // Combination of both
  WORKFLOW = 'workflow', // For approval-based processes
}

@Entity('control_wizards')
export class ControlWizard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  organizationId: string; // Null for default/system wizards

  @Column({ type: 'int', nullable: true })
  controlId: number; // Null for custom controls

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'int' })
  frameworkId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ControlWizardType })
  type: ControlWizardType;

  @Column({
    type: 'enum',
    enum: ControlWizardStatus,
    default: ControlWizardStatus.DRAFT,
  })
  status: ControlWizardStatus;

  @Column({ type: 'enum', enum: ControlWizardMode })
  mode: ControlWizardMode;

  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Column({ type: 'boolean', default: false })
  requiresEvidence: boolean;

  @Column({ type: 'boolean', default: false })
  generatesReport: boolean;

  @Column({ type: 'jsonb', nullable: true })
  categorySpecificConfig: {
    // Security & Incidents Management
    incidentSeverityLevels?: string[];
    responseTimeframes?: Record<string, number>;

    // Risk Management
    riskAssessmentCriteria?: string[];
    riskScoringMethod?: string;

    // IT & Operational Security
    securityControls?: string[];
    operationalProcedures?: string[];

    // Information Management
    dataClassificationLevels?: string[];
    retentionPolicies?: Record<string, number>;

    // Governance
    policyReviewCycles?: string[];
    complianceCheckpoints?: string[];

    // Data Privacy
    privacyImpactAssessment?: boolean;
    dataSubjectRights?: string[];

    // Access Controls
    accessReviewIntervals?: string[];
    automationCapabilities?: string[];
    systemIntegrations?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  createdByUserId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => Control, { nullable: true })
  @JoinColumn({ name: 'controlId' })
  control: Control;

  @ManyToOne(() => ControlCategory)
  @JoinColumn({ name: 'categoryId' })
  category: ControlCategory;

  @ManyToOne(() => Framework)
  @JoinColumn({ name: 'frameworkId' })
  framework: Framework;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @OneToMany(() => ControlWizardSchedule, (schedule) => schedule.controlWizard)
  schedules: ControlWizardSchedule[];

  @OneToMany(() => ControlWizardForm, (form) => form.controlWizard)
  forms: ControlWizardForm[];

  @OneToMany(() => ControlWizardDocument, (document) => document.controlWizard)
  documents: ControlWizardDocument[];

  @OneToMany(() => ControlWizardApproval, (approval) => approval.controlWizard)
  approvals: ControlWizardApproval[];

  @OneToMany(() => ControlWizardReport, (report) => report.controlWizard)
  reports: ControlWizardReport[];
}
