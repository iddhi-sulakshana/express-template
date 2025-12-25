# Requirements & Prerequisites

This document outlines all the software and tools required to run the Server project.

## 📋 System Requirements

### Operating System

- **Linux** (Ubuntu 20.04+, CentOS 8+, or similar)
- **macOS** (10.15+)
- **Windows** (10/11 with WSL2 recommended)

### Hardware

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **CPU**: 2+ cores recommended

## 🛠️ Required Software

### 1. Bun Runtime & Package Manager

Bun is the primary runtime and package manager for this project.

#### Installation

**Linux/macOS:**

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload your shell
source ~/.bashrc  # or ~/.zshrc

# Verify installation
bun --version
```

**Windows (PowerShell):**

```powershell
# Install Bun
irm bun.sh/install.ps1 | iex

# Verify installation
bun --version
```

**Alternative: Using npm (if you have Node.js):**

```bash
npm install -g bun
```

#### Verification

```bash
bun --version  # Should show 1.2.0 or higher
```

### 2. Docker & Docker Compose

Docker is required for running PostgreSQL and Redis services.

#### Installation

**Ubuntu/Debian:**

```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io docker compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, for non-sudo usage)
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect
```

**macOS:**

```bash
# Install using Homebrew
brew install docker docker compose

# Or download Docker Desktop from: https://www.docker.com/products/docker-desktop
```

**Windows:**

- Download Docker Desktop from: https://www.docker.com/products/docker-desktop
- Install and restart your computer
- Enable WSL2 integration if using WSL

#### Verification

```bash
docker --version        # Should show Docker version 20.10+
docker compose --version # Should show docker compose version 1.29+
```

### 3. Git

Git is required for version control and cloning the repository.

#### Installation

**Ubuntu/Debian:**

```bash
sudo apt install git
```

**CentOS/RHEL:**

```bash
sudo yum install git
```

**macOS:**

```bash
brew install git
# Or install Xcode Command Line Tools: xcode-select --install
```

**Windows:**

- Download from: https://git-scm.com/download/win

#### Verification

```bash
git --version  # Should show Git version 2.20+
```

## 🔧 Optional Tools

### 1. Code Editor

**Recommended:**

- [Cursor](https://cursor.so) (AI-powered code editor)
- [VS Code](https://code.visualstudio.com/)

### 2. Terminal

**Recommended:**

- **Bash** (default on most Linux/macOS systems)
- **Git Bash** (for Windows: [Download here](https://gitforwindows.org/))

> Using Bash or Git Bash is recommended for running project scripts and commands, especially on Windows, to ensure compatibility with provided instructions.

### 3. Database Management

**Optional GUI tools:**

- **RedisInsight** (Redis management)
- **DBeaver** (Universal database tool)

## 🐳 Docker Services

The project uses the following Docker services:

> **Note:** Please ensure the following ports are free and not used by other applications, as they are required for the services to run:
>
> - **5432**: PostgreSQL with PostGIS
> - **6379**: Redis
> - **3000**: Backend server

### PostgreSQL with PostGIS

- **Image**: `postgres:17-alpine`
- **Port**: `5432` (mapped from container's 5432)
- **Database**: `system-local`
- **User**: `postgres`
- **Password**: `12345`

### Redis

- **Image**: `redis:7-alpine`
- **Port**: `6379`
- **Features**: Persistence enabled

## 🔍 Verification Checklist

Before starting development, ensure all requirements are met:

```bash
# Check Bun
bun --version

# Check Docker
docker --version
docker compose --version

# Check Git
git --version

# Test Docker daemon
docker run hello-world

# Check if ports are available
netstat -tulpn | grep -E ':(3000|5432|6379)'
```

## 🚨 Common Issues & Solutions

### Docker Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :5432
sudo lsof -i :6379

# Kill process if needed
sudo kill -9 <PID>
```

### Bun Not Found

```bash
# Add Bun to PATH
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Docker Service Not Running

```bash
# Start Docker service
sudo systemctl start docker

# Check status
sudo systemctl status docker
```

## 📚 Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)

## ✅ Next Steps

Once all requirements are installed:

1. Clone the repository
2. Follow the [Setup Guide](./STARTUP.md)
3. Start with [Docker Setup](./DOCKER_README.md)
4. Review [Database Schema](./DATABASE_SCHEMA.md)
5. Follow [Coding Best Practices](./CODING_BEST_PRACTICES.md)
