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
import { DocumentType } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-document.entity';
import { DocumentChangeLogImpact } from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-document-version.entity';

export class DocumentConfigDto {
  @IsOptional()
  @IsBoolean()
  requireApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  autoExpiry?: boolean;

  @IsOptional()
  @IsNumber()
  expiryDays?: number;

  @IsOptional()
  @IsBoolean()
  versioningEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  maxVersions?: number;
}

export class DocumentMetadataDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  keywords?: string[];

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  classification?: string;

  @IsOptional()
  @IsString()
  confidentiality?: string;
}

export class UpsertControlWizardDocumentDto {
  @IsNotEmpty()
  @IsString()
  controlWizardId: string;

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean; // this is the flag to check if the document is new or not from the frontend

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew !== false)
  documentId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  title: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  description?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  @ValidateIf((o) => o.isNew === true)
  type?: DocumentType;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentConfigDto)
  @ValidateIf((o) => o.isNew === true)
  documentConfig?: DocumentConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentMetadataDto)
  @ValidateIf((o) => o.isNew === true)
  metadata?: DocumentMetadataDto;
}

export class DocumentChangeLogDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changes?: string[];

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(DocumentChangeLogImpact)
  impact?: DocumentChangeLogImpact;
}

export class UpsertControlWizardDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.isNew !== false)
  versionId?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  title?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  description?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  fileLocation?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  fileType?: string;

  @IsOptional()
  @IsNumber()
  @ValidateIf((o) => o.isNew === true)
  fileSize?: number;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  fileHash?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DocumentChangeLogDto)
  changeLog?: DocumentChangeLogDto;
}

export class PublishDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @IsOptional()
  @IsString()
  versionId?: string; // if this is not provided, the latest version will be published
}
