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
import { ControlWizard } from './control-wizard.entity';
import { ControlWizardExecution } from './control-wizard-execution.entity';

export enum ScheduleInterval {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  SEMI_ANNUALLY = 'semi_annually',
  ANNUALLY = 'annually',
  CUSTOM = 'custom',
}

export enum ExecutionMethod {
  AUTOMATED = 'automated',
  MANUAL = 'manual',
  HYBRID = 'hybrid',
}

@Entity('control_wizard_schedules')
export class ControlWizardSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: ScheduleInterval })
  interval: ScheduleInterval;

  @Column({ type: 'int', nullable: true })
  customIntervalDays: number; // For custom intervals

  @Column({ type: 'enum', enum: ExecutionMethod })
  method: ExecutionMethod;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'time', nullable: true })
  preferredTime: string; // Time of day for execution

  @Column({ type: 'jsonb', nullable: true })
  scheduleConfig: {
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    monthOfYear?: number; // 1-12 for quarterly/semi-annually
    weekOfMonth?: number; // 1-5 for monthly
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string; // For manual execution

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @OneToMany(() => ControlWizardExecution, (execution) => execution.schedule)
  executions: ControlWizardExecution[];
}
