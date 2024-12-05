import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { PrismaService } from 'prisma/prisma.service';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { redisStoreConfig } from 'src/constants/constants';

@Module({
  controllers: [SongsController],
  providers: [SongsService, PrismaService],
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore(redisStoreConfig);

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000, // 3 minutes (milliseconds)
        };
      },
    }),
  ],
})
export class SongsModule {}
