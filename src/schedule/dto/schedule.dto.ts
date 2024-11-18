import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { CreateScheduleDto } from './create-schedule.dto';

export class ScheduleID {
  @ApiPropertyOptional({ type: Number, example: 1 })
  readonly id: number;
}

export class ScheduleDto extends IntersectionType(
  ScheduleID,
  CreateScheduleDto,
) {}
