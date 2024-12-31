import { UnauthorizedException } from "@nestjs/common";
// Enums
import { TokenEnum } from "src/app/infrastructure/services/token/enums";

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({
      errorType: TokenEnum.InvalidToken,
      message: "توکن نامعتبر",
      reason: `Token is not valid`,
    });
  }
}
