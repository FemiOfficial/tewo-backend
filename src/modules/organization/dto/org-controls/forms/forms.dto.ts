import { FormType } from 'src/shared/db/typeorm/entities/control-wizard-form.entity';
import {
  FieldType,
  FieldValidation,
} from 'src/shared/db/typeorm/entities/control-wizard-form-field.entity';
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
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FormConfigDto {
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  allowPartialSave?: boolean;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  requireCompletion?: boolean;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  @IsNumber()
  maxAttempts?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  scoringEnabled?: boolean;
}

@InputType()
export class UpsertControlWizardFormDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean; // this is the flag to check if the form is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  formId?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(FormType)
  @Field(() => FormType, { nullable: true })
  type?: FormType;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormConfigDto)
  @Field(() => FormConfigDto, { nullable: true })
  formConfig?: FormConfigDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}

@InputType()
export class FormFieldConditionalLogicDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dependsOn?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  condition?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  value?: any;
}

@InputType()
export class FormFieldOptionsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  choices?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  default?: any;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  placeholder?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  helpText?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldConditionalLogicDto)
  @Field(() => FormFieldConditionalLogicDto, { nullable: true })
  conditionalLogic?: FormFieldConditionalLogicDto;
}

@InputType()
export class FormFieldValidationDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [FieldValidation], { nullable: true })
  rules?: FieldValidation[];

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  minLength?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxLength?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxValue?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  pattern?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  customValidation?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  errorMessage?: string;
}

@InputType()
export class FormFieldScoringDto {
  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  points?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  weight?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  correctAnswer?: any;
}

@InputType()
export class UpsertControlWizardFormFieldDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  formId: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean; // this is the flag to check if the field is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  fieldId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  fieldKey?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  label?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => Boolean, { nullable: true })
  isConditional?: boolean;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => Number, { nullable: true })
  order?: number;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(FieldType)
  @Field(() => FieldType, { nullable: true })
  type?: FieldType;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldOptionsDto)
  @Field(() => FormFieldOptionsDto, { nullable: true })
  options?: FormFieldOptionsDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldValidationDto)
  @Field(() => FormFieldValidationDto, { nullable: true })
  validation?: FormFieldValidationDto;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsObject()
  @ValidateNested()
  @Type(() => FormFieldScoringDto)
  @Field(() => FormFieldScoringDto, { nullable: true })
  scoring?: FormFieldScoringDto;
}
