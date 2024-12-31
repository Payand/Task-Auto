import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class CachedTokenService {
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redisClient: Redis, // from ioredis
  ) {}

  /**
   * Store a refresh token in Redis for a given user.
   * Optionally set an expiry time if you want the refresh token to expire in Redis.
   */
  async setRefreshSession(userId: string, refreshToken: string): Promise<void> {
    const EXPIRE_SECONDS = 60 * 60 * 24 * 7;

    await this.redisClient.set(
      `user:${userId}:refreshToken`,
      refreshToken,
      "EX",
      EXPIRE_SECONDS,
    );
  }

  /**
   * Check if a refresh token is present for this user.
   */
  async isRefreshSessionExists(userId: string): Promise<boolean> {
    const refreshToken = await this.redisClient.get(
      `user:${userId}:refreshToken`,
    );
    return !!refreshToken;
  }

  /**
   * Store the access session (any data relevant to the user's session).
   * You might store the token, username, roles, etc.
   * Optionally set an expiration if it should expire in Redis.
   */
  async setAccessSession(userId: string, sessionData: any): Promise<void> {
    // Example: store the entire session as JSON
    await this.redisClient.set(
      `user:${userId}:accessSession`,
      JSON.stringify(sessionData),
    );
  }

  /**
   * Retrieve a single field from the user's access session, e.g. 'accessToken'.
   */
  async getAccessSessionByField(
    userId: string,
    field: string,
  ): Promise<string | null> {
    const sessionStr = await this.redisClient.get(
      `user:${userId}:accessSession`,
    );
    if (!sessionStr) return null;

    try {
      const session = JSON.parse(sessionStr);
      return session[field] ?? null;
    } catch (e) {
      return e;
    }
  }
}
