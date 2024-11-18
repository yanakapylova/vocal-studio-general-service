import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Crystal' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: [1, 2] })
  @IsArray()
  @IsOptional()
  users?: number[];

  @IsNotEmpty()
  @ApiProperty({ type: String, example: [1, 2] })
  @IsArray()
  @IsOptional()
  schedules?: number[];
}
