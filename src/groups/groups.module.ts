import { Module } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { GroupsController } from "./groups.controller";
import { PrismaService } from "prisma/prisma.service";
import { GlobalCacheModule } from "src/global-cache.module";

@Module({
  imports: [GlobalCacheModule],
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService],
})
export class GroupsModule {}
