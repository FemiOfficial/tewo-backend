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
import { Organization } from './organization.entity';
import { OrganizationControl } from './organization-control.entity';
import { ScheduledEvent } from './scheduled-event.entity';
import { EventOccurrence } from './event-occurrence.entity';
import { EventAttendee } from './event-attendee.entity';
import { Evidence } from './evidence.entity';
import { AuditLog } from './audit-log.entity';
import { PolicySignature } from './policy-signature.entity';
import { DocumentRequest } from './document-request.entity';
import { UserRoles } from './user-roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twoFactorSecret: string;

  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => UserRoles, (userRole) => userRole.user)
  userRoles: UserRoles[];

  // Computed property to get roles
  get roles() {
    return this.userRoles?.map((userRole) => userRole.role) || [];
  }

  @OneToMany(
    () => OrganizationControl,
    (organizationControl) => organizationControl.assignedUser,
  )
  assignedControls: OrganizationControl[];

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
