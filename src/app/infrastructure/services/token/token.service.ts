import { Injectable } from "@nestjs/common";
import { omit } from "ramda";
import { V3 as Paseto } from "paseto";
// Ser
import { ConfigService } from "@nestjs/config";
import { CachedTokenService } from "@root/app/infrastructure/services/cache/cache.service";
// Repositories
import { UserRepository } from "@root/app/persistance/repositories";
// Exceptions
import {
  AccessTokenExpiredException,
  InvalidTokenException,
  RefreshTokenExpiredException,
  UserHasLoggedOutException,
} from "@root/app/infrastructure/exceptions";
// Types and Interfaces
import { TokenType } from "src/app/infrastructure/services/token/enums";
import {
  GenerateTokenOptions,
  JwtPayload,
  TokenDto,
} from "src/app/infrastructure/services/interfaces";
// Entities
import { User } from "@root/app/persistance/entities";

@Injectable()
export class TokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cachedTokenService: CachedTokenService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate Auth token (JWT) service for login user
   * @returns TokenDto Returns access and refresh tokens with expiry
   * @param payload
   * @param options
   */
  async genToken(
    payload: JwtPayload,
    options: GenerateTokenOptions,
  ): Promise<TokenDto> {
    const tokenDto: Partial<TokenDto> = {};
    if (options.tokenRotation) {
      tokenDto.refreshToken = await this.signRefreshToken(payload);

      await this.cachedTokenService.setRefreshSession(
        payload.id,
        tokenDto.refreshToken,
      );
    }

    tokenDto.accessToken = await this.signAccessToken(payload);

    await this.cachedTokenService.setAccessSession(
      payload.id,

      {
        ...tokenDto,
        id: payload.id,
        username: payload.username,
      },
    );

    return tokenDto as TokenDto;
  }

  /**
   * Generate Refresh token (JWT) service for generating new refresh and access tokens
   * @returns  Returns access and refresh tokens with expiry or error
   * @param refreshToken
   */
  async genRefreshToken(refreshToken: string): Promise<TokenDto> {
    const { id, username } = await this.verifyToken(
      refreshToken,
      TokenType.RefreshToken,
    );
    const isRefreshSessionExists =
      await this.cachedTokenService.isRefreshSessionExists(id);
    if (!isRefreshSessionExists) {
      throw new UserHasLoggedOutException();
    }

    return this.genToken(
      {
        id,
        username,
      },
      {
        tokenRotation: true,
      },
    );
  }

  async getUser(username: string) {
    return this.userRepository.findByUsername(username);
  }

  verifyToken(token: string, type: TokenType) {
    if (type === "ACCESS_TOKEN") {
      return this.verifyAccessToken(token);
    }

    return this.verifyRefreshToken(token);
  }

  /**
   * Check security concern for the User by id
   * @private
   * @param username
   */
  private async securityChecks(username: string) {
    const user = await this.getUser(username);

    const cachedAccessToken =
      await this.cachedTokenService.getAccessSessionByField(
        user.id,
        "accessToken",
      );

    if (!user?.id || !cachedAccessToken) {
      throw new InvalidTokenException();
    }

    return user;
  }

  /**
   * Validate received JWT
   * @param token {string}
   * @returns valid: boolean
   */
  async validate(token: string) {
    const $invalidUser = { valid: false, user: null };
    const { id: userId, username } =
      await this.verifyAccessToken<JwtPayload>(token);

    const userPayload = await this.securityChecks(username);
    if (!userId) {
      return $invalidUser;
    }

    const isValid = !!userId;
    if (isValid) {
      const cachedToken = await this.cachedTokenService.getAccessSessionByField(
        userId,
        "accessToken",
      );
      const isLoggedIn = !!cachedToken;
      if (isLoggedIn) {
        const user$: Partial<User> = omit(["password"], userPayload);

        return {
          valid: true,
          user: {
            ...user$,
          },
        };
      }
    }

    return $invalidUser;
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @returns JWT
   */
  private signAccessToken(payload: JwtPayload): Promise<string> {
    return Paseto.sign(
      payload as any,
      this.configService.getOrThrow("ACCESS_TOKEN_PRIVATE_KEY"),
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        iat: true,
        audience: "user:access:client",
        issuer: "ir",
        subject: "auth",
      },
    );
  }

  /**
   * Verify JWT token
   * @private
   * @param token {string}
   */
  private async verifyAccessToken<T = any>(token: string) {
    try {
      return await Paseto.verify<T>(
        token,
        this.configService.getOrThrow("ACCESS_TOKEN_PUBLIC_KEY"),
        {
          maxTokenAge: process.env.ACCESS_TOKEN_EXPIRES_IN,
          audience: "user:access:client",
          issuer: "ir",
          subject: "auth",
        },
      );
    } catch {
      throw new AccessTokenExpiredException();
    }
  }

  /**
   * Generate JWT token
   * @private
   * @param payload {JwtPayload}
   * @returns JWT
   */
  private signRefreshToken(payload: JwtPayload): Promise<string> {
    return Paseto.sign(
      payload as any,
      this.configService.getOrThrow("REFRESH_TOKEN_PRIVATE_KEY"),
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        iat: true,
        audience: "user:refresh:client",
        issuer: "ir",
        subject: "auth",
      },
    );
  }

  /**
   * Verify JWT token
   * @private
   * @param token {string}
   */
  private async verifyRefreshToken<T extends object = any>(token: string) {
    try {
      return await Paseto.verify<T>(
        token,
        this.configService.getOrThrow("REFRESH_TOKEN_PUBLIC_KEY"),
        {
          maxTokenAge: process.env.REFRESH_TOKEN_EXPIRES_IN,
          audience: "user:refresh:client",
          issuer: "ir",
          subject: "auth",
        },
      );
    } catch {
      throw new RefreshTokenExpiredException();
    }
  }
}
