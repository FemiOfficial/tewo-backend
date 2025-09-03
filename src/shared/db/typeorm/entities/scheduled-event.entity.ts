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
import { OrganizationControl } from './organization-control.entity';
import { User } from './user.entity';
import { EventOccurrence } from './event-occurrence.entity';

@Entity('scheduled_events')
export class ScheduledEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationControlId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  scheduleType: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(
    () => OrganizationControl,
    (organizationControl) => organizationControl.scheduledEvents,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationControlId' })
  organizationControl: OrganizationControl;

  @ManyToOne(() => User, (user) => user.createdScheduledEvents)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @OneToMany(() => EventOccurrence, (occurrence) => occurrence.scheduledEvent)
  eventOccurrences: EventOccurrence[];
}
