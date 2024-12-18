import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { jwtConstants, RABBITMQ_URL } from "src/constants/constants";
import { UsersService } from "src/users/users.service";
import { PrismaService } from "prisma/prisma.service";
import { GlobalCacheModule } from "src/global-cache.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    // TODO: Prefer asynchronous modules mounting
    // E.g. use `registerAsync` method here
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue: "signin_queue",
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "3600s" },
    }),
    GlobalCacheModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService],
})
export class AuthModule {}
