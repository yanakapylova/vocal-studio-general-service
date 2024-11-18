import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 1 })
  @IsInt()
  id: number;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'qwerty' })
  @IsString()
  password: string;
}
