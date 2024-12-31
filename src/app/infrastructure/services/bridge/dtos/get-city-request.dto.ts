// Types
import { DtoToJSON } from "src/app/infrastructure/services/bridge/types";

export class GetCityRequestDto {
  code: string;

  toJSON() {
    return {
      code: this.code,
    };
  }

  constructor(payload: DtoToJSON<GetCityRequestDto>) {
    Object.assign(this, payload);
  }
}
