// Types
import { DtoToJSON } from "@root/app/infrastructure/types";

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
