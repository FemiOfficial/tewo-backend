import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('document_requests')
export class DocumentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255 })
  requesterEmail: string;

  @Column({ type: 'varchar', length: 255 })
  requestedDocumentName: string;

  @Column({ type: 'varchar', length: 50, default: 'pending_approval' })
  status: string;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @Column({ type: 'uuid', nullable: true })
  resolvedByUserId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(
    () => Organization,
    (organization) => organization.documentRequests,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => User, (user) => user.resolvedDocumentRequests)
  @JoinColumn({ name: 'resolvedByUserId' })
  resolvedByUser: User;
}
