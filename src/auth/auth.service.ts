import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInUserDto } from "./dto/sign-in.dto";
import { ClientProxy } from "@nestjs/microservices";
import { UsersService } from "src/users/users.service";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @Inject("AUTH_SERVICE") private rabbitClient: ClientProxy
  ) {}

  async signin(signInUserDto: SignInUserDto) {
    try {
      const data = await firstValueFrom(
        this.rabbitClient.send({ cmd: "signin" }, signInUserDto)
      );

      const user = await this.userService.findOne(data["user"].id);
      return {
        access_token: data["access_token"],
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          birthdate: user.birthdate,
          role: user.role,
          photoURL: user.photoURL,
          isActive: user.isActive,
          groups: user.groups,
        },
      };
    } catch (err) {
      Logger.error(err);

      return null;
    }
  }
}
