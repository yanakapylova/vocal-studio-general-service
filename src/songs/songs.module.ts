import { Module } from "@nestjs/common";
import { SongsService } from "./songs.service";
import { SongsController } from "./songs.controller";
import { PrismaService } from "prisma/prisma.service";
import { GlobalCacheModule } from "src/global-cache.module";

@Module({
  controllers: [SongsController],
  providers: [SongsService, PrismaService],
  imports: [GlobalCacheModule],
})
export class SongsModule {}
