import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ControlWizard } from './control-wizard.entity';
import { ControlWizardExecution } from './control-wizard-execution.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from './user.entity';

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

export enum NotificationRecipientsType {
  SYSTEM_USERS = 'system_users',
  CUSTOM_USERS = 'custom_users',
}

export enum ReminderTimeUnitBeforeTrigger {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  HOUR = 'hour',
  MINUTE = 'minute',
}

export enum ControlWizardEntityScheduleStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  EXECUTED = 'executed',
  FAILED = 'failed',
}

registerEnumType(ControlWizardEntityScheduleStatus, {
  name: 'ControlWizardEntityScheduleStatus',
});

registerEnumType(ScheduleInterval, {
  name: 'ScheduleInterval',
});

registerEnumType(ExecutionMethod, {
  name: 'ExecutionMethod',
});

registerEnumType(NotificationRecipientsType, {
  name: 'NotificationRecipientsType',
});

registerEnumType(ReminderTimeUnitBeforeTrigger, {
  name: 'ReminderTimeUnitBeforeTrigger',
});

@ObjectType()
export class NotificationRecipients {
  @Field(() => NotificationRecipientsType, { nullable: true })
  type: NotificationRecipientsType;

  @Field(() => [String], { nullable: true })
  identities: string[];
}

@ObjectType()
export class NotificationConfig {
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  notifyOnCompletion: boolean;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  notifyOnFailure: boolean;

  @Field(() => NotificationRecipients, { nullable: true })
  recipients: NotificationRecipients;

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  notifyOnProgress: boolean;

  @Field(() => String, { nullable: true })
  bodyTemplate?: string;

  @Field(() => String, { nullable: true })
  subjectTemplate?: string;
}

export class ReminderConfig {
  @Field(() => Boolean, { nullable: true })
  notifyOnReminder: boolean;

  @Field(() => Number, { nullable: true })
  reminderInterval: number; // in minutes

  @Field(() => Number, { nullable: true })
  reminderTrials: number;

  @Field(() => String, { nullable: true })
  reminderSubject: string;

  @Field(() => String, { nullable: true })
  reminderBody: string;

  @Field(() => [String], { nullable: true })
  reminderRecipients: string[];

  @Field(() => ReminderTimeUnitBeforeTrigger, { nullable: true })
  reminderTimeUnitBeforeTrigger: ReminderTimeUnitBeforeTrigger;

  @Field(() => Number, { nullable: true })
  reminderTimeUnitBeforeTriggerValue: number;

  @Field(() => String, { nullable: true })
  reminderTemplate?: string;
}

@ObjectType()
export class ScheduleConfig {
  @Field(() => Number)
  @Column({ type: 'boolean', nullable: true, default: false })
  instant?: boolean;

  @Field(() => Number)
  @Column({ type: 'int', nullable: true })
  dayOfWeek?: number;

  @Column({ type: 'int', nullable: true })
  dayOfMonth?: number;

  @Field(() => Number)
  @Column({ type: 'int', nullable: true })
  monthOfYear?: number;

  @Field(() => Number)
  @Column({ type: 'int', nullable: true })
  weekOfMonth?: number;
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

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  nextExecutionAt: Date;

  @Field(() => String)
  @Column({ type: 'time', nullable: true })
  preferredTime: string; // Time of day for execution

  @Field(() => ScheduleConfig)
  @Column({ type: 'jsonb', nullable: true })
  scheduleConfig: ScheduleConfig;

  @Field(() => ReminderConfig)
  @Column({ type: 'jsonb', nullable: true })
  reminderConfig?: ReminderConfig;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User)
  @JoinTable({
    name: 'control_wizard_schedule_assigned_users',
    joinColumn: { name: 'scheduleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  assignedUsers: User[]; // this users can also manually trigger the schedule

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  createdByUserId: string;

  @Field(() => NotificationConfig)
  @Column({ type: 'jsonb', nullable: true })
  notificationConfig?: NotificationConfig;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @Field(() => ControlWizard)
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @Field(() => [ControlWizardExecution], { nullable: true })
  @OneToMany(() => ControlWizardExecution, (execution) => execution.schedule)
  executions: ControlWizardExecution[];
}
