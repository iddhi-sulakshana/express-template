import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';
import winston from 'winston';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { ENV } from '@/core';
import { apiReference } from '@scalar/express-api-reference';

export default function configSwagger(app: Express) {
  if (ENV.NODE_ENV !== 'development' && ENV.NODE_ENV !== 'staging') {
    return;
  }
  try {
    const loadSwaggerFiles = (): object => {
      const swaggerSpecs: any = {
        openapi: '3.1.1',
        info: {
          // TODO: Update this
          title: 'EXPRESS_TEMPLATE API',
          version: '1.0.0',
          // TODO: Update this
          description: 'Complete API reference for EXPRESS_TEMPLATE',
          ogDescription: 'Comprehensive API documentation with interactive client',
        },
        servers: [
          {
            url: `http://localhost:${ENV.PORT}/${ENV.APP_PREFIX}`,
            description: 'Local Development Server',
          },
          {
            url: `${ENV.APP_URL}/${ENV.APP_PREFIX}`,
            description: 'Working Server',
          },
        ],
        paths: {},
        components: {
          securitySchemes: {
            BearerAuth: {
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
          if (!spec) return;

          // Merge paths
          Object.assign(swaggerSpecs.paths, spec.paths || {});

          // Merge components
          if (spec.components) {
            if (spec.components.securitySchemes) {
              swaggerSpecs.components.securitySchemes = {
                ...swaggerSpecs.components.securitySchemes,
                ...spec.components.securitySchemes,
              };
            }
            Object.keys(spec.components).forEach((key) => {
              if (key !== 'securitySchemes') {
                swaggerSpecs.components[key] = {
                  ...swaggerSpecs.components[key],
                  ...spec.components[key],
                };
              }
            });
          }
        });
      });

      return swaggerSpecs;
    };

    const swaggerSpec = loadSwaggerFiles();

    // Serve the Swagger UI
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Serve the raw swagger.json
    app.get('/swagger.json', (_, res) => {
      res.json(swaggerSpec);
    });

    // Initialize API Reference
    app.use(
      '/scalar',
      apiReference({
        url: '/swagger.json',
        _integration: 'express',
        authentication: {
          preferredSecurityScheme: 'BearerAuth',
        },
        defaultHttpClient: {
          targetKey: 'js',
          clientKey: 'axios',
        },
        // TODO: Update this
        pageTitle: 'EXPRESS_TEMPLATE API Reference',
        // TODO: Update this
        favicon: 'https://cdn-icons-png.flaticon.com/512/1493/1493169.png',
        hideModels: true,
        layout: 'modern',
        hideDownloadButton: false,
        theme: 'bluePlanet',
      }),
    );
  } catch (error: any) {
    winston.error('Error initializing Swagger', error);
  }
}
