import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheService } from './cache.service';
import { MemoryCacheStore } from './stores/memory-cache.store';
import { RedisCacheStore } from './stores/redis-cache.store';
import { CACHE_STORE_TOKEN, CACHE_MODULE_OPTIONS } from './cache.constants';
import { CacheModuleOptions, CacheStore } from './cache.interfaces';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';

@Global()
@Module({})
export class CacheModule {
  static forRoot(options: CacheModuleOptions = {}): DynamicModule {
    const optionsProvider: Provider = {
      provide: CACHE_MODULE_OPTIONS,
      useValue: options,
    };

    const storeProvider: Provider = {
      provide: CACHE_STORE_TOKEN,
      useFactory: (): CacheStore => {
        if (options.redisUrl || options.redisHost) {
          return new RedisCacheStore(options);
        }
        return new MemoryCacheStore();
      },
    };

    return {
      module: CacheModule,
      providers: [optionsProvider, storeProvider, CacheService, HttpCacheInterceptor],
      exports: [CacheService, HttpCacheInterceptor],
    };
  }

  static forRootAsync(): DynamicModule {
    const storeProvider: Provider = {
      provide: CACHE_STORE_TOKEN,
      inject: [ConfigService],
      useFactory: (config: ConfigService): CacheStore => {
        const redisUrl = config.get<string>('REDIS_URL');
        const redisHost = config.get<string>('REDIS_HOST');
        const redisPort = config.get<number>('REDIS_PORT');
        const redisPassword = config.get<string>('REDIS_PASSWORD');
        const keyPrefix = config.get<string>('CACHE_KEY_PREFIX', 'pern:erp:');

        if (redisUrl || redisHost) {
          return new RedisCacheStore({
            redisUrl,
            redisHost,
            redisPort,
            redisPassword,
            keyPrefix,
          });
        }
        return new MemoryCacheStore();
      },
    };

    return {
      module: CacheModule,
      imports: [ConfigModule],
      providers: [storeProvider, CacheService, HttpCacheInterceptor],
      exports: [CacheService, HttpCacheInterceptor],
    };
  }
}
