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
import { ControlWizardForm } from './control-wizard-form.entity';

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

@ObjectType()
export class ReportConfig {
  @Field(() => [ReportFormat])
  formats: ReportFormat[];

  @Field(() => Boolean)
  includeCharts: boolean;

  @Field(() => Boolean)
  includeTables: boolean;

  @Field(() => Boolean)
  includeAttachments: boolean;

  @Field(() => Number, { nullable: true })
  maxFileSize?: number;

  @Field(() => [String], { nullable: true })
  customTemplates?: string[];
}

@ObjectType()
export class ReportContentConfig {
  @Field(() => [ReportContentSection])
  sections: ReportContentSection[];

  @Field(() => [ReportContentFilter])
  filters: ReportContentFilter[];

  @Field(() => [ReportContentSorting])
  sorting: ReportContentSorting[];
}

@ObjectType()
export class ReportContentSection {
  @Field(() => String)
  title: string;

  @Field(() => String)
  type: string;

  @Field(() => Boolean)
  required: boolean;

  @Field(() => String, { nullable: true })
  dataSource?: string;
}

@ObjectType()
export class ReportContentFilter {
  @Field(() => String)
  field: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  defaultValue?: any;

  @Field(() => String, { nullable: true })
  dataSource?: string;

  @Field(() => Boolean)
  required: boolean;
}

@ObjectType()
export class ReportContentSorting {
  @Field(() => String)
  field: string;

  @Field(() => String)
  type: string;

  @Field(() => String, { nullable: true })
  defaultValue?: any;

  @Field(() => String, { nullable: true })
  dataSource?: string;
}

@ObjectType()
export class ReportDistributionConfig {
  @Field(() => [String])
  recipients: string[];

  @Field(() => [String], { nullable: true })
  ccRecipients?: string[];

  @Field(() => [String], { nullable: true })
  bccRecipients?: string[];

  @Field(() => String, { nullable: true })
  subjectTemplate?: string;

  @Field(() => String, { nullable: true })
  bodyTemplate?: string;

  @Field(() => Boolean)
  autoSend: boolean;

  @Field(() => Boolean)
  sendOnCompletion: boolean;
}

@Entity('control_wizard_reports')
@ObjectType()
export class ControlWizardReport {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  formId: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  templateId: string; // ID of an existing document template

  @Field(() => ReportType)
  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => ReportConfig)
  @Column({ type: 'jsonb' })
  reportConfig: ReportConfig;

  @Field(() => ReportContentConfig)
  @Column({ type: 'jsonb', nullable: true })
  contentConfig: ReportContentConfig;

  @Field(() => ReportDistributionConfig)
  @Column({ type: 'jsonb', nullable: true })
  distributionConfig: ReportDistributionConfig;

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

  @Field(() => ControlWizardForm)
  @ManyToOne(() => ControlWizardForm, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formId' })
  form: ControlWizardForm;

  @Field(() => [ControlWizardReportSchedule])
  @OneToMany(() => ControlWizardReportSchedule, (schedule) => schedule.report)
  schedules: ControlWizardReportSchedule[];
}
