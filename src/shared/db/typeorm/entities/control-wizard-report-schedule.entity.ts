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
import { ControlWizardSchedule } from './control-wizard-schedule.entity';

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

  @Field(() => String)
  @Column({ type: 'uuid' })
  scheduleId: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  autoDistribute: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastGeneratedAt: Date;

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
  @ManyToOne(() => ControlWizardReport)
  @JoinColumn({ name: 'reportId' })
  report: ControlWizardReport;

  @Field(() => ControlWizardSchedule)
  @ManyToOne(() => ControlWizardSchedule)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ControlWizardSchedule;
}
