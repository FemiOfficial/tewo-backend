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
import { User } from './user.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

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

registerEnumType(ExecutionStatus, {
  name: 'ExecutionStatus',
});

registerEnumType(ExecutionType, {
  name: 'ExecutionType',
});

@ObjectType()
export class ExecutionResult {
  @Field(() => Boolean)
  success: boolean;

  data?: Record<string, any>;

  @Field(() => [String])
  errors?: string[];

  metrics?: Record<string, any>;
}

@Entity('control_wizard_executions')
@ObjectType()
export class ControlWizardExecution {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  scheduleId: string;

  @Field(() => ExecutionStatus)
  @Column({ type: 'enum', enum: ExecutionStatus })
  status: ExecutionStatus;

  @Field(() => ExecutionType)
  @Column({ type: 'enum', enum: ExecutionType })
  type: ExecutionType;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Field(() => ExecutionResult)
  @Column({ type: 'jsonb', nullable: true })
  executionResult: {
    success: boolean;
    data?: Record<string, any>;
    errors?: string[];
    metrics?: Record<string, any>;
  };

  @Field(() => String)
  @Column({ type: 'uuid', nullable: true })
  executedByUserId: string;

  @Field(() => String)
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardSchedule)
  @ManyToOne(() => ControlWizardSchedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule: ControlWizardSchedule;

  @Field(() => User)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'executedByUserId' })
  executedByUser: User;
}
