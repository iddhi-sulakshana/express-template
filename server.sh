#!/bin/sh

# Docker Development Script for Express Template
# Usage: ./server.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start            Start all services (backend + databases)"
    echo "  start-db         Start only database services"
    echo "  stop             Stop all services"
    echo "  restart          Restart all services"
    echo "  logs             Show backend logs"
    echo "  build            Build the backend service"
    echo "  status           Show status of all services"
    echo "  clean            Clean up containers and volumes"
    echo "  switch-pnpm      Switch to pnpm package manager"
    echo "  switch-bun       Switch to Bun package manager"
    echo ""
    echo "Examples:"
    echo "  $0 start            Start the backend service with databases"
    echo "  $0 start-db         Start only databases (run backend locally)"
    echo "  $0 logs             Show the backend service logs"
    echo "  $0 build            Rebuild the backend service"
    echo "  $0 status           Show the status of all services"
    echo "  $0 switch-pnpm      Switch to pnpm package manager"
    echo "  $0 switch-bun       Switch to Bun package manager"
    echo ""
    echo "Notes:"
    echo "  - Bun is the default package manager (recommended for development)"
    echo "  - pnpm is the alternative package manager (production-ready)"
    echo "  - You can switch between them using switch commands"
    echo "  - The backend service automatically uses the selected package manager"
}

# Function to start all services
start_all_services() {
    print_status "Starting all services (backend + databases)..."
    docker-compose up -d --build
    print_success "All services started"
    print_status "Backend: http://localhost:3000"
    print_status "PostgreSQL: localhost:5434"
    print_status "Redis: localhost:6379"
}

# Function to start only database services
start_database_services() {
    print_status "Starting only database services..."
    docker-compose up -d dev-db redis
    print_success "Database services started"
    print_status "PostgreSQL: localhost:5434"
    print_status "Redis: localhost:6379"
    print_status "Run your backend locally with: pnpm dev or bun run dev:bun"
}

# Function to stop all services
stop_all_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped"
}

# Function to restart all services
restart_all_services() {
    print_status "Restarting all services..."
    docker-compose restart
    print_success "All services restarted"
}

# Function to show backend logs
show_backend_logs() {
    print_status "Showing backend logs..."
    docker-compose logs -f backend-bun
}

# Function to build backend service
build_backend_service() {
    print_status "Building backend service..."
    docker-compose build backend-bun
    print_success "Backend service built successfully"
}

# Function to show status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    echo ""
    print_status "Port Mapping:"
    echo "  Backend:        http://localhost:3000"
    echo "  PostgreSQL:     localhost:5434"
    echo "  Redis:          localhost:6379"
    echo ""
    print_status "Current Package Manager:"
    
    # Check which dockerfile is currently active
    if grep -q "^[[:space:]]*dockerfile: Dockerfile.bun" docker-compose.yml; then
        echo "  🐰 Bun (active)"
    elif grep -q "^[[:space:]]*dockerfile: Dockerfile.pnpm" docker-compose.yml; then
        echo "  📦 pnpm (active)"
    else
        echo "  ❓ No active dockerfile found"
        echo "  Check docker-compose.yml for configuration issues"
    fi
    
    # Show backup status
    if [ -f "docker-compose.yml.backup" ]; then
        echo "  💾 Backup available: docker-compose.yml.backup"
    fi
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
    read -r response
    if echo "$response" | grep -Eiq '^(yes|y)$'; then
        print_status "Cleaning up containers and volumes..."
        docker-compose down -v
        docker volume prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Function to switch to pnpm
switch_to_pnpm() {
    print_status "Switching to pnpm package manager..."
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
    
    # Create backup
    cp docker-compose.yml docker-compose.yml.backup
    
    # Comment out Bun line (handle any spacing)
    sed -i 's/^[[:space:]]*dockerfile: Dockerfile.bun/      # dockerfile: Dockerfile.bun/' docker-compose.yml
    
    # Uncomment pnpm line (handle any spacing)
    sed -i 's/^[[:space:]]*# dockerfile: Dockerfile.pnpm/      dockerfile: Dockerfile.pnpm/' docker-compose.yml
    
    print_success "Switched to pnpm package manager"
    print_status "Rebuilding backend service..."
    docker-compose build backend-bun
    print_success "Backend service rebuilt with pnpm"
    print_status "Restarting services..."
    docker-compose up -d
    print_success "Services restarted with pnpm"
}

# Function to switch to bun
switch_to_bun() {
    print_status "Switching to Bun package manager..."
    
    # Check if docker-compose.yml exists
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found!"
        exit 1
    fi
    
    # Create backup
    cp docker-compose.yml docker-compose.yml.backup
    
    # Comment out pnpm line (handle any spacing)
    sed -i 's/^[[:space:]]*dockerfile: Dockerfile.pnpm/      # dockerfile: Dockerfile.pnpm/' docker-compose.yml
    
    # Uncomment Bun line (handle any spacing)
    sed -i 's/^[[:space:]]*# dockerfile: Dockerfile.bun/      dockerfile: Dockerfile.bun/' docker-compose.yml
    
    print_success "Switched to Bun package manager"
    print_status "Rebuilding backend service..."
    docker-compose build backend-bun
    print_success "Backend service rebuilt with Bun"
    print_status "Restarting services..."
    docker-compose up -d
    print_success "Services restarted with Bun"
}

# Main script logic
case $1 in
    "start")
        start_all_services
        ;;
    "start-db")
        start_database_services
        ;;
    "stop")
        stop_all_services
        ;;
    "restart")
        restart_all_services
        ;;
    "logs")
        show_backend_logs
        ;;
    "build")
        build_backend_service
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean_up
        ;;
    "switch-pnpm")
        switch_to_pnpm
        ;;
    "switch-bun")
        switch_to_bun
        ;;
    *)
        show_usage
        exit 1
        ;;
esac 