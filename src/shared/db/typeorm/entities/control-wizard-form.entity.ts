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
import { ControlWizardFormField } from './control-wizard-form-field.entity';
import { ControlWizardFormSubmission } from './control-wizard-form-submission.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ControlWizardFormSchedule } from './control-form-wizard-schedule.entity';

export enum FormType {
  ASSESSMENT = 'assessment',
  CHECKLIST = 'checklist',
  QUESTIONNAIRE = 'questionnaire',
  AUDIT_FORM = 'audit_form',
  INCIDENT_REPORT = 'incident_report',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_REVIEW = 'compliance_review',
  CUSTOM = 'custom',
}

registerEnumType(FormType, {
  name: 'FormType',
});

@ObjectType()
export class FormAssessmentConfig {
  @Field(() => String, { nullable: true })
  generatesReportTitle?: string; // Title of the report to generate

  @Field(() => [String], { nullable: true })
  passingActions?: string[]; // Names of approval workflows to trigger on pass

  @Field(() => [String], { nullable: true })
  failingActions?: string[]; // Names of approval workflows to trigger on fail
}

@ObjectType()
export class FormConfig {
  @Field(() => Boolean)
  allowPartialSave: boolean;

  @Field(() => Boolean)
  requireCompletion: boolean;

  @Field(() => Number, { nullable: true })
  maxAttempts?: number;

  @Field(() => Number, { nullable: true })
  timeLimit?: number; // in minutes
}

@Entity('control_wizard_forms')
@ObjectType()
export class ControlWizardForm {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Field(() => FormType)
  @Column({ type: 'enum', enum: FormType })
  type: FormType;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => FormConfig)
  @Column({ type: 'jsonb', nullable: true })
  formConfig: FormConfig;

  @Field(() => FormAssessmentConfig, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  assessmentConfig: FormAssessmentConfig;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field(() => Number)
  @Column({ type: 'int', default: 1 })
  version: number;

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

  @Field(() => [ControlWizardFormField])
  @OneToMany(() => ControlWizardFormField, (field) => field.form)
  fields: ControlWizardFormField[];

  @Field(() => [ControlWizardFormSubmission])
  @OneToMany(() => ControlWizardFormSubmission, (submission) => submission.form)
  submissions!: ControlWizardFormSubmission[];

  @Field(() => [ControlWizardFormSchedule])
  @OneToMany(
    () => ControlWizardFormSchedule,
    (schedule) => schedule.controlWizardForm,
  )
  schedules: ControlWizardFormSchedule[]; // schedule triggers
}
