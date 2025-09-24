import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInUserDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signInUserDto: SignInUserDto) {
    try {
      const user = await this.userService.findUserForAuth(signInUserDto.email);

      if (!user || !user.password) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(signInUserDto.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const payload = { sub: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);

      const fullUser = await this.userService.findOne(user.id);
      return {
        access_token,
        user: {
          id: fullUser.id,
          email: fullUser.email,
          name: fullUser.name,
          surname: fullUser.surname,
          birthdate: fullUser.birthdate,
          role: fullUser.role,
          photoURL: fullUser.photoURL,
          isActive: fullUser.isActive,
          groups: fullUser.groups,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      return null;
    }
  }
}
