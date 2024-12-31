import { Injectable } from "@nestjs/common";
import { TokenService } from "@root/app/infrastructure/services/token/token.service";
import {
  JwtPayload,
  TokenDto,
  ValidateTokenRequest,
} from "src/app/infrastructure/services/interfaces";

@Injectable()
export class AuthService {
  constructor(private readonly tokenService: TokenService) {}

  async userSingUp(payload: JwtPayload) {
    const jwtPayload: JwtPayload = {
      id: payload.id,
      username: payload.username,
    };

    const SingedToken: TokenDto = await this.tokenService.genToken(jwtPayload, {
      tokenRotation: true,
    });

    return {
      token: SingedToken,
    };
  }

  async validateToken(payload: ValidateTokenRequest) {
    return this.tokenService.validate(payload.token);
  }
}
