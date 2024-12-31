import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
// Events
import { UserSignedUpEvent } from "@root/app/api/controllers/users/events/impl";
// Services
import { UserRepository } from "@root/app/persistance/repositories";
// Utilities
import { Logger } from "@nestjs/common";

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpEventHandler
  implements IEventHandler<UserSignedUpEvent>
{
  private readonly logger = new Logger(UserSignedUpEvent.name);
  constructor(private readonly userRepository: UserRepository) {}
  async handle(event: UserSignedUpEvent) {
    this.logger.verbose("UserSignedUpEvent");

    this.logger.verbose(
      `User signed up -> ID: ${event.userId}, Username: ${event.username}`,
    );
  }
}
