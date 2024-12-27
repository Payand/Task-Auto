// Utilities
import { CreateHttpInstance } from "@root/app/infrastructure/utils";
// Types and Interfaces
import { BridgeModuleOptions } from "@root/app/infrastructure/interfaces";
// DTOs
import { GetCityRequestDto, GetCityResponseDto } from "@root/app/infrastructure/dtos";
// Exceptions
import { NotFoundException } from "@nestjs/common";

export class BridgeClient {
  private readonly client: CreateHttpInstance;

  constructor(readonly options: BridgeModuleOptions) {
    options.baseURL ??= "https://api.zippopotam.us/";
    options.timeout ??= 60000;

    this.client = new CreateHttpInstance(options);
  }

  async getCity(code: string) {
    try {
      const params = new GetCityRequestDto({ code }).toJSON();
      const response = await this.client.get<GetCityResponseDto>(
        `us/${params.code}`,
      );
      return new GetCityResponseDto(response).toJSON();
    } catch {
      throw new NotFoundException();
    }
  }
}
