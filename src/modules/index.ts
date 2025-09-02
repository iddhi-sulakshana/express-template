import type { Express } from 'express';
import healthModule from './health';
import authModule from './auth';

export function initializeModules(app: Express) {
  // Global API prefix
  const PREFIX = '/api/v1';

  app.use(`${PREFIX}/health`, healthModule);
  app.use(`${PREFIX}/auth`, authModule);
}
