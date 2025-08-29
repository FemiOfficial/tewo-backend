import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardApproval } from './control-wizard-approval.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum StageStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SKIPPED = 'skipped',
}

registerEnumType(StageStatus, {
  name: 'StageStatus',
});

@Entity('control_wizard_approval_stages')
@ObjectType()
export class ControlWizardApprovalStage {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  approvalId: string;

  @Field(() => Number)
  @Column({ type: 'int' })
  stageNumber: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => StageStatus)
  @Column({ type: 'enum', enum: StageStatus, default: StageStatus.PENDING })
  status: StageStatus;

  @Column({ type: 'jsonb' })
  approvers: {
    userId: string;
    role: string;
    isRequired: boolean;
    order?: number;
  }[];

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  requiredApprovals: number; // Number of approvals needed to proceed

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  timeoutHours: number; // Auto-escalation timeout

  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: {
    escalateTo: string[];
    escalateAfterHours: number;
    escalationMessage?: string;
  };

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  stageResult: {
    approvedBy: string[];
    rejectedBy: string[];
    comments: Record<string, string>;
    attachments?: string[];
  };

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardApproval)
  @ManyToOne(() => ControlWizardApproval, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approvalId' })
  approval: ControlWizardApproval;
}
