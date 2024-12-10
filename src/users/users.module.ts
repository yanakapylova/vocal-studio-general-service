import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "prisma/prisma.service";
import { GlobalCacheModule } from "src/global-cache.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [GlobalCacheModule],
})
export class UsersModule {}
