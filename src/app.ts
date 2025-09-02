import '@/config/response.config';
import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares';
import { configMorgan, configSwagger } from '@/config';
import { initializeModules } from '@/modules';

export default function initializeApp(): Application {
  const app = express();

  // Enable cross origin resource sharing
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // enable parse incoming requests with JSON payloads
  app.use(express.json());

  // enable parse incoming requests with URL-encoded payloads
  app.use(express.urlencoded({ extended: true }));

  // logging http requests with morgan
  configMorgan(app);

  // Mount the routes module
  initializeModules(app);

  // Handles all the uncaught errors in the requests
  app.use(errorMiddleware);

  // Initialize Swagger
  configSwagger(app);

  return app;
}
