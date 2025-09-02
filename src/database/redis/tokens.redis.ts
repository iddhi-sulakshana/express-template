import { getRedisClient } from '@/config/redis.config';
import type { RefreshTokenRedisRecord } from '@/types/jwt.types';

export class TokensRedis {
  // Get Redis client dynamically when needed
  private static get redisClient() {
    return getRedisClient();
  }

  // Set a refresh token in redis for the first time
  static async setRefreshToken(record: RefreshTokenRedisRecord) {
    const expiresIn = record.expiresAt;
    await this.redisClient.setex(record.sessionId, expiresIn, JSON.stringify(record));
  }

  // get a refresh token from redis using key
  static async getRefreshToken(sessionId: string) {
    const record = await this.redisClient.get(sessionId);
    if (!record) return null;
    return JSON.parse(record) as RefreshTokenRedisRecord;
  }

  // delete a refresh token from redis using key
  static async deleteRefreshToken(key: string) {
    return this.redisClient.del(key);
  }
}
