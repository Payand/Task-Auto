import { Module, DynamicModule, Provider } from "@nestjs/common";
// Types
import { BridgeModuleOptions } from "src/app/infrastructure/services/interfaces";
// Utilities
import { BridgeClient } from "@root/app/infrastructure/services/bridge/client";
// Constants
import { ZIPPOPTAM_MODULE_NAME } from "src/app/infrastructure/services/bridge/constants";
// Services
import { AuthService } from "@root/app/infrastructure/services/auth/auth.service";
import { BridgeService } from "@root/app/infrastructure/services/bridge/bridge.service";
import { TokenService } from "@root/app/infrastructure/services/token/token.service";
import Redis from "ioredis";

import { CachedTokenService } from "@root/app/infrastructure/services/cache/cache.service";

@Module({})
export class InfrastructureModule {
  static async registerAsync(
    options: BridgeModuleOptions = {},
  ): Promise<DynamicModule> {
    const client: Provider = {
      provide: ZIPPOPTAM_MODULE_NAME,
      useFactory: () => {
        return new BridgeClient(options);
      },
    };

    return {
      global: options.isGlobal ?? false,
      imports: [],
      module: InfrastructureModule,
      providers: [
        client,
        BridgeService,
        AuthService,
        TokenService,
        CachedTokenService,
        {
          provide: "REDIS_CLIENT",
          useFactory: () => {
            return new Redis({
              host: "localhost",
              port: 6379,
            });
          },
        },
      ],
      exports: [
        client,
        BridgeService,
        AuthService,
        TokenService,
        "REDIS_CLIENT",
      ],
    };
  }
}
