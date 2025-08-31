import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { AllowedCharacters, UniqueArray } from 'src/shared/validators';
import { ControlWizardMode } from 'src/shared/db/typeorm/entities/control-wizard.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  SystemIntegrationCategory,
  SystemIntegrationStatus,
  OrganizationControlStatus,
  FrameworkStatus,
} from 'src/shared/db/typeorm/entities';

export * from './document/document.dto';
export * from './forms/forms.dto';
export * from './schedules/schedules.dto';

@InputType()
export class SelectOrganizationFrameworkDto {
  @Field(() => [Number])
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  frameworkIds: number[];
}
@InputType()
export class GetAutomationIntegrationsInputDto {
  @Field({ nullable: true })
  @IsEnum(SystemIntegrationCategory)
  @IsOptional()
  @Expose()
  category: SystemIntegrationCategory;

  @Field({ nullable: true })
  @IsEnum(SystemIntegrationStatus)
  @IsOptional()
  @Expose()
  status?: SystemIntegrationStatus;
}

@InputType()
export class GetAutomationIntegrationCategoriesInputDto {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  @Expose()
  status?: SystemIntegrationStatus;
}

@InputType()
export class CategorySpecificConfigDto {
  // Security & Incidents Management
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  @UniqueArray({ message: 'Incident severity levels must be unique' })
  incidentSeverityLevels?: string[];

  @IsOptional()
  @IsObject()
  // @Field(() => Object)
  responseTimeframes?: Record<string, number>;

  // Risk Management
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  riskAssessmentCriteria?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  riskScoringMethod?: string;

  // IT & Operational Security
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  securityControls?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  operationalProcedures?: string[];

  // Information Management
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  dataClassificationLevels?: string[];

  @IsOptional()
  @IsObject()
  // @Field(() => Object)
  retentionPolicies?: Record<string, number>;

  // Governance
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  policyReviewCycles?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  complianceCheckpoints?: string[];

  // Data Privacy
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  privacyImpactAssessment?: boolean;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  dataSubjectRights?: string[];

  // Access Controls
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  accessReviewIntervals?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  automationCapabilities?: string[];

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  systemIntegrations?: string[];
}

@InputType()
export class CreateControlWizardDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  defaultControlWizardId: string;

  @IsOptional()
  @IsEnum(ControlWizardMode)
  @Field(() => ControlWizardMode)
  mode: ControlWizardMode;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean)
  isRecurring: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean)
  requiresApproval: boolean;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean)
  requiresEvidence: boolean;

  @IsOptional()
  @IsString()
  @AllowedCharacters(/^[a-zA-Z0-9\s\-_.]+$/, {
    message: 'Title contains invalid characters',
  })
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  description: string;

  @IsOptional()
  @IsObject()
  @Field(() => CategorySpecificConfigDto, { nullable: true })
  categorySpecificConfig: CategorySpecificConfigDto;
}

@ObjectType()
export class UserDto {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  email: string;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;
}

@ObjectType()
export class ControlDto {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsNumber()
  categoryId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  controlIdString?: string;

  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsDate()
  createdAt: Date;

  @Field()
  @IsDate()
  updatedAt: Date;
}

@ObjectType()
export class OrganizationControlDto {
  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  organizationId: string;

  @Field()
  @IsNumber()
  controlId: number;

  @Field()
  @IsNumber()
  categoryId: number;

  @Field()
  @IsEnum(OrganizationControlStatus)
  status: OrganizationControlStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @Field()
  @IsDate()
  createdAt: Date;

  @Field()
  @IsDate()
  updatedAt: Date;

  @Field(() => ControlDto)
  @IsObject()
  control: ControlDto;

  @Field(() => UserDto, { nullable: true })
  @IsOptional()
  @IsObject()
  assignedUser?: UserDto;
}

@ObjectType()
export class ControlCategoryWithControlsDto {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsDate()
  createdAt: Date;

  @Field()
  @IsDate()
  updatedAt: Date;

  @Field(() => [OrganizationControlDto])
  @IsArray()
  controls: OrganizationControlDto[];
}

@ObjectType()
export class OrgFrameworkWithCategoriesDto {
  @Field()
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  name: string;

  @Field(() => FrameworkStatus)
  @IsEnum(FrameworkStatus)
  status: FrameworkStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shortCode?: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  region: string[];

  @Field()
  @IsDate()
  createdAt: Date;

  @Field()
  @IsDate()
  updatedAt: Date;

  @Field(() => [ControlCategoryWithControlsDto])
  @IsArray()
  controlCategories: ControlCategoryWithControlsDto[];
}

@ObjectType()
export class GetOrgFrameworksResultDto {
  @Field(() => [OrgFrameworkWithCategoriesDto])
  @IsArray()
  frameworks: OrgFrameworkWithCategoriesDto[];
}

// DTO for User (simplified version for assignedUser)
