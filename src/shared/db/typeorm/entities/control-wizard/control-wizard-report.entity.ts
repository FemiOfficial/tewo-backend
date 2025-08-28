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
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

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

registerEnumType(ReportType, {
  name: 'ReportType',
});

registerEnumType(ReportFormat, {
  name: 'ReportFormat',
});

@Entity('control_wizard_reports')
@ObjectType()
export class ControlWizardReport {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Field(() => ReportType)
  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
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

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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

  @Field(() => [ControlWizardReportSchedule])
  @OneToMany(() => ControlWizardReportSchedule, (schedule) => schedule.report)
  schedules: ControlWizardReportSchedule[];
}
