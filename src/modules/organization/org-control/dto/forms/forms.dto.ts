import { FormType } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-form.entity';
import {
  FieldType,
  FieldValidation,
} from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-form-field.entity';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FormConfigDto {
  @IsOptional()
  @IsBoolean()
  allowPartialSave?: boolean;

  @IsOptional()
  @IsBoolean()
  requireCompletion?: boolean;

  @IsOptional()
  @IsNumber()
  maxAttempts?: number;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @IsBoolean()
  scoringEnabled?: boolean;
}

export class UpsertControlWizardFormDto {
  @IsNotEmpty()
  @IsString()
  controlWizardId: string;

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean; // this is the flag to check if the form is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  formId?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsString()
  title?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(FormType)
  type?: FormType;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormConfigDto)
  formConfig?: FormConfigDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsBoolean()
  isActive?: boolean;
}

export class FormFieldConditionalLogicDto {
  @IsOptional()
  @IsString()
  dependsOn?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  value?: any;
}

export class FormFieldOptionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  choices?: string[];

  @IsOptional()
  @IsString()
  default?: any;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsString()
  helpText?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldConditionalLogicDto)
  conditionalLogic?: FormFieldConditionalLogicDto;
}

export class FormFieldValidationDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: FieldValidation[];

  @IsOptional()
  @IsNumber()
  minLength?: number;

  @IsOptional()
  @IsNumber()
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  minValue?: number;

  @IsOptional()
  @IsNumber()
  maxValue?: number;

  @IsOptional()
  @IsString()
  pattern?: string;

  @IsOptional()
  @IsString()
  customValidation?: string;

  @IsOptional()
  @IsString()
  errorMessage?: string;
}

export class FormFieldScoringDto {
  @IsOptional()
  @IsNumber()
  points?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  correctAnswer?: any;
}

export class UpsertControlWizardFormFieldDto {
  @IsNotEmpty()
  @IsString()
  controlWizardId: string;

  @IsNotEmpty()
  @IsString()
  formId: string;

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean; // this is the flag to check if the field is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  fieldId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  fieldKey?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  label?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.isNew === true)
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.isNew === true)
  isConditional?: boolean;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.isNew === true)
  order?: number;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(FieldType)
  type?: FieldType;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldOptionsDto)
  options?: FormFieldOptionsDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldValidationDto)
  validation?: FormFieldValidationDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldScoringDto)
  scoring?: FormFieldScoringDto;
}
