import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CompanyControl } from './company-control.entity';
import { User } from './user.entity';
import { EventOccurrence } from './event-occurrence.entity';

@Entity('scheduled_events')
export class ScheduledEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyControlId: string;

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

  // Relations
  @ManyToOne(
    () => CompanyControl,
    (companyControl) => companyControl.scheduledEvents,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'company_control_id' })
  companyControl: CompanyControl;

  @ManyToOne(() => User, (user) => user.createdScheduledEvents)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @OneToMany(() => EventOccurrence, (occurrence) => occurrence.scheduledEvent)
  eventOccurrences: EventOccurrence[];
}
