import { UnauthorizedException } from "@nestjs/common";
// Enums
import { TokenEnum } from "src/app/infrastructure/services/token/enums";

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super({
      errorType: TokenEnum.InvalidRefreshToken,
      message: "توکن نامعتبر",
      reason: `RefreshToken is not valid`,
    });
  }
}
