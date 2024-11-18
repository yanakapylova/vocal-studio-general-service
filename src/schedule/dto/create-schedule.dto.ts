import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'permanent' })
  type: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '16-11' })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '15:00' })
  time: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'place name' })
  place: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '90' })
  durationMin: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'vocal' })
  activity: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: [1, 2, 3] })
  groups: number[];
}
