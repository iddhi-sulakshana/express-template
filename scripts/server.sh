#!/bin/bash

# Docker Development Script
# Usage: ./server.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# if local dir is inside scripts remove the scripts part from LOCAL_DIR
if [[ $LOCAL_DIR == *"scripts"* ]]; then
    LOCAL_DIR="${LOCAL_DIR%/*}"
fi

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
    echo ""
    echo "Examples:"
    echo "  $0 start            Start the backend service with databases"
    echo "  $0 start-db         Start only databases (run backend locally)"
    echo "  $0 logs             Show the backend service logs"
    echo "  $0 build            Rebuild the backend service"
    echo "  $0 status           Show the status of all services"
    echo ""
    echo "Notes:"
    echo "  - Bun is the default package manager (recommended for development)"
    echo "  - The backend service automatically uses Bun package manager"
}

# Function to start all services
start_all_services() {
    print_status "Starting all services (backend + databases)..."
    docker compose up -d --build
    docker compose ps
    print_success "All services started"
    print_status "Backend: http://localhost:3000"
    print_status "PostgreSQL: localhost:5434"
    print_status "Redis: localhost:6379"
}

# Function to start only database services
start_database_services() {
    print_status "Starting only database services..."
    docker compose up -d postgres redis
    docker compose ps
    print_success "Database services started"
    print_status "PostgreSQL: localhost:5434"
    print_status "Redis: localhost:6379"
    print_status "Run your backend locally with: bun run dev"
}

# Function to stop all services
stop_all_services() {
    print_status "Stopping all services..."
    docker compose down
    print_success "All services stopped"
}

# Function to restart all services
restart_all_services() {
    print_status "Restarting all services..."
    docker compose restart
    print_success "All services restarted"
}

# Function to show backend logs
show_backend_logs() {
    print_status "Showing backend logs..."
    docker compose logs -f
}

# Function to build backend service
build_backend_service() {
    print_status "Building backend service..."
    docker compose build
    print_success "Backend service built successfully"
}

# Function to show status
show_status() {
    print_status "Service Status:"
    docker compose ps
    echo ""
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers and volumes. Are you sure? (y/N)"
    read -r response
    if echo "$response" | grep -Eiq '^(yes|y)$'; then
        print_status "Cleaning up containers and volumes..."
        docker compose down -v
        docker volume prune -f
        print_success "Cleanup completed"
    else
        print_status "Cleanup cancelled"
    fi
}

# Main script logic
main() {
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
        *)
            show_usage
            exit 1
            ;;
    esac 
}

# Run main function
main "$@"