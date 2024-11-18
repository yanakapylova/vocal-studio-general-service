import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { GroupsModule } from './groups/groups.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ScheduleModule,
    GroupsModule,
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
