import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Crystal' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: '3:48' })
  @IsArray()
  @IsOptional()
  duration: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'some theme' })
  @IsArray()
  @IsOptional()
  theme: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: [1, 2] })
  @IsArray()
  @IsOptional()
  groups?: number[];
}
