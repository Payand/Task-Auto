import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@root/app/api/model/user.model";
import { City } from "@root/app/persistance/entities/city.entity";

@Injectable()
export class UserRequestRepository {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async createCity(user: User, data: Partial<City>): Promise<City> {
    const entity = this.cityRepository.create({
      ...data,
      user,
    });
    return this.cityRepository.save(entity);
  }

  async findCityByUserId(
    userId: string,
    skip = 0,
    take = 10,
  ): Promise<[City[], number]> {
    return this.cityRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take,
      order: { createdOn: "DESC" },
    });
  }
}
