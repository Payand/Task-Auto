import { UnauthorizedException } from "@nestjs/common";
// Types
import { TokenEnum } from "src/app/infrastructure/services/token/enums";

export class AccessTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: TokenEnum.AccessTokenExpired,
      message: "توکن شما منقضی شده است.",
      reason: `AccessToken has expired`,
    });
  }
}
