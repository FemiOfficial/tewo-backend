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

@Entity('control_wizard_documents')
export class ControlWizardDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: DocumentType })
  type: DocumentType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Column({ type: 'jsonb', nullable: true })
  documentConfig: {
    requireApproval: boolean;
    autoExpiry: boolean;
    expiryDays?: number;
    versioningEnabled: boolean;
    maxVersions?: number;
    allowComments: boolean;
    allowAnnotations: boolean;
    retentionPolicy?: {
      activeRetention: number; // days
      archivalRetention: number; // days
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    tags?: string[];
    keywords?: string[];
    department?: string;
    owner?: string;
    classification?: string;
    confidentiality?: string;
  };

  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @OneToMany(() => ControlWizardDocumentVersion, (version) => version.document)
  versions: ControlWizardDocumentVersion[];
}
