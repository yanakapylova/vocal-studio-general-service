import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Yana' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'K' })
  surname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'yana@gmail.com' })
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'qwerty' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'student' })
  role: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: '26-10-1999' })
  birthdate: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'image.png' })
  photoURL?: string;

  @IsOptional()
  @ApiProperty({ type: String, example: [1, 2] })
  groups?: number[];
}
