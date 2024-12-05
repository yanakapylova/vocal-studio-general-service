import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'A' })
  fathername: string;

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
  role: Role;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: "2024-11-21T00:00:00.000Z" })
  birthdate: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'some school' })
  school?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'some adress' })
  address?: string;

  @IsOptional()
  @ApiProperty({ type: String, example: 'image.png' })
  photoURL?: string;

  @IsOptional()
  @ApiProperty({ type: String, example: [1, 2] })
  groups?: number[];
}
