import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardSchedule } from './control-wizard-schedule.entity';
import { User } from '../user.entity';

export enum ExecutionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum ExecutionType {
  SCHEDULED = 'scheduled',
  MANUAL = 'manual',
  ON_DEMAND = 'on_demand',
}

@Entity('control_wizard_executions')
export class ControlWizardExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheduleId: string;

  @Column({ type: 'enum', enum: ExecutionStatus })
  status: ExecutionStatus;

  @Column({ type: 'enum', enum: ExecutionType })
  type: ExecutionType;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  executionResult: {
    success: boolean;
    data?: Record<string, any>;
    errors?: string[];
    metrics?: Record<string, any>;
  };

  @Column({ type: 'uuid', nullable: true })
  executedByUserId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ControlWizardSchedule;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executedByUserId' })
  executedByUser: User;
}
