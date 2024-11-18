import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserID {
  @ApiProperty({ type: Number, example: 1 })
  readonly id: number;
}

export class UserDto extends IntersectionType(UserID, CreateUserDto) {}
