# Express Template

A modern Node.js Express server template built with TypeScript, designed to work with both Bun and pnpm package managers.

## 🎯 Template Features

This Express template includes:

- **TypeScript** - Full TypeScript support with proper configuration
- **Express.js** - Modern Express setup with middleware
- **Database** - PostgreSQL with Drizzle ORM and PostGIS support
- **Redis** - Redis caching support with ioredis
- **Authentication** - JWT authentication with Argon2 password hashing
- **API Documentation** - Swagger/OpenAPI documentation
- **Docker Support** - Full Docker and Docker Compose setup
- **Package Manager Flexibility** - Works with both Bun and pnpm
- **Hot Reload** - Development server with hot reload
- **Logging** - Winston logger with proper configuration
- **Environment Management** - Safe environment variable handling
- **Database Migrations** - Drizzle migrations with helper scripts
- **Validation** - Zod schema validation
- **File Upload** - Multer file upload support
- **CORS** - Configured CORS support

## 🚀 Getting Started with This Template

### 1. Clone or Download the Template

```bash
# Clone this repository
git clone <your-repo-url> your-project-name
cd your-project-name

# Remove git history to start fresh (optional)
rm -rf .git
git init
```

### 2. Customize for Your Project

- Update `package.json` with your project name and details
- Update environment variables in docker-compose.yml
- Customize the database name in docker-compose.yml and wiki documentation
- Update API documentation in `src/config/swagger.config.ts`
- Replace this README with your project-specific documentation

## 🚀 Quick Start

### Prerequisites

- **Node.js 22** (Latest LTS) - We use `fnm` to manage Node.js versions
- **pnpm** or **Bun** package manager

### 1. Install fnm (Fast Node Manager)

```bash
# Install fnm
curl -fsSL https://fnm.vercel.app/install | bash

# Reload your shell configuration
source ~/.zshrc  # or source ~/.bashrc for bash users
```

### 2. Install and Use Node.js 22

```bash
# Install Node.js 22 (Latest LTS)
fnm install 22

# Use Node.js 22 for this project
fnm use 22

# Verify the version
node --version  # Should show v22.18.0+
```

### 3. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using Bun
bun install
```

### 4. Docker Setup (Required)

Before running the development server, you need to start the required services (PostgreSQL and Redis) using Docker:

```bash
# Start PostgreSQL and Redis services
docker-compose up -d

# Verify services are running
docker-compose ps

# View service logs
docker-compose logs -f
```

**Services:**

- **PostgreSQL**: Available at `localhost:5434` (Database: `express-template-local`)
- **Redis**: Available at `localhost:6379`

For detailed Docker setup instructions, see [Docker Setup Guide](./wiki/DOCKER_README.md).

### 5. Run Backend with Docker (Alternative)

You can also run the entire backend (including the Node.js server) using Docker with hot reload:

```bash
# Start backend + databases with Docker
docker-compose up -d

# View backend logs
docker-compose logs -f backend-bun

# Stop all services
docker-compose down
```

**Docker Backend Features:**

- **Hot Reload**: Code changes automatically restart the server
- **Port**: Available at `localhost:3000`
- **Package Manager**: Uses Bun by default (can switch to pnpm)
- **Volume Mounting**: Source code changes are reflected immediately

**Easy Package Manager Switching**: Use the provided `server.sh` script:

```bash
# Make executable (first time only)
chmod +x server.sh

# Switch to pnpm
./server.sh switch-pnpm

# Switch back to Bun
./server.sh switch-bun

# Check current status
./server.sh status
```

**Note**: The Docker backend uses Bun by default. You can switch package managers using the script or manually edit `docker-compose.yml`.

### 6. Database Setup

After starting the Docker services, you need to set up the database:

```bash
# Generate database schema (if you've made changes to entities)
pnpm run db:generate
# or
bun run db:generate

# Push schema changes to database
pnpm run db:push
# or
bun run db:push

# Run existing migrations (if any)
pnpm run db:migrate
# or
bun run db:migrate
```

**Database Commands:**

- `db:generate` - Generate migration files from schema changes
- `db:push` - Push schema changes directly to database
- `db:migrate` - Run existing migration files
- `db:studio` - Open Drizzle Studio for database management

For detailed database instructions, see [Migration Guide](./wiki/MIGRATION_GUIDE.md).

### 7. Development

```bash
# Build the project
pnpm build
# or
bun run build

# Start development server
pnpm dev        # Uses tsx for pnpm
bun run dev:bun # Uses Bun's watch mode

# Start production server
pnpm start
# or
bun run start
```

**Note**: When you're done developing, you can stop the Docker services:

```bash
docker-compose down
```

## 🐳 Docker Support

### Quick Docker Commands

```bash
# Start everything (backend + databases)
docker-compose up -d

# Start only databases (run backend locally)
docker-compose up -d dev-db redis

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild backend
docker-compose build backend-bun
```

### Using the Server Script (Recommended)

For easier management, use the `server.sh` script:

```bash
# Make executable (first time only)
chmod +x server.sh

# Start everything
./server.sh start

# Start only databases
./server.sh start-db

# Switch package managers
./server.sh switch-pnpm
./server.sh switch-bun

# Check status
./server.sh status

# View logs
./server.sh logs
```

### Docker Features

- **Hot Reload**: Code changes automatically restart the server
- **Package Manager**: Bun by default, easy to switch to pnpm
- **Volume Mounting**: Source code changes are reflected immediately
- **Database Services**: PostgreSQL and Redis included

For detailed Docker instructions, see [Docker Setup Guide](./wiki/DOCKER_README.md).

## 📦 Package Manager Compatibility

This project is designed to work with both **pnpm** and **Bun** without requiring each other:

- **pnpm**: Uses `tsx` for TypeScript execution
- **Bun**: Uses Bun's built-in TypeScript support
- **Build**: Uses `tsc` (TypeScript compiler) for both

## 🔧 Node.js Version Management

### Automatic Version Switching

The project includes a `.nvmrc` file that automatically switches to Node.js 22 when you enter the directory:

```bash
# When you cd into the project directory
cd express-template
fnm use  # Automatically uses Node.js 22
```

### Manual Version Switching

```bash
# Switch to Node.js 22
fnm use 22

# Switch to Node.js 20
fnm use 20

# List installed versions
fnm list

# Set default version
fnm default 22
```

## 🏗️ Project Structure

```
express-template/
├── src/              # TypeScript source files
├── dist/             # Compiled JavaScript output
├── environment.d.ts  # Environment variable types
├── tsconfig.json     # TypeScript configuration
├── package.json      # Project dependencies and scripts
├── .nvmrc           # Node.js version specification
├── migration.sh      # Database migration script
├── server.sh         # Docker server management script
└── README.md        # This file
```

## 📝 Available Scripts

| Script        | Description                        | Package Manager |
| ------------- | ---------------------------------- | --------------- |
| `build`       | Compile TypeScript to JavaScript   | Both            |
| `dev`         | Development server with hot reload | pnpm (tsx)      |
| `dev:bun`     | Development server with Bun watch  | Bun             |
| `db:generate` | Generate database migrations       | Both            |
| `db:push`     | Push schema changes to database    | Both            |
| `db:migrate`  | Run database migrations            | Both            |
| `db:studio`   | Open Drizzle Studio                | Both            |
| `start`       | Start production server            | Both            |

## 🗄️ Migration Script

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

## 🔍 Troubleshooting

### fnm not found

```bash
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"
```

### Wrong Node.js version

```bash
fnm use 22
node --version  # Should show v22.18.0+
```

### Build issues

```bash
# Clean and rebuild
rm -rf dist/
pnpm build
```

### Migration script issues

```bash
# Make script executable
chmod +x migration.sh

# Check script syntax
bash -n migration.sh

# Convert line endings (if on Windows)
dos2unix migration.sh
```

## 📚 Additional Resources

- [fnm Documentation](https://github.com/Schniz/fnm)
- [Node.js 22 Features](https://nodejs.org/en/blog/release/v22.0.0/)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [pnpm vs Bun](https://bun.sh/docs/cli/install#package-manager-comparison)

## 🤝 Contributing

1. Ensure you're using Node.js 22 (`fnm use 22`)
2. Install dependencies (`pnpm install`)
3. Make your changes
4. Build the project (`pnpm build`)
5. Test your changes

---

**Note**: This project is configured to automatically use Node.js 22 via the `.nvmrc` file. Make sure you have fnm installed and the correct Node.js version active before development.
