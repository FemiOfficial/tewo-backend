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
import { User } from './user.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

registerEnumType(SubmissionStatus, {
  name: 'SubmissionStatus',
});

@Entity('control_wizard_form_submissions')
@ObjectType()
export class ControlWizardFormSubmission {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  formId: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  submittedByUserId: string;

  @Field(() => SubmissionStatus)
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

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  reviewedByUserId: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardForm)
  @ManyToOne(() => ControlWizardForm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: ControlWizardForm;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'submittedByUserId' })
  submittedByUser: User;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedByUser: User;
}
