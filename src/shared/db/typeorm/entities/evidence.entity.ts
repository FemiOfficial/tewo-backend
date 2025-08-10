import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrganizationControl } from './organization-control.entity';
import { EventOccurrence } from './event-occurrence.entity';
import { User } from './user.entity';
import { AuditEvidenceMap } from './audit-evidence-map.entity';

@Entity('evidence')
export class Evidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationControlId: string;

  @Column({ type: 'uuid', nullable: true })
  eventOccurrenceId: string;

  @Column({ type: 'uuid' })
  uploadedByUserId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Column({ type: 'text', nullable: true })
  storageUrl: string;

  @Column({ type: 'varchar', length: 50 })
  evidenceType: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // Relations
  @ManyToOne(
    () => OrganizationControl,
    (organizationControl) => organizationControl.evidence,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationControlId' })
  organizationControl: OrganizationControl;

  @ManyToOne(
    () => EventOccurrence,
    (eventOccurrence) => eventOccurrence.evidence,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'eventOccurrenceId' })
  eventOccurrence: EventOccurrence;

  @ManyToOne(() => User, (user) => user.uploadedEvidence)
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedByUser: User;

  @OneToMany(() => AuditEvidenceMap, (evidenceMap) => evidenceMap.evidence)
  auditMappings: AuditEvidenceMap[];
}
