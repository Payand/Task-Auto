// Types
import { DtoToJSON } from "@root/app/infrastructure/types";

export class CityDto {
  "place name": string;
  longitude: string;
  state: string;
  "state abbreviation": string;
  latitude: string;

  toJSON() {
    return {
      placeName: this["place name"],
      longitude: this.longitude,
      state: this.state,
      stateAbbreviation: this["state abbreviation"],
      latitude: this.latitude,
    };
  }

  constructor(payload: DtoToJSON<CityDto>) {
    Object.assign(this, payload);
  }
}
