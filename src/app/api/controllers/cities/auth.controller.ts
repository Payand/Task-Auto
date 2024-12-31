import { Controller, Post, Body, Get, UseGuards } from "@nestjs/common";
// Buses
import { CommandBus, QueryBus } from "@nestjs/cqrs";
// Commands
import { SignUpUserCommand } from "@root/app/api/controllers/users/commands/impl";
// Queries
import { GetMe } from "@root/app/api/controllers/users/queries/impl/get-me.query";
// Decorators
import { GetUser } from "@root/app/utils/current-user.decorator";
// Guards
import { AuthGuard } from "@root/app/api/gurads";
// DTOs
import { SignUpUserRequestDto } from "src/app/api/controllers/users/dtos";
// Entities
import { User } from "@root/app/persistance/entities";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post("sign-up")
  async signUp(@Body() data: SignUpUserRequestDto) {
    return await this.commandBus.execute(new SignUpUserCommand(data));
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async me(@GetUser() user: Partial<User>) {
    return await this.queryBus.execute(new GetMe(user.id));
  }
}
