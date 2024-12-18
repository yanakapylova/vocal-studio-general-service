import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { GroupsModule } from "./groups/groups.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { SongsModule } from "./songs/songs.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ScheduleModule,
    GroupsModule,
    SongsModule,

    // TODO: Add ENVs validation
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
