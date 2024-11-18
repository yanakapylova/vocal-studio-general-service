import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signin(@Body() signInUserDto: SignInUserDto) {
    return this.authService.signin(signInUserDto);
  }
}
