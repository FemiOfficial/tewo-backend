import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ControlWizardApproval } from './control-wizard-approval.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ControlApprovalStageSubmission } from './control-approval-stage-submission.entity';

@ObjectType()
export class ApprovalStageEscalationConfig {
  @Field(() => [String])
  escalateTo: string[];
  @Field(() => Number)
  escalateAfterHours: number;
  @Field(() => String, { nullable: true })
  escalationMessage?: string;
}

@ObjectType()
export class ApprovalStageApprover {
  @Field(() => String)
  userId: string;
  @Field(() => String)
  role: string;
  @Field(() => Boolean)
  isRequired: boolean;
  @Field(() => Number, { nullable: true })
  order?: number;
}
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

  @Column({ type: 'jsonb', nullable: true })
  @Field(() => [ApprovalStageApprover])
  approvers: ApprovalStageApprover[];

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  requiredApprovals: number; // Number of approvals needed to proceed

  @Field(() => Number, { nullable: true })
  @Column({ type: 'int', nullable: true })
  timeoutHours: number; // Auto-escalation timeout

  @Column({ type: 'jsonb', nullable: true })
  escalationConfig: ApprovalStageEscalationConfig;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date;

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

  @Field(() => [ControlApprovalStageSubmission])
  @OneToMany(
    () => ControlApprovalStageSubmission,
    (submission) => submission.approvalStage,
  )
  submissions: ControlApprovalStageSubmission[];
}
