// Enums
import { TokenType } from "src/app/infrastructure/services/token/enums";

export interface MetadataJwtPayload {
  ip: string;
}

export interface JwtPayload {
  id: string;
  username: string;
  type?: TokenType;
  detail?: MetadataJwtPayload;
}

export interface GenerateTokenOptions {
  tokenRotation: boolean;
}

export class ValidateTokenRequest {
  readonly token: string;
}
