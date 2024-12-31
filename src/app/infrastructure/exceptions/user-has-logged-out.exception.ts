import { UnauthorizedException } from "@nestjs/common";

export class UserHasLoggedOutException extends UnauthorizedException {
  constructor() {
    super({
      errorType: "user-has-logged-out",
      message: "توکن نامعتبر",
      reason: `User has logged out.`,
    });
  }
}
