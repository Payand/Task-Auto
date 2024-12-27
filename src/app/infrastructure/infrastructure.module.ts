// Types
import { BridgeModuleOptions } from "@root/app/infrastructure/interfaces";
import type { DynamicModule, Provider } from "@nestjs/common";
// Utilities
import { BridgeClient } from "@root/app/infrastructure/services/client";
// Constants
import { ZIPPOPTAM_MODULE_NAME } from "@root/app/infrastructure/constants";
// Services
import { BridgeService } from "@root/app/infrastructure/services/bridge.service";
import { AuthService } from "@root/app/infrastructure/services/auth.service";
// Modules
import { PersistenceModule } from "@root/app/persistance/persistence.module";



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
      module: InfrastructureModule,
      imports: [PersistenceModule],
      providers: [client, BridgeService, AuthService],
      exports: [client, BridgeService, AuthService],
    };
  }
}
