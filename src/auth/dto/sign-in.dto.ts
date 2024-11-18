import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'yana@gmail.com' })
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'qwerty' })
  @IsString()
  password: string;
}
