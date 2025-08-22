import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardDocument } from './control-wizard-document.entity';
import { User } from '../user.entity';

export enum DocumentChangeLogImpact {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('control_wizard_document_versions')
export class ControlWizardDocumentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  documentId: string;

  @Column({ type: 'int' })
  versionNumber: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  fileLocation: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fileType: string;

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  fileHash: string;

  @Column({ type: 'jsonb', nullable: true })
  changeLog: {
    changes: string[];
    reason: string;
    impact: DocumentChangeLogImpact;
  };

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: ControlWizardDocument;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;
}
