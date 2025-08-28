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
import { ControlWizardMode } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard.entity';
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

export class CategorySpecificConfigDto {
  // Security & Incidents Management
  @IsOptional()
  @IsArray()
  @UniqueArray({ message: 'Incident severity levels must be unique' })
  incidentSeverityLevels?: string[];

  @IsOptional()
  @IsObject()
  responseTimeframes?: Record<string, number>;

  // Risk Management
  @IsOptional()
  @IsArray()
  riskAssessmentCriteria?: string[];

  @IsOptional()
  @IsString()
  riskScoringMethod?: string;

  // IT & Operational Security
  @IsOptional()
  @IsArray()
  securityControls?: string[];

  @IsOptional()
  @IsArray()
  operationalProcedures?: string[];

  // Information Management
  @IsOptional()
  @IsArray()
  dataClassificationLevels?: string[];

  @IsOptional()
  @IsObject()
  retentionPolicies?: Record<string, number>;

  // Governance
  @IsOptional()
  @IsArray()
  policyReviewCycles?: string[];

  @IsOptional()
  @IsArray()
  complianceCheckpoints?: string[];

  // Data Privacy
  @IsOptional()
  @IsBoolean()
  privacyImpactAssessment?: boolean;

  @IsOptional()
  @IsArray()
  dataSubjectRights?: string[];

  // Access Controls
  @IsOptional()
  @IsArray()
  accessReviewIntervals?: string[];

  @IsOptional()
  @IsArray()
  automationCapabilities?: string[];

  @IsOptional()
  @IsArray()
  systemIntegrations?: string[];
}

export class CreateControlWizardDto {
  @IsNotEmpty()
  @IsString()
  defaultControlWizardId: string;

  @IsOptional()
  @IsEnum(ControlWizardMode)
  mode: ControlWizardMode;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @IsBoolean()
  @IsOptional()
  requiresApproval: boolean;

  @IsBoolean()
  @IsOptional()
  requiresEvidence: boolean;

  @IsOptional()
  @IsString()
  @AllowedCharacters(/^[a-zA-Z0-9\s\-_.]+$/, {
    message: 'Title contains invalid characters',
  })
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
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
