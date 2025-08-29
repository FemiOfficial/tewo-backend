import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ControlWizardReport } from './control-wizard-report.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ReportScheduleType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually',
  CUSTOM = 'custom',
}

export enum ReportScheduleStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DISABLED = 'disabled',
}

registerEnumType(ReportScheduleType, {
  name: 'ReportScheduleType',
});

registerEnumType(ReportScheduleStatus, {
  name: 'ReportScheduleStatus',
});

@Entity('control_wizard_report_schedules')
@ObjectType()
export class ControlWizardReportSchedule {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  reportId: string;

  @Field(() => ReportScheduleType)
  @Column({ type: 'enum', enum: ReportScheduleType })
  scheduleType: ReportScheduleType;

  @Field(() => ReportScheduleStatus)
  @Column({
    type: 'enum',
    enum: ReportScheduleStatus,
    default: ReportScheduleStatus.ACTIVE,
  })
  status: ReportScheduleStatus;

  @Column({ type: 'jsonb' })
  scheduleConfig: {
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    monthOfYear?: number; // 1-12 for quarterly/annually
    weekOfMonth?: number; // 1-5 for monthly
    customIntervalDays?: number; // For custom schedules
  };

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  preferredTime: string; // Time of day for generation

  @Field(() => Date)
  @Column({ type: 'date' })
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  autoGenerate: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  autoDistribute: boolean;

  @Column({ type: 'jsonb', nullable: true })
  distributionConfig: {
    recipients: string[];
    ccRecipients?: string[];
    bccRecipients?: string[];
    subjectTemplate?: string;
    bodyTemplate?: string;
  };

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastGeneratedAt: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  nextGenerationAt: Date;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  totalGenerated: number;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  totalDistributed: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardReport)
  @ManyToOne(() => ControlWizardReport, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ControlWizardReport;
}
