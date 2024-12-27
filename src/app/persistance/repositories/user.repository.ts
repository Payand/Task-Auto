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

  async addOne(username: string, password: string): Promise<User> {
    const user: User = this.userRepository.create({ username, password });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
