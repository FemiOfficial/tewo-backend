import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardForm } from './control-wizard-form.entity';
import { User } from '../user.entity';

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('control_wizard_form_submissions')
export class ControlWizardFormSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  formId: string;

  @Column({ type: 'uuid' })
  submittedByUserId: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.DRAFT,
  })
  status: SubmissionStatus;

  @Column({ type: 'jsonb' })
  formData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  scoring: {
    totalScore?: number;
    maxScore?: number;
    percentage?: number;
    passed?: boolean;
    fieldScores?: Record<string, number>;
  };

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewedByUserId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardForm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: ControlWizardForm;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'submittedByUserId' })
  submittedByUser: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedByUser: User;
}
