import { Module, Global } from "@nestjs/common";
import { CacheModule, CacheStore } from "@nestjs/cache-manager"; // Или ваш аналогичный модуль
import { redisStore } from "cache-manager-redis-yet";
import { redisStoreConfig } from "./constants/constants";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore(redisStoreConfig);

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000, // 3 минуты в миллисекундах
        };
      },
    }),
  ],
  exports: [CacheModule], // Экспортируем модуль, чтобы он был доступен глобально
})
export class GlobalCacheModule {}
