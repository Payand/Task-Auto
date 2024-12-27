// Decorators
import { Injectable } from "@nestjs/common";
// Repositories
import { UserRepository } from "@root/app/persistance/repositories";
// Entities
import { User } from "@root/app/persistance/entities";

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async addOne(username: string, password: string): Promise<User> {
    return await this.userRepository.addOne(username, password);
  }
}
