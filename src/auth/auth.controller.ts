import { Controller, Post, Body, HttpException, Logger } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInUserDto } from "./dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signin(@Body() signInUserDto: SignInUserDto) {
    const result = await this.authService.signin(signInUserDto);
    if (result) {
      return result;
    } else {
      throw new HttpException(
        "something went wrong, please, try again later",
        500
      );
    }
  }
}
