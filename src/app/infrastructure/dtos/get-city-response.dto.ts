// DTOs
import { CityDto } from "@root/app/infrastructure/dtos/city.dto";
// Types
import { DtoToJSON } from "@root/app/infrastructure/types";

export class GetCityResponseDto {
  "post code": string;
  country: string;
  "country abbreviation": string;
  places: Array<CityDto>;
  toJSON() {
    return {
      postCode: this["post code"],
      country: this.country,
      countryAbbreviation: this["country abbreviation"],
      places: this.places.map((place: CityDto) => new CityDto(place).toJSON()),
    };
  }

  constructor(payload: DtoToJSON<GetCityResponseDto>) {
    Object.assign(this, payload);
  }
}
