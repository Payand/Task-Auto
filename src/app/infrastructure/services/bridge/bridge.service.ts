import { Injectable } from "@nestjs/common";
import { InjectBridgeClient } from "@root/app/infrastructure/services/bridge/decorators/bridge.client.decorator";
import { BridgeClient } from "@root/app/infrastructure/services/bridge/client";

@Injectable()
export class BridgeService {
  constructor(@InjectBridgeClient() private readonly client: BridgeClient) {}

  async getCity(code: string) {
    return await this.client.getCity(code);
  }
}
