import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ScheduledEvent } from './scheduled-event.entity';
import { User } from './user.entity';
import { EventAttendee } from './event-attendee.entity';
import { Evidence } from './evidence.entity';

@Entity('event_occurrences')
export class EventOccurrence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheduledEventId: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'varchar', length: 50, default: 'scheduled' })
  status: string;

  @Column({ type: 'text', nullable: true })
  meetingMinutesUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  calendarInviteId: string;

  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  completedByUserId: string;

  // Relations
  @ManyToOne(
    () => ScheduledEvent,
    (scheduledEvent) => scheduledEvent.eventOccurrences,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'scheduled_event_id' })
  scheduledEvent: ScheduledEvent;

  @ManyToOne(() => User, (user) => user.completedEventOccurrences)
  @JoinColumn({ name: 'completed_by_user_id' })
  completedByUser: User;

  @OneToMany(() => EventAttendee, (attendee) => attendee.eventOccurrence)
  attendees: EventAttendee[];

  @OneToMany(() => Evidence, (evidence) => evidence.eventOccurrence)
  evidence: Evidence[];
}
