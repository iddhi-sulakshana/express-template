import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { ENV } from '@/core';
import { __dirname } from '@/utils/path.util';

export default function configSwagger(app: Express) {
  if (ENV.NODE_ENV !== 'development') {
    return;
  }
  try {
    const loadSwaggerFiles = (): object[] => {
      const swaggerSpecs: any = {
        openapi: '3.0.0',
        info: {
          title: 'Express Template API',
          version: '1.0.0',
          description: 'Express Template API Documentation',
        },
        servers: [
          {
            url: 'http://localhost:3000/api/v1',
            description: 'Local Development Server',
          },
          {
            url: 'https://your-staging-domain.com/api/v1',
            description: 'Staging Server',
          },
          {
            url: 'https://your-production-domain.com/api/v1',
            description: 'Production Server',
          },
        ],
        paths: {},
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'Provide JWT token in the format: `Bearer <token>`',
            },
          },
        },
      };
      const modulesDir = path.resolve(__dirname, '../modules');
      const modules = fs.readdirSync(modulesDir);

      modules.forEach((module) => {
        const swaggerDir = path.join(modulesDir, module, 'swagger');
        const swaggerFiles = fs.existsSync(swaggerDir)
          ? fs.readdirSync(swaggerDir).filter((file) => file.endsWith('.swagger.yaml'))
          : [];
        swaggerFiles.forEach((file) => {
          const swaggerFilePath = path.join(swaggerDir, file);
          const yamlContent = fs.readFileSync(swaggerFilePath, 'utf8');
          const spec: any = yaml.load(yamlContent);
          if (!spec) {
            return;
          }
          Object.assign(swaggerSpecs.paths, spec.paths || {});
          Object.assign(swaggerSpecs, spec.components || {});
        });
      });

      return swaggerSpecs;
    };
    const swaggerYamlFiles = loadSwaggerFiles();

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerYamlFiles));
  } catch (error: any) {
    winston.error('Error initializing Swagger', error);
  }
}
