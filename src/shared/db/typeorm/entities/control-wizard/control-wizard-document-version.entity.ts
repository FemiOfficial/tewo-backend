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
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum DocumentChangeLogImpact {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

registerEnumType(DocumentChangeLogImpact, {
  name: 'DocumentChangeLogImpact',
});

@Entity('control_wizard_document_versions')
@ObjectType()
export class ControlWizardDocumentVersion {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  documentId: string;

  @Field(() => Number)
  @Column({ type: 'int' })
  versionNumber: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  fileLocation: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  fileType: string;

  @Field(() => Number, { nullable: true })
  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  fileHash: string;

  @Column({ type: 'jsonb', nullable: true })
  changeLog: {
    changes: string[];
    reason: string;
    impact: DocumentChangeLogImpact;
  };

  @Field(() => String)
  @Column({ type: 'uuid' })
  createdByUserId: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardDocument)
  @ManyToOne(() => ControlWizardDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'documentId' })
  document: ControlWizardDocument;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;
}
