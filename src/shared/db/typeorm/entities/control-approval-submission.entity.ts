import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ControlApprovalStageSubmission } from './control-approval-stage-submission.entity';
import { JoinColumn } from 'typeorm';
import { Field } from '@nestjs/graphql';
import { ControlWizardApproval } from './control-wizard-approval.entity';
import { ControlWizard } from './control-wizard.entity';

export enum ApprovalSubmissionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

export class ControlApprovalSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  approvalId: string;

  @Column({ type: 'uuid' })
  @Field(() => String)
  controlWizardId: string;

  @Field(() => ControlWizard)
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  currentStageId: string;

  @Field(() => ControlWizardApproval)
  @ManyToOne(() => ControlWizardApproval, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approvalId' })
  approval: ControlWizardApproval;

  @Field(() => ApprovalSubmissionStatus)
  @Column({
    type: 'enum',
    enum: ApprovalSubmissionStatus,
    default: ApprovalSubmissionStatus.PENDING,
  })
  status: ApprovalSubmissionStatus;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Field(() => [ControlApprovalStageSubmission])
  @OneToMany(
    () => ControlApprovalStageSubmission,
    (submission) => submission.approvalSubmission,
  )
  stagesSubmissions: ControlApprovalStageSubmission[];
}
