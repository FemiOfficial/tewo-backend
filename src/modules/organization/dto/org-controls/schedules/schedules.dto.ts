import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsObject,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

import { IsFutureDate } from 'src/shared/validators';
import {
  ExecutionMethod,
  NotificationRecipientsType,
  ReminderTimeUnitBeforeTrigger,
  ScheduleInterval,
} from 'src/shared/db/typeorm/entities/control-wizard-schedule.entity';
@InputType()
export class ScheduleConfigDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  instant?: boolean;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dayOfWeek?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  dayOfMonth?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  monthOfYear?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  weekOfMonth?: string;
}

export class ReminderConfigDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  notifyOnReminder?: boolean;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  reminderInterval?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  reminderTrials?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  reminderSubject?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  reminderBody?: string;

  @IsOptional()
  @IsEnum(ReminderTimeUnitBeforeTrigger)
  @Field(() => ReminderTimeUnitBeforeTrigger, { nullable: true })
  reminderTimeUnitBeforeTrigger?: ReminderTimeUnitBeforeTrigger;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  reminderTimeUnitBeforeTriggerValue?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  reminderRecipients?: string[];

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  reminderTemplate?: string;
}

export class NotificationRecipientsDto {
  @IsOptional()
  @IsEnum(NotificationRecipientsType)
  @Field(() => NotificationRecipientsType, { nullable: true })
  type?: NotificationRecipientsType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  identities?: string[];
}

export class NotificationConfigDto {
  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  notifyOnCompletion?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  notifyOnFailure?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  notifyOnProgress?: boolean;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  bodyTemplate?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  subjectTemplate?: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => NotificationRecipientsDto)
  @Field(() => NotificationRecipientsDto, { nullable: true })
  recipients?: NotificationRecipientsDto;
}

@InputType()
export class UpsertControlWizardScheduleDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(ScheduleInterval)
  @Field(() => ScheduleInterval)
  interval: ScheduleInterval;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  customIntervalDays?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @IsFutureDate({ message: 'Start date must be in the future' })
  startDate: string; // if not specified the wizard with be executed the next day

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(ExecutionMethod)
  @Field(() => ExecutionMethod)
  method: ExecutionMethod;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  @Field(() => String)
  preferredTime: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ScheduleConfigDto)
  @Field(() => ScheduleConfigDto, { nullable: true })
  scheduleConfig?: ScheduleConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => NotificationConfigDto)
  @Field(() => NotificationConfigDto, { nullable: true })
  notificationConfig?: NotificationConfigDto;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ReminderConfigDto)
  @Field(() => ReminderConfigDto, { nullable: true })
  reminderConfig?: ReminderConfigDto;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  scheduleId?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  setIsActive?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isNew: boolean; // this is the flag to check if the schedule is new or not from the frontend

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true })
  assignedUsers?: string[]; // Array of user IDs to assign to this schedule
}

@InputType()
export class AssignControlWizardScheduleToFormDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  controlWizardId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  formId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  scheduleId: string;
}
@InputType()
export class UnassignControlWizardScheduleFromFormDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  formId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  scheduleId: string;
}

@InputType()
export class UnassignControlWizardScheduleFromReportDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  reportId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  scheduleId: string;
}

@InputType()
export class RemoveControlWizardScheduleDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  scheduleId: string;

  @IsOptional()
  @IsString()
  @Field(() => Boolean, { nullable: true })
  unassignAllEntities?: boolean;
}
