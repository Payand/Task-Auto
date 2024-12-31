import { Logger } from "@nestjs/common";
// Handlers
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
// Queries
import { GetMe } from "@root/app/api/controllers/users/queries/impl";
// Repositories
import { UserRepository } from "@root/app/persistance/repositories";

@QueryHandler(GetMe)
export class GetMeHandler implements IQueryHandler {
  private readonly logger = new Logger(GetMeHandler.name);

  constructor(private repository: UserRepository) {}

  async execute(query: GetMe) {
    const { userId } = query;
    this.logger.verbose("GetMe");
    return this.repository.findOne(userId);
  }
}
