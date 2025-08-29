import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { DocumentType } from 'src/shared/db/typeorm/entities/control-wizard-document.entity';
import { DocumentChangeLogImpact } from 'src/shared/db/typeorm/entities/control-wizard-document-version.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DocumentConfigDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  requireApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  autoExpiry?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  expiryDays?: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  versioningEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxVersions?: number;
}

@InputType()
export class DocumentMetadataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @Field(() => [String], { nullable: true })
  keywords?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  department?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  owner?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  classification?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  confidentiality?: string;
}

@InputType()
export class UpsertControlWizardDocumentDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean; // this is the flag to check if the document is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew !== false)
  @Field(() => String, { nullable: true })
  documentId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  @ValidateIf((o) => o.isNew === true)
  @Field(() => DocumentType, { nullable: true })
  type?: DocumentType;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentConfigDto)
  @ValidateIf((o) => o.isNew === true)
  @Field(() => DocumentConfigDto, { nullable: true })
  documentConfig?: DocumentConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentMetadataDto)
  @ValidateIf((o) => o.isNew === true)
  @Field(() => DocumentMetadataDto, { nullable: true })
  metadata?: DocumentMetadataDto;
}

@InputType()
export class DocumentChangeLogDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  changes?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  reason?: string;

  @IsOptional()
  @IsEnum(DocumentChangeLogImpact)
  @Field(() => DocumentChangeLogImpact, { nullable: true })
  impact?: DocumentChangeLogImpact;
}

@InputType()
export class UpsertControlWizardDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  documentId: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.isNew !== false)
  @Field(() => String, { nullable: true })
  versionId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  fileLocation?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  fileType?: string;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => Number, { nullable: true })
  fileSize?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String, { nullable: true })
  fileHash?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentChangeLogDto)
  @Field(() => DocumentChangeLogDto, { nullable: true })
  changeLog?: DocumentChangeLogDto;
}

@InputType()
export class PublishDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  documentId: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  versionId?: string; // if this is not provided, the latest version will be published
}
