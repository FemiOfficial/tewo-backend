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

export enum FormType {
  ASSESSMENT = 'assessment',
  CHECKLIST = 'checklist',
  QUESTIONNAIRE = 'questionnaire',
  AUDIT_FORM = 'audit_form',
  INCIDENT_REPORT = 'incident_report',
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_REVIEW = 'compliance_review',
}

@Entity('control_wizard_forms')
export class ControlWizardForm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: FormType })
  type: FormType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  formConfig: {
    allowPartialSave: boolean;
    requireCompletion: boolean;
    maxAttempts?: number;
    timeLimit?: number; // in minutes
    scoringEnabled: boolean;
    passingScore?: number;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @OneToMany(() => ControlWizardFormField, (field) => field.form)
  fields: ControlWizardFormField[];

  @OneToMany(() => ControlWizardFormSubmission, (submission) => submission.form)
  submissions!: ControlWizardFormSubmission[];
}
