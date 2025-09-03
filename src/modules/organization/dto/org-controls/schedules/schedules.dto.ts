import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

import { IsFutureDate } from 'src/shared/validators';
import {
  ExecutionMethod,
  ScheduleInterval,
} from 'src/shared/db/typeorm/entities/control-wizard-schedule.entity';

@InputType()
export class ScheduleConfigDto {
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
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  @Field(() => String, { nullable: true })
  scheduleId?: string;

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
