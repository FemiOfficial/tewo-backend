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
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

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

registerEnumType(FieldType, {
  name: 'FieldType',
});

registerEnumType(FieldValidation, {
  name: 'FieldValidation',
});

@ObjectType()
export class FieldConditionalLogic {
  @Field(() => String)
  dependsOn: string;

  @Field(() => String)
  condition: string;

  @Field(() => String, { nullable: true })
  value?: string;
}
@ObjectType()
export class FieldOptions {
  @Field(() => [String], { nullable: true })
  choices?: string[];

  default?: any;

  @Field(() => String, { nullable: true })
  placeholder?: string;

  @Field(() => String, { nullable: true })
  helpText?: string;

  @Field(() => FieldConditionalLogic, { nullable: true })
  conditionalLogic?: FieldConditionalLogic;
}

@ObjectType()
export class FieldValidationRules {
  @Field(() => [FieldValidation], { nullable: true })
  rules?: FieldValidation[];

  @Field(() => Number, { nullable: true })
  minLength?: number;

  @Field(() => Number, { nullable: true })
  maxLength?: number;

  @Field(() => Number, { nullable: true })
  minValue?: number;

  @Field(() => Number, { nullable: true })
  maxValue?: number;

  @Field(() => String, { nullable: true })
  pattern?: string;

  @Field(() => String, { nullable: true })
  customValidation?: string;

  @Field(() => String, { nullable: true })
  errorMessage?: string;
}

@ObjectType()
export class FieldScoring {
  @Field(() => Number, { nullable: true })
  points?: number;

  @Field(() => Number, { nullable: true })
  weight?: number;

  @Field(() => String, { nullable: true })
  correctAnswer?: string;
}

@Entity('control_wizard_form_fields')
@ObjectType()
export class ControlWizardFormField {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  formId: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  fieldKey: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => FieldType)
  @Column({ type: 'enum', enum: FieldType })
  type: FieldType;

  @Field(() => FieldOptions)
  @Column({ type: 'jsonb', nullable: true })
  options: FieldOptions;

  @Field(() => FieldValidationRules)
  @Column({ type: 'jsonb', nullable: true })
  validation: FieldValidationRules;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isRequired: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isConditional: boolean;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  order: number;

  @Field(() => FieldScoring)
  @Column({ type: 'jsonb', nullable: true })
  scoring: FieldScoring;

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
}
