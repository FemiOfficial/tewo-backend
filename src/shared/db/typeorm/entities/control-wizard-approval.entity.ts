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
import { ControlWizard } from './control-wizard.entity';
import { ControlWizardApprovalStage } from './control-wizard-approval-stage.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ApprovalType {
  SEQUENTIAL = 'sequential', // Approvers must approve in order
  PARALLEL = 'parallel', // All approvers can approve simultaneously
  ANY_ONE = 'any_one', // Any one approver can approve
  MAJORITY = 'majority', // Majority of approvers must approve
  ALL = 'all', // All approvers must approve
}

export enum ApprovalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

registerEnumType(ApprovalType, {
  name: 'ApprovalType',
});

registerEnumType(ApprovalStatus, {
  name: 'ApprovalStatus',
});

@ObjectType()
export class ApprovalConfig {
  @Field(() => Boolean)
  requireComments: boolean;

  @Field(() => Boolean)
  allowDelegation: boolean;

  @Field(() => Boolean)
  autoEscalation: boolean;

  @Field(() => Number, { nullable: true })
  escalationHours?: number;

  @Field(() => [Number], { nullable: true })
  reminderIntervals?: number[]; // hours

  @Field(() => Number, { nullable: true })
  maxRevisions?: number;
}

@ObjectType()
export class ApprovalEscalationConfig {
  @Field(() => [ApprovalEscalationLevel])
  escalationLevels: ApprovalEscalationLevel[];
}

@ObjectType()
export class ApprovalEscalationLevel {
  @Field(() => Number)
  level: number;

  @Field(() => [String])
  approvers: string[];

  @Field(() => Number)
  timeframe: number; // hours
}

@Entity('control_wizard_approvals')
@ObjectType()
export class ControlWizardApproval {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  formId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  reportId: string;

  @Field(() => ApprovalType)
  @Column({ type: 'enum', enum: ApprovalType })
  type: ApprovalType;

  @Field(() => ApprovalStatus)
  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  status: ApprovalStatus;

  @Field(() => ApprovalConfig)
  @Column({ type: 'jsonb', nullable: true })
  approvalConfig: {
    requireComments: boolean;
    allowDelegation: boolean;
    autoEscalation: boolean;
    escalationHours?: number;
    reminderIntervals?: number[]; // hours
    maxRevisions?: number;
  };

  @Field(() => [ApprovalEscalationConfig])
  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: {
    escalationLevels: {
      level: number;
      approvers: string[];
      timeframe: number; // hours
    }[];
  };

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizard)
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @Field(() => [ControlWizardApprovalStage])
  @OneToMany(() => ControlWizardApprovalStage, (stage) => stage.approval)
  stages: ControlWizardApprovalStage[];
}
