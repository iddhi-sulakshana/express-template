# Database Migration Guide

This guide explains how to apply and manage database migrations in the Alagist Server project using Drizzle ORM.

## Overview

The project uses **Drizzle ORM** with **PostgreSQL** and **PostGIS** extension for handling database schema and migrations. All migration files are located in `src/database/migrations/`.

## Prerequisites

1. **PostgreSQL Database** with PostGIS extension support
2. **Environment Variables** configured (see Environment Setup section)
3. **Dependencies** installed (`pnpm install`)

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### For Local Development

Using the provided Docker Compose setup (with PostGIS support):

```env
DATABASE_URL=postgresql://postgres:12345@localhost:5434/alagist-local
```

**Important**: The Docker Compose uses `postgis/postgis:13-3.1` image which includes PostGIS extension.

### Key Features

- **PostGIS Integration** - Spatial data support for location-based features
- **User Types** - Multi-role system with proper constraints
- **Secure Authentication** - Token-based auth with device tracking
- **Data Integrity** - Proper foreign key relationships and unique constraints

## Migration Commands

### 🚀 Easy Mode: Migration Script

We provide a convenient `migration.sh` script for easy database management:

```bash
# Make the script executable (first time only)
chmod +x migration.sh

# Generate migration files locally
./migration.sh generate

# Run migrations locally
./migration.sh migrate

# Generate migration files in container
./migration.sh generate-container

# Run migrations in container
./migration.sh migrate-container

# Show usage information
./migration.sh
```

**Features:**

- **Local & Container Support**: Run migrations on your machine or in Docker containers
- **Package Manager Detection**: Automatically detects and uses available package managers
- **Colored Output**: Clear status messages with color coding
- **Error Handling**: Proper error handling and exit codes

### 📋 Manual Mode: Traditional Commands

If you prefer to run commands manually or need more control:

#### 1. Start Database (Development)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres
```

### 2. Generate New Migration

When you modify the schema in `src/database/schema/schema.ts`:

```bash
# Generate migration files based on schema changes
pnpm run db:generate
```

This will:

- Compare current schema with database state
- Generate SQL migration files in `src/database/migrations/`
- Update the migration journal in `meta/_journal.json`

### 3. Apply Migrations

```bash
# Apply all pending migrations to the database
pnpm run db:migrate
```

This will:

- Execute all pending SQL migration files
- Update the migration tracking table
- Ensure database is in sync with schema

### 4. Push Schema (Development Only)

For rapid development iteration:

```bash
# Push schema changes directly without generating migration files
pnpm run db:push
```

⚠️ **Warning**: This bypasses migration files and should only be used in development.

### 5. Database Studio

```bash
# Open Drizzle Studio for database exploration
pnpm run db:studio
```

## Current Migration Status

The project currently has two migrations:

- **0000_medical_lady_vermin.sql** - Initial migration that enables PostGIS extension
- **0001_aberrant_cannonball.sql** - Main schema migration with all tables and relationships

### Migration 0000: PostGIS Extension

```sql
-- Custom SQL migration file, put your code below! --
CREATE EXTENSION postgis;
```

### Migration 0001: Database Schema

Contains all the main database tables:

- User management tables (users, user_details, user_locations)
- Authentication tables (tokens, token_details, user_otps)
- PostGIS spatial support for location data
- Proper foreign key relationships and constraints

## Migration Workflow

### For Schema Changes

1. **Modify Schema**: Update `src/database/schema/schema.ts`
2. **Generate Migration**: Run `pnpm run db:generate`
3. **Review Migration**: Check generated SQL in `src/database/migrations/`
4. **Apply Migration**: Run `pnpm run db:migrate`
5. **Test**: Verify changes work as expected

### For Custom SQL

If you need custom SQL (like extensions, functions, triggers):

1. **Generate Base Migration**: Run `pnpm run db:generate`
2. **Edit Migration File**: Add custom SQL to the generated file
3. **Apply Migration**: Run `pnpm run db:migrate`

## Production Deployment

### Pre-deployment Checklist

1. ✅ All migrations tested in staging environment
2. ✅ Database backup created
3. ✅ Migration rollback plan prepared
4. ✅ Environment variables configured

### Deployment Steps

1. **Stop Application** (to prevent concurrent writes)
2. **Backup Database**
   ```bash
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   ```
3. **Apply Migrations**
   ```bash
   pnpm run db:migrate
   ```
4. **Verify Migration Success**
   ```bash
   # Check migration journal
   # Verify schema changes
   # Run application health checks
   ```
5. **Start Application**

## Troubleshooting

### Common Issues

#### Migration Fails

```bash
# Check database connection
pnpm run dev
# Look for database connection logs
```

#### Schema Drift

If database schema doesn't match your code:

```bash
# Generate migration to sync
pnpm run db:generate

# Or push directly (development only)
pnpm run db:push
```

#### PostGIS Extension Missing

**Error**: `could not open extension control file "/usr/share/postgresql/13/extension/postgis.control"`

**Solution**: Use a PostgreSQL image that includes PostGIS:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgis/postgis:13-3.1 # ← Use PostGIS image, not postgres:13
    # ... rest of config
```

Then restart your database:

```bash
docker-compose down
docker-compose up -d postgres
```

**Check PostGIS availability**:

```sql
-- Check if PostGIS is available
SELECT * FROM pg_available_extensions WHERE name = 'postgis';

-- Install PostGIS (requires superuser)
CREATE EXTENSION postgis;
```

#### Connection Issues

Verify your `DATABASE_URL` format:

```
postgresql://username:password@host:port/database_name
```

### Migration Journal

The migration state is tracked in `src/database/migrations/meta/_journal.json`:

```json
{
  "version": "7",
  "dialect": "postgresql",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 1755366154769,
      "tag": "0000_medical_lady_vermin",
      "breakpoints": true
    },
    {
      "idx": 1,
      "version": "7",
      "when": 1755366890391,
      "tag": "0001_aberrant_cannonball",
      "breakpoints": true
    }
  ]
}
```

## Best Practices

### Schema Design

1. **Use Proper Types**: Leverage PostgreSQL-specific types (UUID, ENUM, etc.)
2. **Add Constraints**: Use unique constraints and foreign keys for data integrity
3. **Index Strategically**: Add indexes for frequently queried columns
4. **Spatial Data**: Use PostGIS for location-based features

### Migration Management

1. **Never Edit Applied Migrations**: Once a migration is applied, don't modify it
2. **Test Migrations**: Always test in development/staging first
3. **Backup Before Migration**: Especially in production
4. **Small Incremental Changes**: Prefer smaller, focused migrations
5. **Descriptive Names**: Use meaningful migration names (auto-generated by Drizzle)

### Development Workflow

1. **Feature Branches**: Create migrations in feature branches
2. **Review Process**: Have database changes reviewed by team
3. **Integration Testing**: Test migrations with application code
4. **Documentation**: Update this guide when adding new patterns

## Configuration Files

### Drizzle Config (`drizzle.config.ts`)

```typescript
export default defineConfig({
  schema: './src/database/schema/*', // Schema location
  out: './src/database/migrations', // Migration output
  dialect: 'postgresql', // Database type
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Connection string
  },
  verbose: true, // Detailed logging
  strict: true, // Strict mode
});
```

### Database Config (`src/config/database.config.ts`)

```typescript
// Drizzle instance for application use
export const db = drizzle(client);

// Raw client for migrations
export { client };
```

## Useful Commands Reference

### 🚀 Migration Script Commands (Recommended)

```bash
# Make executable (first time only)
chmod +x migration.sh

# Local operations
./migration.sh generate          # Generate migration files locally
./migration.sh migrate           # Run migrations locally

# Container operations
./migration.sh generate-container # Generate migration files in container
./migration.sh migrate-container  # Run migrations in container

# Help
./migration.sh                   # Show usage information
```

### 🔧 Manual Commands

```bash
# Database Management
docker-compose up -d postgres           # Start local database
docker-compose down                   # Stop local database

# Migration Commands
pnpm run db:generate                  # Generate migration from schema
pnpm run db:migrate                   # Apply pending migrations
pnpm run db:push                      # Push schema (dev only)
pnpm run db:studio                    # Open database GUI

# Application Commands
pnpm run dev                          # Start development server
pnpm run build                        # Build for production
pnpm run start                        # Start production server
```

## Support

If you encounter issues with migrations:

1. Check the application logs for database connection errors
2. Verify your environment variables are correct
3. Ensure PostgreSQL is running and accessible
4. Review the migration files for syntax errors
5. Check the Drizzle ORM documentation for advanced usage

---

**Last Updated**: January 2025  
**Drizzle Version**: 0.31.4  
**PostgreSQL Version**: 13+  
**PostGIS Required**: Yes
