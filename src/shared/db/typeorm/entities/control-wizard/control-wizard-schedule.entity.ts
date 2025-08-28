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
import { Field, ObjectType } from '@nestjs/graphql';

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
@ObjectType()
export class ControlWizardSchedule {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Field(() => ScheduleInterval)
  @Column({ type: 'enum', enum: ScheduleInterval })
  interval: ScheduleInterval;

  @Field(() => Number)
  @Column({ type: 'int', nullable: true })
  customIntervalDays: number; // For custom intervals

  @Field(() => ExecutionMethod)
  @Column({ type: 'enum', enum: ExecutionMethod })
  method: ExecutionMethod;

  @Field(() => Date)
  @Column({ type: 'date' })
  startDate: Date;

  @Field(() => Date)
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Field(() => String)
  @Column({ type: 'time', nullable: true })
  preferredTime: string; // Time of day for execution

  @Field(() => JSON)
  @Column({ type: 'jsonb', nullable: true })
  scheduleConfig: {
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    monthOfYear?: number; // 1-12 for quarterly/semi-annually
    weekOfMonth?: number; // 1-5 for monthly
  };

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field(() => String)
  @Column({ type: 'uuid', nullable: true })
  assignedUserId: string; // For manual execution

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizard)
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @Field(() => [ControlWizardExecution])
  @OneToMany(() => ControlWizardExecution, (execution) => execution.schedule)
  executions: ControlWizardExecution[];
}
