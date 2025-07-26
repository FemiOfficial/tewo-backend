import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Company } from './company.entity';
import { Control } from './control.entity';
import { User } from './user.entity';
import { ScheduledEvent } from './scheduled-event.entity';
import { Evidence } from './evidence.entity';

@Entity('company_controls')
@Unique(['companyId', 'controlId'])
export class CompanyControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'int' })
  controlId: number;

  @Column({ type: 'varchar', length: 50, default: 'to_do' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string;

  // Relations
  @ManyToOne(() => Company, (company) => company.companyControls, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Control, (control) => control.companyControls)
  @JoinColumn({ name: 'control_id' })
  control: Control;

  @ManyToOne(() => User, (user) => user.assignedControls)
  @JoinColumn({ name: 'assigned_user_id' })
  assignedUser: User;

  @OneToMany(() => ScheduledEvent, (event) => event.companyControl)
  scheduledEvents: ScheduledEvent[];

  @OneToMany(() => Evidence, (evidence) => evidence.companyControl)
  evidence: Evidence[];
}
