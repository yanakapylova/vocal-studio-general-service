import { ApiProperty } from '@nestjs/swagger';
import { Activity, Type } from '@prisma/client';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'permanent' })
  type: Type;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: String, example: '2024-11-21T00:00:00.000Z' })
  date: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: String, example: 'ПН' })
  day: string;

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
  activity: Activity;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: [1, 2, 3] })
  groups: number[];

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: String, example: [1, 2, 3] })
  songs?: number[];
}
