import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SignInUserDto } from './dto/sign-in.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private rabbitClient: ClientProxy) {}

  async signin(signInUserDto: SignInUserDto) {
    return this.rabbitClient.send({ cmd: 'signin' }, signInUserDto);
  }
}
