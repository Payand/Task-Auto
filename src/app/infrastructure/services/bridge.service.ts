// Decorators
import { Injectable } from "@nestjs/common";
import { InjectBridgeClient } from "@root/app/infrastructure/services/client.decorator";
// Utilities
import { BridgeClient } from "@root/app/infrastructure/services/client";

@Injectable()
export class BridgeService {
  constructor(@InjectBridgeClient() private readonly client: BridgeClient) {}

  async getCity(code: string) {
    return await this.client.getCity(code);
  }
}
