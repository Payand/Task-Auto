// Decorators
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// Types
import type { Repository } from "typeorm";
// Entities
import { User } from "@root/app/persistance/entities";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addOne(user: Partial<User>): Promise<User> {
    try {
      const myUser: User = this.userRepository.create(user);
      return this.userRepository.save(myUser);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
