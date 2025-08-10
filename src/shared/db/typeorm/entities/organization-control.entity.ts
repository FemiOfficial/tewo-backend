import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Control } from './control.entity';
import { User } from './user.entity';
import { ScheduledEvent } from './scheduled-event.entity';
import { Evidence } from './evidence.entity';

@Entity('organization_controls')
@Unique(['organizationId', 'controlId'])
export class OrganizationControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column({ type: 'int' })
  controlId: number;

  @Column({ type: 'varchar', length: 50, default: 'to_do' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string;

  // Relations
  @ManyToOne(
    () => Organization,
    (organization) => organization.organizationControls,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ManyToOne(() => Control, (control) => control.organizationControls)
  @JoinColumn({ name: 'controlId' })
  control: Control;

  @ManyToOne(() => User, (user) => user.assignedControls)
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser: User;

  @OneToMany(() => ScheduledEvent, (event) => event.organizationControl)
  scheduledEvents: ScheduledEvent[];

  @OneToMany(() => Evidence, (evidence) => evidence.organizationControl)
  evidence: Evidence[];
}
