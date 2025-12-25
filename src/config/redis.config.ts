import Redis from 'ioredis';
import { ENV } from '@/core';
import winston from 'winston';

let redisClient: Redis | null = null;
let isConnected: boolean = false;

function createRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(ENV.REDIS_URL);

  redisClient.on('connect', () => {
    winston.info('Redis connection established ✅');
    isConnected = true;
  });

  redisClient.on('error', (error) => {
    winston.error('Redis connection error ❌', error);
    isConnected = false;
  });

  redisClient.on('close', () => {
    winston.info('Redis connection closed ❌');
    isConnected = false;
  });

  redisClient.on('reconnecting', () => {
    winston.info('Redis connection reconnecting ⏳');
    isConnected = false;
  });

  return redisClient;
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

function closeRedisClient() {
  if (redisClient) {
    redisClient.quit();
  }
}

function checkRedisConnection() {
  return isConnected;
}

export default {
  checkRedisConnection,
  createRedisClient,
  getRedisClient,
  closeRedisClient,
};
