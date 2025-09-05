import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, registerEnumType } from '@nestjs/graphql';
import { ControlWizardApprovalStage } from './control-wizard-approval-stage.entity';
import { ControlApprovalSubmission } from './control-approval-submission.entity';

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

export class ControlApprovalStageSubmission {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  approvalStageId: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  approvalSubmissionId: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  userId: string;

  @Field(() => StageStatus)
  @Column({ type: 'enum', enum: StageStatus, default: StageStatus.PENDING })
  status: StageStatus;

  @Field(() => [String], { nullable: true })
  comments?: string[];

  @Field(() => [String], { nullable: true })
  attachments?: string[];

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  decidedAt: Date;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => ControlWizardApprovalStage)
  @ManyToOne(() => ControlWizardApprovalStage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approvalStageId' })
  approvalStage: ControlWizardApprovalStage;

  @Field(() => ControlApprovalSubmission)
  @ManyToOne(() => ControlApprovalSubmission, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approvalSubmissionId' })
  approvalSubmission: ControlApprovalSubmission;
}
