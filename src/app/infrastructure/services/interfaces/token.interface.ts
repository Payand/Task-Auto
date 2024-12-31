import { JwtPayload } from "@root/app/infrastructure/services/interfaces/jwt.interface";

export interface TokenDto {
  tokenType: string;
  accessToken: string;
  accessTokenExpires: number;
  refreshToken?: string;
}

export type CachedToken = TokenDto & {
  id: JwtPayload["id"];
  username: JwtPayload["username"];
};
