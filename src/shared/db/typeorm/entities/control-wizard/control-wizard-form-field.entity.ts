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

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  FILE_UPLOAD = 'file_upload',
  SIGNATURE = 'signature',
  RATING = 'rating',
  MATRIX = 'matrix',
  CONDITIONAL = 'conditional',
}

export enum FieldValidation {
  REQUIRED = 'required',
  EMAIL = 'email',
  URL = 'url',
  PHONE = 'phone',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  MIN_VALUE = 'min_value',
  MAX_VALUE = 'max_value',
  PATTERN = 'pattern',
  CUSTOM = 'custom',
}

@Entity('control_wizard_form_fields')
export class ControlWizardFormField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  formId: string;

  @Column({ type: 'varchar', length: 100 })
  fieldKey: string;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Column({ type: 'jsonb', nullable: true })
  options: {
    choices?: string[];
    default?: any;
    placeholder?: string;
    helpText?: string;
    conditionalLogic?: {
      dependsOn: string;
      condition: string;
      value: any;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  validation: {
    rules: FieldValidation[];
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    customValidation?: string;
    errorMessage?: string;
  };

  @Column({ type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ type: 'boolean', default: false })
  isConditional: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'jsonb', nullable: true })
  scoring: {
    points?: number;
    weight?: number;
    correctAnswer?: any;
  };

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardForm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: ControlWizardForm;
}
