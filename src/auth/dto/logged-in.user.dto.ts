import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

class UserDto {
  @ApiProperty({ type: Number, example: 1 })
  readonly id: number;

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

export class LoggedInUserDto {
  @ApiProperty({ type: String, example: 'qwerty' })
  readonly access_token: string;
  @ApiProperty({
    type: Object,
    example: {
      id: 1,
      name: 'Yana',
      surname: 'K',
      email: 'yana@gmail.com',
      password: 'qwerty',
      role: 'student',
      birthdate: '26-10-1999',
      photoURL: 'image.png',
      groups: [1, 2],
    },
  })
  readonly user: UserDto;
}
