import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
// Commands
import { SignUpUserCommand } from "@root/app/api/controllers/users/commands/impl";
// Events
import { UserSignedUpEvent } from "@root/app/api/controllers/users/events/impl/user-signed-up.event";
// Services
import { AuthService } from "@root/app/infrastructure/services/auth/auth.service";
// Repositories
import { UserRepository } from "@root/app/persistance/repositories";

@CommandHandler(SignUpUserCommand)
export class SignUpUserHandler implements ICommandHandler<SignUpUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly authService: AuthService,
  ) {}

  async execute(command: SignUpUserCommand) {
    const { data } = command;

    const newUser = await this.userRepository.addOne({
      username: data.username,
      password: data.password,
    });

    const token = await this.authService.userSingUp({
      id: newUser.id,
      username: newUser.username,
    });

    this.eventBus.publish(new UserSignedUpEvent(newUser.id, newUser.username));

    return { token };
  }
}
