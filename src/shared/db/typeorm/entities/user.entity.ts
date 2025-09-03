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
import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

export enum MFA_METHOD {
  EMAIL = 'email',
  AUTHENTICATOR = 'authenticator',
}

@ObjectType()
export class UserMetadata {
  @Field({ nullable: true })
  refreshToken?: string;
}

@Entity('users')
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'uuid' })
  organizationId: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  mfaSecret?: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: MFA_METHOD.EMAIL,
  })
  mfaMethod: MFA_METHOD;

  @Field()
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Field()
  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName: string;

  @Field()
  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Field(() => UserMetadata, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  metadata: UserMetadata;

  // Relations
  @ManyToOne(() => Organization, (organization) => organization.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Field(() => [UserRoles])
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
