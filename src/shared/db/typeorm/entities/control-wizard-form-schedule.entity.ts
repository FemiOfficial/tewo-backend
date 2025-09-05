import { Field, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { ControlWizardForm } from './control-wizard-form.entity';
import { ControlWizardSchedule } from './control-wizard-schedule.entity';
import { ControlWizardEntityScheduleStatus } from './control-wizard-schedule.entity';
@Entity('control_wizard_form_schedules')
@ObjectType()
export class ControlWizardFormSchedule {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  controlWizardFormId: string;

  @Field(() => String)
  @Column({ type: 'uuid' })
  scheduleId: string;

  @Field(() => ControlWizardEntityScheduleStatus)
  @Column({ type: 'enum', enum: ControlWizardEntityScheduleStatus })
  status: ControlWizardEntityScheduleStatus;

  @Field(() => Date)
  @Column({ type: 'timestamptz', nullable: true })
  lastTriggerAt: Date;

  @Field(() => Number)
  @Column({ type: 'int', default: 0 })
  totalTriggered: number;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // Relations
  @Field(() => ControlWizardForm)
  @ManyToOne(() => ControlWizardForm)
  @JoinColumn({ name: 'controlWizardFormId' })
  controlWizardForm: ControlWizardForm;

  @Field(() => ControlWizardSchedule)
  @ManyToOne(() => ControlWizardSchedule)
  @JoinColumn({ name: 'scheduleId' })
  schedule: ControlWizardSchedule;
}
