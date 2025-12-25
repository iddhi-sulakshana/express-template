import type { HealthReport } from '../dto/health.dto';
import { HTTP_STATUS } from '@/core';
import os from 'os';
import { checkDatabaseConnection } from '@/utils/db.util';
import { configRedis } from '@/config';
import type { DataResponse } from '@/types';

export async function checkHealthService(): Promise<DataResponse<HealthReport>> {
  const response: HealthReport = {
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: {
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      usedMemory: os.totalmem() - os.freemem(),
    },
    cpuUsage: process.cpuUsage(),
    dependencies: {
      postgresql: {
        status: 'ISSUE',
        message: 'Database is not running',
      },
      redis: {
        status: 'ISSUE',
        message: 'Redis is not running',
      },
    },
  };

  // Check the database connection
  const isDatabaseConnected = await checkDatabaseConnection();
  if (isDatabaseConnected) {
    response.dependencies.postgresql.status = 'OK';
    response.dependencies.postgresql.message = 'Database is running';
  }

  // Check the redis connection
  if (configRedis.checkRedisConnection()) {
    response.dependencies.redis.status = 'OK';
    response.dependencies.redis.message = 'Redis is running';
  }

  return {
    message: 'Server is running',
    status: HTTP_STATUS.OK,
    data: response,
  };
}
