import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { CompanyControl } from './company-control.entity';
import { ScheduledEvent } from './scheduled-event.entity';
import { EventOccurrence } from './event-occurrence.entity';
import { EventAttendee } from './event-attendee.entity';
import { Evidence } from './evidence.entity';
import { AuditLog } from './audit-log.entity';
import { PolicySignature } from './policy-signature.entity';
import { DocumentRequest } from './document-request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 50, default: 'member' })
  role: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(
    () => CompanyControl,
    (companyControl) => companyControl.assignedUser,
  )
  assignedControls: CompanyControl[];

  @OneToMany(() => ScheduledEvent, (event) => event.createdByUser)
  createdScheduledEvents: ScheduledEvent[];

  @OneToMany(() => EventOccurrence, (occurrence) => occurrence.completedByUser)
  completedEventOccurrences: EventOccurrence[];

  @OneToMany(() => EventAttendee, (attendee) => attendee.user)
  eventAttendances: EventAttendee[];

  @OneToMany(() => Evidence, (evidence) => evidence.uploadedByUser)
  uploadedEvidence: Evidence[];

  @OneToMany(() => AuditLog, (log) => log.user)
  auditLogs: AuditLog[];

  @OneToMany(() => PolicySignature, (signature) => signature.user)
  policySignatures: PolicySignature[];

  @OneToMany(() => DocumentRequest, (request) => request.resolvedByUser)
  resolvedDocumentRequests: DocumentRequest[];
}
