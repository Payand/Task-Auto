import { Controller, Get, Param } from "@nestjs/common";
// Services
import { BridgeService } from "@root/app/infrastructure/services/bridge/bridge.service";

@Controller("cities")
export class CityController {
  constructor(private readonly bridgeService: BridgeService) {}

  @Get(":code")
  async getCity(@Param("code") code: string) {
    return await this.bridgeService.getCity(code);
  }
}
