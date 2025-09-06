import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  IsObject,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { ReportFormat, ReportType } from 'src/shared/db/typeorm/entities';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@InputType()
export class ReportConfigDto {
  @IsOptional()
  @IsArray()
  @IsEnum(ReportFormat)
  @Field(() => [ReportFormat], { nullable: true })
  formats?: ReportFormat[];

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  includeCharts?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  includeTables?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  includeAttachments?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxFileSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  customTemplates?: string[];
}

@InputType()
export class ReportContentSectionDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  required?: boolean;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dataSource?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  defaultValue?: string;
}

@InputType()
export class ReportContentFilterDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  field?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  defaultValue?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dataSource?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  required?: boolean;
}

@InputType()
export class ReportContentSortingDto {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  field?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  defaultValue?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dataSource?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  required?: boolean;
}

@InputType()
export class ReportContentConfigDto {
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ReportContentSectionDto)
  @Field(() => [ReportContentSectionDto], { nullable: true })
  sections?: ReportContentSectionDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ReportContentFilterDto)
  @Field(() => [ReportContentFilterDto], { nullable: true })
  filters?: ReportContentFilterDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ReportContentSortingDto)
  @Field(() => [ReportContentSortingDto], { nullable: true })
  sorting?: ReportContentSortingDto[];
}

@InputType()
export class ReportDistributionConfigDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  recipients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  ccRecipients?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  bccRecipients?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  subjectTemplate?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  bodyTemplate?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  autoSend?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  sendOnCompletion?: boolean;
}

@InputType()
export class UpsertControlReportConfigDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  formId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  reportId?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  templateId?: string;

  @IsNotEmpty()
  @IsEnum(ReportType)
  @Field(() => ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ReportConfigDto)
  @Field(() => ReportConfigDto, { nullable: true })
  reportConfig?: ReportConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ReportContentConfigDto)
  @Field(() => ReportContentConfigDto, { nullable: true })
  contentConfig?: ReportContentConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ReportDistributionConfigDto)
  @Field(() => ReportDistributionConfigDto, { nullable: true })
  distributionConfig?: ReportDistributionConfigDto;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  setIsActive?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean; // this is the flag to check if the report is new or not from the frontend
}

@InputType()
export class AssignControlWizardReportToScheduleDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  reportId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  scheduleId: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  autoDistribute?: boolean;
}

@InputType()
export class RemoveReportDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  reportId: string;
}
