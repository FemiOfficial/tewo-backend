import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  IsObject,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { ApprovalType } from 'src/shared/db/typeorm/entities';
import { StageStatus } from 'src/shared/db/typeorm/entities/control-approval-stage-submission.entity';

@InputType()
export class ApprovalConfigDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  requireComments?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  allowDelegation?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  autoEscalation?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  escalationHours?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Field(() => [Number], { nullable: true })
  reminderIntervals?: number[]; // hours

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxRevisions?: number;
}

@InputType()
export class ApprovalEscalationLevelDto {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  level: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  approvers: string[];

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  timeframe: number; // hours
}

@InputType()
export class ApprovalEscalationConfigDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApprovalEscalationLevelDto)
  @Field(() => [ApprovalEscalationLevelDto])
  escalationLevels: ApprovalEscalationLevelDto[];
}

@InputType()
export class ApprovalStageApproverDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  role: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  order?: number;
}

@InputType()
export class ApprovalStageEscalationConfigDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String])
  escalateTo: string[];

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  escalateAfterHours: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  escalationMessage?: string;
}

@InputType()
export class UpsertControlWizardApprovalStageDto {
  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  stageId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  stageNumber: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApprovalStageApproverDto)
  @Field(() => [ApprovalStageApproverDto])
  approvers: ApprovalStageApproverDto[];

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  requiredApprovals?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  timeoutHours?: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApprovalStageEscalationConfigDto)
  @Field(() => ApprovalStageEscalationConfigDto, { nullable: true })
  escalationConfig?: ApprovalStageEscalationConfigDto;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean;
}

@InputType()
export class UpsertControlWizardApprovalDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  approvalId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  formId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  reportId?: string;

  @IsNotEmpty()
  @IsEnum(ApprovalType)
  @Field(() => ApprovalType)
  type: ApprovalType;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApprovalConfigDto)
  @Field(() => ApprovalConfigDto, { nullable: true })
  approvalConfig?: ApprovalConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ApprovalEscalationConfigDto)
  @Field(() => ApprovalEscalationConfigDto, { nullable: true })
  escalationConfig?: ApprovalEscalationConfigDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertControlWizardApprovalStageDto)
  @Field(() => [UpsertControlWizardApprovalStageDto], { nullable: true })
  stages?: UpsertControlWizardApprovalStageDto[];

  @IsOptional()
  @IsDateString()
  @Field(() => String, { nullable: true })
  dueDate?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean;
}

@InputType()
export class SubmitApprovalDecisionDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  approvalId: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  stageId?: string;

  @IsNotEmpty()
  @IsEnum([StageStatus.APPROVED, StageStatus.REJECTED, StageStatus.SKIPPED])
  @Field(() => String)
  decision: StageStatus;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  comment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  attachments?: string[];
}

@InputType()
export class AssignUserToControlDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  role?: string;
}

@InputType()
export class InviteUserToPortalDto {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  lastName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  roles?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  department?: string;
}
