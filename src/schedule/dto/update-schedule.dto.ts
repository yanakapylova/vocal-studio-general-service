import { PartialType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UpdateScheduleDto extends PartialType(CreateScheduleDto) {
  @Type(() => Number)
  @IsInt()
  id: number;
}
