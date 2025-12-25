# Docker Startup Guide

This guide covers running the entire Alagist Server stack using Docker, including the backend service running in a container.

## 🚀 Quick Start Overview

1. **Start All Services** (Backend + PostgreSQL + Redis)
2. **Configure Environment Variables**
3. **Run Database Migrations**
4. **Seed Database** (Optional)
5. **Access Services**

---

## Step 1: Start All Services

Start the complete stack including the backend service running in Docker.

```bash
# Navigate to the project root directory
cd alagist-server

# Make scripts executable (first time only)
chmod +x scripts/server.sh scripts/migration.sh

# Start all services (backend + databases)
./scripts/server.sh start

# Check status of all services
./scripts/server.sh status
```

**Available Server Script Commands:**

- `./scripts/server.sh start` - Start all services (backend + databases)
- `./scripts/server.sh start-db` - Start only database services
- `./scripts/server.sh stop` - Stop all services
- `./scripts/server.sh restart` - Restart all services
- `./scripts/server.sh status` - Show status of all services
- `./scripts/server.sh logs` - Show service logs
- `./scripts/server.sh build` - Build the backend service
- `./scripts/server.sh clean` - Clean up containers and volumes

**Expected Output:**

```
[INFO] Starting all services (backend + databases)...
[SUCCESS] All services started
[INFO] Backend: http://localhost:3000
[INFO] PostgreSQL: localhost:5434
[INFO] Redis: localhost:6379
```

**Verify Services:**

```bash
# Check service status
./scripts/server.sh status

# View service logs
./scripts/server.sh logs
```

---

## Step 2: Configure Environment Variables

Set up your environment configuration file for Docker services.

```bash
# Check if .env file exists
ls -la .env

# If .env doesn't exist, copy from example
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

**Note:**

- The database host is `postgres` and Redis host is `redis` (Docker service names) instead of `localhost`
- Docker Compose automatically loads variables from `.env` file
- Environment variables in `.env` will override the hardcoded values in `docker-compose.yml`

## Step 3: Run Database Migrations

Set up your database schema and run migrations using the project's migration script.

```bash
# Generate migration files (if schema changes exist)
./scripts/migration.sh generate-container

# Run database migrations in container
./scripts/migration.sh migrate-container
```

**Available Migration Script Commands:**

- `./scripts/migration.sh generate` - Creates migration files from schema changes (local)
- `./scripts/migration.sh migrate` - Applies pending migrations to database (local)
- `./scripts/migration.sh generate-container` - Generate migrations in Docker container
- `./scripts/migration.sh migrate-container` - Run migrations in Docker container

**Other Database Commands:**

- `bun run db:studio` - Opens Drizzle Studio for database management (local)

---

## Step 4: Seed Database (Optional)

Populate the database with initial data.

```bash
# Run database seeding script in container
docker-compose exec backend bun run scripts/seed-categories.js
```

**Verify Seeding:**

```bash
# Check seeded data
docker-compose exec dev-db psql -U postgres -d alagist-local -c "SELECT COUNT(*) FROM business_categories;"
```

---

## Step 5: Access Services

Once all services are running, you can access the application.

**Service URLs:**

- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/v1/health
- **PostgreSQL**: localhost:5434
- **Redis**: localhost:6379

**Expected Backend Output:**

```
🚧 Node running as Development Environment 🚧
Environment Variables Loaded: /app/.env
[INFO] : Redis connection established ✅
[INFO] : Server listening on: http://localhost:3000
[INFO] : Swagger UI: http://localhost:3000/api-docs
[INFO] : API endpoint: http://localhost:3000/api/v1
[INFO] : Database connected successfully ✅
```

---

## 🎯 Verification Checklist

Verify everything is working correctly:

### 1. Services Status

```bash
# Check Docker services using server script
./scripts/server.sh status

# Check if ports are listening
netstat -tulpn | grep -E ':(3000|5434|6379)'
```

### 2. API Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/api/v1/health

# Test Swagger documentation
curl http://localhost:3000/api-docs
```

### 3. Backend Logs

```bash
# View backend logs
./scripts/server.sh logs

# Or view specific service logs
docker-compose logs -f backend
```

---

## 🔧 Development Workflow

### Daily Development

```bash
# Start all services
./scripts/server.sh start

# View logs to monitor
./scripts/server.sh logs
```

### Making Changes

1. Edit your code in the `src/` directory
2. The Docker backend will automatically restart on file changes (hot reload)
3. Check the logs for any errors: `./scripts/server.sh logs`

### Database Changes

```bash
# After modifying database entities
./scripts/migration.sh generate-container
./scripts/migration.sh migrate-container
```

### Rebuilding Backend

```bash
# Rebuild the backend service after dependency changes
./scripts/server.sh stop

# Restart services
./scripts/server.sh start
```

### Stopping Services

```bash
# Stop all services
./scripts/server.sh stop

# Or stop and clean up everything
./scripts/server.sh clean
```

---

## 🐳 Docker-Specific Features

### Hot Reload

- Code changes in `src/` directory automatically restart the backend
- Volume mounting ensures changes are reflected immediately
- No need to rebuild the container for code changes

### Volume Mounting

- Source code: `../src:/app/src`
- Node modules: `/app/node_modules` (excluded from volume)
- Bun cache: `/app/.bun` (excluded from volume)

### Environment Variables

- Docker Compose automatically loads variables from `.env` file in project root
- Database and Redis use Docker service names for networking
- All environment variables are available in the container

### Networking

- Backend can access databases using service names
- External access through mapped ports
- Internal Docker network for service communication

---

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Backend Service Failed to Start

```bash
# Check backend logs
docker-compose logs backend

# Rebuild backend service
./scripts/server.sh build

# Restart services
./scripts/server.sh restart
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
./scripts/server.sh start
./scripts/migration.sh migrate-container
```

### Environment Variables Not Loading

```bash
# Check .env file exists and has correct format
cat .env

# Verify Docker service names in DATABASE_URL and REDIS_URL
# Should use: postgres, redis (not localhost)

# Check if Docker Compose is reading .env file
docker-compose config

# Verify environment variables in running container
docker-compose exec backend env | grep -E "(DATABASE_URL|REDIS_URL|JWT_SECRET)"

# Test environment variable substitution
docker-compose config | grep -A 10 "environment:"
```

### Container Build Issues

```bash
# Clean build cache
docker system prune -f

# Rebuild backend service
./scripts/server.sh build

# Check build logs
docker-compose build backend
```

---

## 🔄 Switching Between Local and Docker Development

### From Docker to Local Development

```bash
# Stop Docker backend
./scripts/server.sh stop

# Start only databases
./scripts/server.sh start-db

# Update .env for local development
# Change DATABASE_URL to: postgresql://postgres:12345@localhost:5434/alagist-local
# Change REDIS_URL to: redis://localhost:6379

# Run backend locally
bun run dev
```

### From Local to Docker Development

```bash
# Stop local backend
Ctrl + C

# Update .env for Docker development
# Change DATABASE_URL to: postgresql://postgres:12345@postgres:5432/alagist-local
# Change REDIS_URL to: redis://redis:6379

# Start all services
./scripts/server.sh start
```

---

## 📚 Next Steps

Once your Docker environment is running:

1. **Explore the API**: Visit http://localhost:3000/api-docs
2. **Check Database**: Use `bun run db:studio` to explore your data
3. **Monitor Logs**: Use `./scripts/server.sh logs` to monitor services
4. **Read Documentation**: Review [Database Schema](./DATABASE_SCHEMA.md)
5. **Start Coding**: Begin development in the `src/modules/` directory

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Requirements](./REQUIREMENTS.md) document
2. Review [Docker Setup](./DOCKER_README.md) for detailed Docker configuration
3. Check the troubleshooting section above
4. Verify all services are running with `./scripts/server.sh status`
5. Check service logs with `./scripts/server.sh logs`

**Happy Docker Development! 🐳🚀**
