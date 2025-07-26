import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { EventOccurrence } from './event-occurrence.entity';
import { User } from './user.entity';

@Entity('event_attendees')
export class EventAttendee {
  @PrimaryColumn({ type: 'uuid' })
  eventOccurrenceId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  // Relations
  @ManyToOne(
    () => EventOccurrence,
    (eventOccurrence) => eventOccurrence.attendees,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'event_occurrence_id' })
  eventOccurrence: EventOccurrence;

  @ManyToOne(() => User, (user) => user.eventAttendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
