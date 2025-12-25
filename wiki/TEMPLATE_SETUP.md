# Express Template Setup Instructions

This document provides step-by-step instructions for converting this project into your own custom Express application.

## 📋 Setup Checklist

### 1. Project Renaming

- [ ] Rename the project directory from `express-template` to your desired project name
- [ ] Update `package.json` name field (already done: `express-template`)
- [ ] Update any remaining references in documentation

### 2. Database Configuration

- [ ] Update database name in `docker-compose.yml` (already updated to `express-template-local`)
- [ ] Update database URLs in environment variables
- [ ] Update database references in wiki documentation (already done)

### 3. API Documentation

- [ ] Update Swagger configuration in `src/config/swagger.config.ts` (already done)
- [ ] Replace placeholder URLs with your actual domains
- [ ] Customize API title and description

### 4. Environment Variables

Create a `.env` file with your specific configuration:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:12345@localhost:5434/your-db-name

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (generate your own secrets)
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# Add other environment variables as needed for your project
```

### 5. Custom Code Structure

The template includes the following structure that you can customize:

```
src/
├── app.ts              # Express app configuration
├── index.ts            # Application entry point
├── config/             # Configuration files (logger, redis, swagger)
├── core/               # Core utilities and environment
├── database/           # Database schema and migrations
├── middlewares/        # Express middleware
├── modules/            # Feature modules (add your routes here)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### 6. Adding Your Features

1. **Add new routes**: Create modules in `src/modules/`
2. **Database schema**: Define tables in `src/database/schema/`
3. **Middleware**: Add custom middleware in `src/middlewares/`
4. **Types**: Define TypeScript types in `src/types/`

### 7. Final Steps

- [ ] Update `README.md` with your project-specific information
- [ ] Delete this `TEMPLATE_SETUP.md` file
- [ ] Initialize git repository if starting fresh
- [ ] Set up CI/CD pipelines as needed
- [ ] Configure production environment variables

## 🚀 Ready to Go!

Your Express template is now ready for development. Start by:

1. Installing dependencies: `pnpm install` or `bun install`
2. Starting Docker services: `docker-compose up -d`
3. Running the development server: `pnpm dev` or `bun run dev:bun`

Happy coding! 🎉
