import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

export class GroupID {
  @ApiPropertyOptional({ type: Number, example: 1 })
  readonly id: number;
}

export class GroupDto extends IntersectionType(GroupID, CreateGroupDto) {}
