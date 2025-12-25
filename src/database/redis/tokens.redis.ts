import { configRedis } from '@/config';
import type { RefreshTokenRedisRecord } from '@/types';

export class TokensRedis {
  // Get Redis client dynamically when needed
  private static get redisClient() {
    return configRedis.getRedisClient();
  }

  // Set a refresh token in redis for the first time
  static async setRefreshToken(record: RefreshTokenRedisRecord) {
    const expiresIn = record.expiresAt;
    await this.redisClient.setex('token:' + record.sessionId, expiresIn, JSON.stringify(record));
  }

  // get a refresh token from redis using key
  static async getRefreshToken(sessionId: string) {
    const record = await this.redisClient.get('token:' + sessionId);
    if (!record) return null;
    return JSON.parse(record) as RefreshTokenRedisRecord;
  }

  // delete a refresh token from redis using key
  static async deleteRefreshToken(key: string) {
    return this.redisClient.del(key);
  }
}
