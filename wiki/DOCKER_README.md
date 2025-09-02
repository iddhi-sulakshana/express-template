# Docker Setup Guide

This guide explains how to set up and run the Express Template server using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- At least 2GB of available RAM
- At least 5GB of available disk space

## Services

The Docker Compose setup includes the following services:

### 1. Backend Service (backend-bun)

- **Image**: Custom build from `Dockerfile.bun`
- **Port**: `3000` (mapped to container port `3000`)
- **Package Manager**: Bun with native TypeScript support
- **Hot Reload**: Built-in watch mode for instant code changes
- **Performance**: Faster startup and execution
- **Volume Mounting**: Source code mounted for live development

**Note**: You can easily switch to pnpm by uncommenting the `dockerfile: Dockerfile.pnpm` line and commenting out `dockerfile: Dockerfile.bun` in the docker-compose.yml file.

### 2. PostgreSQL Database (dev-db)

- **Image**: `postgis/postgis:13-3.1`
- **Port**: `5434` (mapped to container port `5432`)
- **Database**: `express-template-local`
- **Username**: `postgres`
- **Password**: `12345`
- **Data Persistence**: Yes (named volume)

### 3. Redis Cache (redis)

- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Data Persistence**: Yes (AOF enabled)
- **Restart Policy**: Unless stopped

## Quick Start

### 1. Start All Services

```bash
# Start all services (backend + databases)
docker-compose up -d

# Or start with logs visible
docker-compose up
```

### 2. Start Specific Services

```bash
# Start only backend + dependencies
docker-compose up -d backend-bun dev-db redis

# Start only databases (if you want to run backend locally)
docker-compose up -d dev-db redis
```

### 2. Verify Services Are Running

```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs redis
docker-compose logs dev-db
```

### 3. Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

### 4. Using the Server Script (Recommended)

We provide a convenient `server.sh` script for easy management:

```bash
# Make the script executable (first time only)
chmod +x server.sh

# Start everything
./server.sh start

# Start only databases
./server.sh start-db

# Check status
./server.sh status

# View logs
./server.sh logs

# Switch package managers
./server.sh switch-pnpm
./server.sh switch-bun
```

### Database Migrations

We provide a convenient `migration.sh` script for easy database management:

```bash
# Make the script executable (first time only)
chmod +x migration.sh

# Generate migration files in container
./migration.sh generate-container

# Run migrations in container
./migration.sh migrate-container

# Show usage information
./migration.sh
```

**Features:**

- **Container Support**: Run migrations inside Docker containers
- **Package Manager Detection**: Automatically detects and uses available package managers
- **Colored Output**: Clear status messages with color coding
- **Error Handling**: Proper error handling and exit codes

## Service Management

### Individual Service Control

```bash
# Start only specific service
docker-compose up -d redis
docker-compose up -d backend-bun

# Stop only specific service
docker-compose stop dev-db
docker-compose stop backend-bun

# Restart specific service
docker-compose restart redis
docker-compose restart backend-bun
```

### Backend Management

```bash
# Build backend
docker-compose build backend-bun

# View backend logs
docker-compose logs -f backend-bun

# Access backend shell
docker-compose exec backend-bun sh
```

### Viewing Logs

```bash
# Follow logs in real-time
docker-compose logs -f

# Follow logs for specific service
docker-compose logs -f redis
```

## Data Persistence

### Volumes

- **postgres_data**: PostgreSQL database files
- **redis_data**: Redis AOF and RDB files

### Backup and Restore

```bash
# Backup PostgreSQL data
docker exec express-template-dev-db-1 pg_dump -U postgres express-template-local > backup.sql

# Restore PostgreSQL data
docker exec -i express-template-dev-db-1 psql -U postgres express-template-local < backup.sql

# Backup Redis data (data is already persisted via AOF)
docker exec express-template-redis-1 redis-cli BGSAVE
```

## Environment Variables

The services use the following environment variables:

### PostgreSQL

- `POSTGRES_USER`: postgres
- `POSTGRES_PASSWORD`: 12345
- `POSTGRES_DB`: express-template-local

### Redis

- Uses default Redis configuration with AOF enabled

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using the ports
sudo lsof -i :5434
sudo lsof -i :6379

# Kill processes using the ports
sudo kill -9 <PID>
```

#### 2. Permission Issues

```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./volumes/
```

#### 3. Service Won't Start

```bash
# Check service logs
docker-compose logs <service-name>

# Check Docker daemon
docker system info

# Restart Docker daemon (if needed)
sudo systemctl restart docker
```

#### 4. Migration Script Issues

**Error**: `./migration.sh: Permission denied`

**Solution**: Make the script executable:

```bash
chmod +x migration.sh
```

**Error**: `./migration.sh: not found`

**Solution**: Check for line ending issues:

```bash
# Convert Windows line endings to Unix
dos2unix migration.sh

# Verify script syntax
bash -n migration.sh
```

### Reset Everything

```bash
# Stop all services and remove everything
docker-compose down -v --remove-orphans

# Remove all containers and images
docker system prune -a

# Start fresh
docker-compose up -d
```

## Hot Reload & Development

### Backend Hot Reload

The backend service supports hot reload for seamless development:

- **Bun Backend**: Uses native `--watch` mode for instant TypeScript compilation and reloading
- **Volume Mounting**: Source code is mounted as volumes, so changes are reflected immediately
- **No Rebuilds**: Code changes don't require container restarts

### Switching Package Managers

You can easily switch between Bun and pnpm using the server script:

```bash
# Switch to pnpm
./server.sh switch-pnpm

# Switch back to Bun
./server.sh switch-bun
```

**Manual Method**: You can also edit the `docker-compose.yml` file directly:

```yaml
# For Bun (default)
dockerfile: Dockerfile.bun
# For pnpm (uncomment this line and comment out the Bun line)
# dockerfile: Dockerfile.pnpm
```

**Note**: After manually changing the dockerfile, rebuild the container:

```bash
docker-compose build backend-bun
docker-compose up -d backend-bun
```

## Development Workflow

### 1. First Time Setup

```bash
# Clone repository and navigate to project
cd express-template

# Start all services (backend + databases)
docker-compose up -d

# Wait for services to be ready (check logs)
docker-compose logs -f backend-bun
```

### 2. Daily Development

```bash
# Start services
docker-compose up -d

# Work on your code...

# Stop services when done
docker-compose down
```

### 3. Service Updates

```bash
# Pull latest images
docker-compose pull

# Restart services with new images
docker-compose up -d
```

## Monitoring

### Resource Usage

```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

### Health Checks

```bash
# Check PostgreSQL connection
docker exec express-template-dev-db-1 pg_isready -U postgres

# Check Redis connection
docker exec express-template-redis-1 redis-cli ping
```

## Production Considerations

⚠️ **Warning**: This setup is for development only!

For production:

- Change default passwords
- Use environment variables for sensitive data
- Enable SSL/TLS
- Configure proper backup strategies
- Use production-grade Redis and PostgreSQL configurations
- Implement proper monitoring and logging

## Useful Commands Reference

```bash
# Service management
docker-compose up -d          # Start all services
docker-compose up -d backend-bun dev-db redis    # Start backend + databases
docker-compose down           # Stop services
docker-compose restart        # Restart all services
docker-compose ps            # Show service status

# Backend management
docker-compose build backend-bun    # Build backend
docker-compose logs -f backend-bun  # Follow backend logs

# Logs
docker-compose logs          # Show all logs
docker-compose logs -f       # Follow logs
docker-compose logs <service> # Show specific service logs

# Shell access
docker-compose exec backend-bun sh   # Access backend container
docker-compose exec dev-db psql -U postgres -d express-template-local
docker-compose exec redis redis-cli

# Cleanup
docker-compose down -v       # Remove volumes
docker system prune          # Clean unused resources
```

### 🚀 Migration Script Commands

```bash
# Make executable (first time only)
chmod +x migration.sh

# Container operations
./migration.sh generate-container # Generate migrations in container
./migration.sh migrate-container  # Run migrations in container

# Help
./migration.sh                   # Show usage information
```

### Server Script Commands (Recommended)

```bash
# Basic operations
./server.sh start            # Start all services
./server.sh start-db         # Start only databases
./server.sh stop             # Stop all services
./server.sh status           # Show service status

# Package manager switching
./server.sh switch-pnpm      # Switch to pnpm
./server.sh switch-bun       # Switch to Bun

# Development
./server.sh logs             # View backend logs
./server.sh build            # Rebuild backend
./server.sh clean            # Clean up everything
```

## Dockerfiles

The project includes two specialized Dockerfiles:

- **`Dockerfile.bun`**: Optimized for Bun runtime with native TypeScript support (default)
- **`Dockerfile.pnpm`**: Optimized for pnpm with tsx TypeScript execution (alternative)

Both Dockerfiles include:

- Hot reload capabilities
- Volume mounting for development
- System dependencies for native modules
- Alpine Linux base for smaller image sizes

**Note**: The default setup uses Bun. To switch to pnpm, edit the `docker-compose.yml` file and uncomment the pnpm dockerfile line.

## Support

If you encounter issues:

1. **Try the migration script first**: `./migration.sh generate-container` or `./migration.sh migrate-container`
2. Check the logs: `docker-compose logs`
3. Verify Docker is running: `docker system info`
4. Check port availability
5. Ensure sufficient disk space and memory
6. Review this troubleshooting section

---

**Last Updated**: January 2025  
**Docker Version**: 20.10+  
**Docker Compose**: 2.0+  
**Migration Script**: Available (`./migration.sh`)
