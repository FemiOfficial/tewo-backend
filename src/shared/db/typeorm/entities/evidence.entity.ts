import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationControl } from './organization-control.entity';
import { EventOccurrence } from './event-occurrence.entity';
import { User } from './user.entity';
import { AuditEvidenceMap } from './audit-evidence-map.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity('evidence')
@ObjectType()
export class Evidence {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  organizationControlId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  eventOccurrenceId: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  uploadedByUserId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  storageUrl: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  evidenceType: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => OrganizationControl)
  @ManyToOne(
    () => OrganizationControl,
    (organizationControl) => organizationControl.evidence,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationControlId' })
  organizationControl: OrganizationControl;

  @Field(() => EventOccurrence, { nullable: true })
  @ManyToOne(
    () => EventOccurrence,
    (eventOccurrence) => eventOccurrence.evidence,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'eventOccurrenceId' })
  eventOccurrence: EventOccurrence;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.uploadedEvidence)
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedByUser: User;

  @Field(() => [AuditEvidenceMap])
  @OneToMany(() => AuditEvidenceMap, (evidenceMap) => evidenceMap.evidence)
  auditMappings: AuditEvidenceMap[];
}
