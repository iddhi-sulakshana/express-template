import '@/config/response.config';
import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares';
import { configMorgan, configSwagger, rateLimiter } from '@/config';
import { initializeModules } from '@/modules';

export default function initializeServer(): Application {
  const app = express();

  // Enable cross origin resource sharing
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      // if the environment is development then allow skip warning headers
      // Currently allowed: NGROK, PINGGY and ZROK
      ...(process.env.NODE_ENV === 'development'
        ? ['ngrok-skip-browser-warning', 'X-Pinggy-No-Screen', 'skip_zrok_interstitial']
        : []),
    }),
  );

  // enable parse incoming requests with JSON payloads
  app.use(express.json());

  // enable parse incoming requests with URL-encoded payloads
  app.use(express.urlencoded({ extended: true }));

  // logging http requests with morgan
  configMorgan(app);

  // Rate limiter
  app.use(rateLimiter);

  // Mount the routes module
  initializeModules(app);

  // Handles all the uncaught errors in the requests
  app.use(errorMiddleware);

  // Initialize Swagger
  configSwagger(app);

  return app;
}
