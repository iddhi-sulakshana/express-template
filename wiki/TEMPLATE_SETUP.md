# Express Template Setup Instructions

This document provides step-by-step instructions for converting this project into your own custom Express application.

## 📋 Setup Checklist

### 1. Project Renaming

- [ ] Rename the project directory from `express-template` to your desired project name
- [ ] find `TODO:` in the code and replace it with your project name
- [ ] Update [package.json](../package.json) name field
- [ ] Update any remaining references in documentation

### 2. Database Configuration

- [ ] Update database name in [docker-compose.yml](../docker-compose.yml) (already updated to `system-local`)
- [ ] Update database URLs in environment variables
- [ ] Update database references in wiki documentation

### 3. API Documentation

- [ ] Update Swagger configuration in [src/config/swagger.config.ts](../src/config/swagger.config.ts)
- [ ] Replace placeholder URLs with your actual domains
- [ ] Customize API title and description

### 4. Environment Variables

Create a [`.env`](../.env) file with your specific configuration to match the [`.env.example`](../.env.example) file.

### 5. Custom Code Structure

The template includes the following structure that you can customize:

```
src/
├── index.ts            # Application entry point
├── app.ts              # Express server configuration
├── config/             # Configuration files (logger, redis, swagger)
├── core/               # Core utilities and environment
├── database/           # Database schema and migrations
├── middlewares/        # Express middleware
├── modules/            # Feature modules (add your routes here)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### 6. Adding Your Features

1. **Add new routes**: Create modules in [src/modules/](../src/modules/)
2. **Database schema**: Define tables in [src/database/schema/](../src/database/schema/)
3. **Middleware**: Add custom middleware in [src/middlewares/](../src/middlewares/)
4. **Types**: Define TypeScript types in [src/types/](../src/types/)

### 7. Final Steps

- [ ] Uncomment line 7 in the husky files in the [`.husky/pre-commit`](../.husky/pre-commit) directory
- [ ] Uncomment line 4 in the husky files in the [`.husky/pre-push`](../.husky/pre-push) directory
- [ ] Update [README.md](../README.md) with your project-specific information
- [ ] Delete this [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md) file
- [ ] Initialize git repository if starting fresh
- [ ] Set up CI/CD pipelines as needed
- [ ] Configure production environment variables

## 🚀 Ready to Go!

Your Express template is now ready for development. Start by:

1. Installing dependencies: `bun install`
2. Starting Docker services: `docker compose up -d`
3. Running the development server: `bun run dev:bun`

Happy coding! 🎉
