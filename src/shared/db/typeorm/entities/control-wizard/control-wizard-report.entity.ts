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
import { ControlWizardReportSchedule } from './control-wizard-report-schedule.entity';

export enum ReportType {
  COMPLIANCE_REPORT = 'compliance_report',
  AUDIT_REPORT = 'audit_report',
  RISK_ASSESSMENT = 'risk_assessment',
  INCIDENT_REPORT = 'incident_report',
  ACCESS_REVIEW = 'access_review',
  POLICY_REVIEW = 'policy_review',
  PERFORMANCE_METRICS = 'performance_metrics',
  EXECUTIVE_SUMMARY = 'executive_summary',
}

export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  WORD = 'word',
  HTML = 'html',
  JSON = 'json',
  CSV = 'csv',
}

@Entity('control_wizard_reports')
export class ControlWizardReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  reportConfig: {
    formats: ReportFormat[];
    includeCharts: boolean;
    includeTables: boolean;
    includeAttachments: boolean;
    maxFileSize?: number;
    customTemplates?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  contentConfig: {
    sections: {
      title: string;
      type: string;
      required: boolean;
      dataSource?: string;
    }[];
    filters: {
      field: string;
      type: string;
      defaultValue?: any;
    }[];
    sorting: {
      field: string;
      direction: 'asc' | 'desc';
    }[];
  };

  @Column({ type: 'jsonb', nullable: true })
  distributionConfig: {
    recipients: string[];
    ccRecipients?: string[];
    bccRecipients?: string[];
    subjectTemplate?: string;
    bodyTemplate?: string;
    autoSend: boolean;
    sendOnCompletion: boolean;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ControlWizard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'controlWizardId' })
  controlWizard: ControlWizard;

  @OneToMany(() => ControlWizardReportSchedule, (schedule) => schedule.report)
  schedules: ControlWizardReportSchedule[];
}
