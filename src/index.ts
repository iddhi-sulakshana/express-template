import { configLogger, configRedis } from '@/config';
import initializeApp from '@/app';
import { checkDatabaseConnection } from '@/utils/db.util';
import { ENV } from '@/core';

async function main() {
  ENV.configEnvironment();

  // Config Logger
  const logger = configLogger();

  // Initialize Database Connection
  setTimeout(async () => {
    const isDatabaseConnected = await checkDatabaseConnection();
    if (!isDatabaseConnected) {
      logger.error('Failed to connect to the database ❌');
      process.exit(1);
    }
    logger.info('Database connected successfully ✅');
  }, 1000);

  // Initialize Redis Connection
  configRedis.createRedisClient();

  // Initialize Express App
  const app = initializeApp();

  // Initialize Tasks like cron jobs, etc.

  // Start the server
  const server = app.listen(ENV.PORT, (error) => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }
    logger.info(`Server listening on: http://localhost:${ENV.PORT}`);
    logger.info(`Swagger UI: http://localhost:${ENV.PORT}/api-docs`);
    logger.info(`API endpoint: http://localhost:${ENV.PORT}/api/v1`);
  });
  // Graceful Shutdown
  const shutdown = () => {
    const time = new Date().toISOString();
    logger.info(`Shutting down server at ${time}`);

    server.close(() => {
      logger.warn('Forcing shutdown after 10 seconds.');
      process.exit(1);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main();
