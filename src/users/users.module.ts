import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'prisma/prisma.service';

import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: Number(process.env.REDIS_PORT) || 6379,
          },
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000, // 3 minutes (milliseconds)
        };
      },
    }),
  ],
})
export class UsersModule {}
