import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsFutureDate } from 'src/shared/validators';
import {
  ExecutionMethod,
  ScheduleInterval,
} from 'src/shared/db/typeorm/entities/control-wizard/control-wizard-schedule.entity';

export class ScheduleConfigDto {
  @IsOptional()
  @IsString()
  dayOfWeek?: string;

  @IsOptional()
  @IsString()
  dayOfMonth?: string;

  @IsOptional()
  @IsString()
  monthOfYear?: string;
}

export class UpsertControlWizardScheduleDto {
  @IsNotEmpty()
  @IsString()
  controlWizardId: string;

  @IsOptional()
  @ValidateIf((o) => o.isNew === true)
  @IsEnum(ScheduleInterval)
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
  method: ExecutionMethod;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === true)
  preferredTime: string;

  @IsOptional()
  @IsObject()
  @ValidateIf((o) => o.isNew === true)
  @Type(() => ScheduleConfigDto)
  scheduleConfig?: ScheduleConfigDto;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.isNew === false)
  scheduleId?: string;

  @IsNotEmpty()
  @IsBoolean()
  isNew: boolean; // this is the flag to check if the schedule is new or not from the frontend
}
