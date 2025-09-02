#!/bin/sh

# Database Migration Script for Express Template
# Usage: ./migration.sh [command] [option]

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
    echo "Usage: $0 [command] [option]"
    echo ""
    echo "Commands:"
    echo "  generate            Generate migration files from schema changes"
    echo "  migrate             Run database migrations"
    echo "  generate-container  Generate migration files in container"
    echo "  migrate-container   Run migrations in container"
    echo ""
    echo "Examples:"
    echo "  $0 generate                 # Generate migration files"
    echo "  $0 migrate                  # Run migrations locally"
    echo "  $0 generate-container       # Generate migration files in container"
    echo "  $0 migrate-container        # Run migrations in container"
}

# Function to detect package manager
detect_package_manager() {
    if command -v bun &> /dev/null; then
        echo "bun"
    elif command -v pnpm &> /dev/null; then
        echo "pnpm"
    else
        echo "npm"
    fi
}

# Function to run migrations
run_migrations() {
    local package_manager=$(detect_package_manager)
    
    print_status "Running database migrations using $package_manager..."
    
    $package_manager run db:migrate
        
    print_success "Migrations completed successfully!"
}

# Function to generate migration files
generate_migrations() {
    local package_manager=$(detect_package_manager)
    
    print_status "Generating migration files using $package_manager..."
    
    $package_manager run db:generate
    
    print_success "Migration files generated successfully!"
    print_status "Review the generated files in src/database/migrations/"
}

# Function to generate migration files in container
generate_migrations_in_container() {
    
    print_status "Generating migration files in container..."
    
    docker-compose exec backend-bun /bin/sh -c "./migration.sh generate"
    
    print_success "Migration files generated successfully in container!"
}

# Function to run migrations in container
run_migrations_in_container() {
    print_status "Running migrations in container..."
    
    docker-compose exec backend-bun /bin/sh -c "./migration.sh migrate"
    
    print_success "Migrations completed successfully in container!"
}

# Main script logic
main() {
    case $1 in
        "migrate")
            run_migrations $2
            ;;
        "generate")
            generate_migrations
            ;;
        "generate-container")
            generate_migrations_in_container
            ;;
        "migrate-container")
            run_migrations_in_container
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"