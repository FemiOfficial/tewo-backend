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
import { Field, ObjectType } from '@nestjs/graphql';

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
@ObjectType()
export class ControlWizard {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid', nullable: true })
  organizationId: string; // Null for default/system wizards

  @Field(() => Number)
  @Column({ type: 'int', nullable: true })
  controlId: number; // Null for custom controls

  @Field(() => Number)
  @Column({ type: 'int' })
  categoryId: number;

  @Field(() => Number)
  @Column({ type: 'int' })
  frameworkId: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String)
  @Column({ type: 'text' })
  description: string;

  @Field(() => ControlWizardType)
  @Column({ type: 'enum', enum: ControlWizardType })
  type: ControlWizardType;

  @Field(() => ControlWizardStatus)
  @Column({
    type: 'enum',
    enum: ControlWizardStatus,
    default: ControlWizardStatus.DRAFT,
  })
  status: ControlWizardStatus;

  @Field(() => ControlWizardMode)
  @Column({ type: 'enum', enum: ControlWizardMode })
  mode: ControlWizardMode;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  requiresApproval: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  requiresEvidence: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  generatesReport: boolean;

  @Field(() => JSON)
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

  @Field(() => JSON)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Field(() => String)
  @Column({ type: 'uuid', nullable: true })
  createdByUserId: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizationId' })
  @Field(() => Organization)
  organization: Organization;

  @ManyToOne(() => Control, { nullable: true })
  @JoinColumn({ name: 'controlId' })
  @Field(() => Control)
  control: Control;

  @ManyToOne(() => ControlCategory)
  @JoinColumn({ name: 'categoryId' })
  @Field(() => ControlCategory)
  category: ControlCategory;

  @ManyToOne(() => Framework)
  @JoinColumn({ name: 'frameworkId' })
  @Field(() => Framework)
  framework: Framework;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  @Field(() => User)
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
