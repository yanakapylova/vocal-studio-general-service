import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { PrismaService } from "prisma/prisma.service";
import { GlobalCacheModule } from "src/global-cache.module";

@Module({
  imports: [GlobalCacheModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
