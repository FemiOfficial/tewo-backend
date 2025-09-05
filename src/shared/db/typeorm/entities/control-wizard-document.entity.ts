import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizard } from './control-wizard.entity';
import { ControlWizardDocumentVersion } from './control-wizard-document-version.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DocumentType {
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  STANDARD = 'standard',
  GUIDELINE = 'guideline',
  TEMPLATE = 'template',
  CHECKLIST = 'checklist',
  REPORT = 'report',
  CERTIFICATE = 'certificate',
  CONTRACT = 'contract',
  AUDIT_TRAIL = 'audit_trail',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
}

registerEnumType(DocumentType, {
  name: 'DocumentType',
});

registerEnumType(DocumentStatus, {
  name: 'DocumentStatus',
});

@ObjectType()
export class DocumentConfig {
  @Field(() => Boolean, { nullable: true })
  requireApproval: boolean;

  @Field(() => Boolean, { nullable: true })
  autoExpiry?: boolean;

  @Field(() => Number, { nullable: true })
  expiryDays?: number;

  @Field(() => Boolean, { nullable: true })
  versioningEnabled: boolean;

  @Field(() => Number, { nullable: true })
  maxVersions?: number;

  // allowComments: boolean;
  // allowAnnotations: boolean;
  // retentionPolicy?: {
  //   activeRetention: number; // days
  //   archivalRetention: number; // days
  // };
}

@ObjectType()
export class DocumentMetadata {
  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => [String], { nullable: true })
  keywords?: string[];

  @Field(() => String, { nullable: true })
  department?: string;

  @Field(() => String, { nullable: true })
  owner?: string;

  @Field(() => String, { nullable: true })
  classification?: string;

  @Field(() => String, { nullable: true })
  confidentiality?: string;
}

@Entity('control_wizard_documents')
@ObjectType()
export class ControlWizardDocument {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: DocumentType })
  @Field(() => DocumentType)
  type: DocumentType;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => DocumentStatus)
  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  templateId: string; // ID of an existing document template

  @Field(() => DocumentConfig)
  @Column({ type: 'jsonb', nullable: true })
  documentConfig: DocumentConfig;

  @Field(() => DocumentMetadata)
  @Column({ type: 'jsonb', nullable: true })
  metadata: DocumentMetadata;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizard)
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @Field(() => [ControlWizardDocumentVersion])
  @OneToMany(() => ControlWizardDocumentVersion, (version) => version.document)
  versions: ControlWizardDocumentVersion[];
}
