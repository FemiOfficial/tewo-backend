import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { AllowedCharacters, UniqueArray } from 'src/shared/validators';
import { ControlWizardMode } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard.entity';
import { Field, InputType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import {
  SystemIntegrationCategory,
  SystemIntegrationStatus,
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
