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

@Entity('control_wizard_report_schedules')
export class ControlWizardReportSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reportId: string;

  @Column({ type: 'enum', enum: ReportScheduleType })
  scheduleType: ReportScheduleType;

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

  @Column({ type: 'time', nullable: true })
  preferredTime: string; // Time of day for generation

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'boolean', default: true })
  autoGenerate: boolean;

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

  @Column({ type: 'timestamp', nullable: true })
  lastGeneratedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextGenerationAt: Date;

  @Column({ type: 'int', default: 0 })
  totalGenerated: number;

  @Column({ type: 'int', default: 0 })
  totalDistributed: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizardReport, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ControlWizardReport;
}
