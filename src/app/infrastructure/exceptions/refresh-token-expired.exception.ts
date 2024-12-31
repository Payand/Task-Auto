import { UnauthorizedException } from "@nestjs/common";
// Enums
import { TokenEnum } from "src/app/infrastructure/services/token/enums";

export class RefreshTokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      errorType: TokenEnum.RefreshTokenExpired,
      message: "توکن منقضی شده است",
      reason: `RefreshToken has expired`,
    });
  }
}
