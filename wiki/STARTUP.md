# Startup Guide

This guide will walk you through the complete process of setting up and running the Alagist Server project from scratch.

## 🚀 Quick Start Overview

1. **Start Docker Services** (PostgreSQL + Redis)
2. **Configure Environment Variables**
3. **Install Dependencies**
4. **Run Database Migrations**
5. **Seed Database** (Optional)
6. **Start Development Server**

---

## Step 1: Start Docker Services

First, start the required database services using the project's server script.

```bash
# Navigate to the project root directory
cd alagist-server

# Make scripts executable (first time only)
chmod +x scripts/server.sh scripts/migration.sh

# Start only database services (PostgreSQL + Redis)
./scripts/server.sh start-db

# Check status of all services
./scripts/server.sh status
```

**Available Server Script Commands:**

- `./scripts/server.sh start-db` - Start only database services
- `./scripts/server.sh start` - Start all services (backend + databases)
- `./scripts/server.sh stop` - Stop all services
- `./scripts/server.sh restart` - Restart all services
- `./scripts/server.sh status` - Show status of all services
- `./scripts/server.sh logs` - Show service logs
- `./scripts/server.sh clean` - Clean up containers and volumes

**Expected Output:**

```
[INFO] Starting only database services...
[SUCCESS] Database services started
[INFO] PostgreSQL: localhost:5432
[INFO] Redis: localhost:6379
[INFO] Run your backend locally with: bun run dev
```

**Verify Services:**

```bash
# Check service status
./scripts/server.sh status

# View service logs if needed
./scripts/server.sh logs
```

---

## Step 2: Configure Environment Variables

Set up your environment configuration file.

```bash
# Check if .env file exists
ls -la .env

# If .env doesn't exist, copy from example
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

---

## Step 3: Install Dependencies

Install all project dependencies using Bun.

```bash
# Install dependencies
bun install
```

---

## Step 4: Run Database Migrations

Set up your database schema and run migrations using the project's migration script.

```bash
# Generate migration files (if schema changes exist)
./scripts/migration.sh generate

# Run database migrations
./scripts/migration.sh migrate

# Verify database setup
bun run db:studio
```

**Available Migration Script Commands:**

- `./scripts/migration.sh generate` - Creates migration files from schema changes
- `./scripts/migration.sh migrate` - Applies pending migrations to database
- `./scripts/migration.sh seed` - Applies pending migrations to database
- `./scripts/migration.sh generate-container` - Generate migrations in Docker container
- `./scripts/migration.sh migrate-container` - Run migrations in Docker container
- `./scripts/migration.sh seed-container` - Run migrations in Docker container

**Other Database Commands:**

- `bun run db:studio` - Opens Drizzle Studio for database management

---

## Step 5: Seed Database (Optional)

Populate the database with initial data.

```bash
# Run database seeding script
./scripts/migration.sh seed
```

**Verify Seeding:**

```bash
# Check seeded data
docker compose exec postgres psql -U postgres -d system-local -c "SELECT COUNT(*) FROM business_categories;"
```

---

## Step 6: Start Development Server

Launch the development server with hot reload.

```bash
# Start development server
bun run dev
```

**Expected Output:**

```
🚧 Node running as Development Environment 🚧
Environment Variables Loaded: /path/to/alagist-server/.env
[INFO] : Redis connection established ✅
[INFO] : Database connected successfully ✅
....
```

---

## 🎯 Verification Checklist

Verify everything is working correctly:

### 1. Services Status

```bash
# Check Docker services using server script
./scripts/server.sh status

# Check if ports are listening
netstat -tulpn | grep -E ':(3000|5432|6379)'
```

### 2. API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Test Swagger documentation
curl http://localhost:3000/swagger
```

---

## 🔧 Development Workflow

### Daily Development

```bash
# Start services (if not running)
./scripts/server.sh start-db

# Start development server
bun run dev
```

### Making Changes

1. Edit your code in the [src/](../src/) directory
2. The server will automatically restart on file changes
3. Check the console for any errors

### Database Changes

```bash
# After modifying database entities
./scripts/migration.sh generate
./scripts/migration.sh migrate
```

or

```bash
# After modifying database entities
./scripts/migration.sh generate-container
./scripts/migration.sh migrate-container

```

### Stopping Services

```bash
# Stop development server
Ctrl + C

# Stop Docker services
./scripts/server.sh stop
```

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# or

fuser -k 3000/tcp
```

### Database Connection Failed

```bash
# Check service status
./scripts/server.sh status

# Restart all services
./scripts/server.sh restart

# Check service logs
./scripts/server.sh logs
```

### Redis Connection Failed

```bash
# Check service status
./scripts/server.sh status

# Restart all services
./scripts/server.sh restart

# Check service logs
./scripts/server.sh logs
```

### Migration Errors

```bash
# Reset database (WARNING: This will delete all data)
./scripts/server.sh clean

# Restart services and run migrations
./scripts/server.sh start-db
./scripts/migration.sh migrate
```

### Environment Variables Not Loading

```bash
# Check .env file exists and has correct format
cat .env

# Verify no spaces around = sign
# Correct: DATABASE_URL=postgresql://...
# Wrong: DATABASE_URL = postgresql://...
```

---

## 📚 Next Steps

Once your development environment is running:

1. **Explore the API**: Visit http://localhost:3000/swagger
2. **Check Database**: Use `bun run db:studio` to explore your data
3. **Start Coding**: Begin development in the [src/modules/](../src/modules/) directory

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Requirements](./REQUIREMENTS.md) document
2. Review [Docker Setup](./DOCKER_README.md) for detailed Docker configuration
3. Check the troubleshooting section above
4. Verify all services are running with `docker compose ps`

**Happy Coding! 🚀**
