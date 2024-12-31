import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// Services
import { AuthService } from "@root/app/infrastructure/services/auth/auth.service";
// Exceptions
import { InvalidTokenException } from "@root/app/infrastructure/exceptions";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const skipAuth =
      this.reflector.getAllAndOverride<boolean>("skip_auth", [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    if (skipAuth) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers["authorization"]?.replace("Bearer ", "");
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = await this.authService.validateToken({
      token: accessToken,
    });

    if (!payload.valid) {
      throw new InvalidTokenException();
    }

    req.user = payload.user;

    return true;
  }
}
