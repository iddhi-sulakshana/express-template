#!/bin/bash

# Database Migration Script
# Usage: ./migration.sh [command] [option]

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
    echo "Usage: $0 [command] [option]"
    echo ""
    echo "Commands:"
    echo "  generate            Generate migration files from schema changes"
    echo "  migrate             Run database migrations"
    echo "  seed                Seed database with initial data"
    echo "  generate-container  Generate migration files in container"
    echo "  migrate-container   Run migrations in container"
    echo "  seed-container      Seed database in container"
    echo ""
    echo "Examples:"
    echo "  $0 generate                 # Generate migration files"
    echo "  $0 migrate                  # Run migrations locally"
    echo "  $0 seed                     # Seed database locally"
    echo "  $0 generate-container       # Generate migration files in container"
    echo "  $0 migrate-container        # Run migrations in container"
    echo "  $0 seed-container           # Seed database in container"
}

# Function to run migrations
run_migrations() {
    print_status "Running database migrations using bun..."

    bun run db:migrate

    print_success "Migrations completed successfully!"
}

# Function to generate migration files
generate_migrations() {
    print_status "Generating migration files using bun..."

    bun run db:generate

    print_success "Migration files generated successfully!"
    print_status "Review the generated files in src/database/migrations/"
}

# Function to generate migration files in container
generate_migrations_in_container() {
    print_status "Generating migration files in container..."

    docker compose exec backend bun run db:generate

    print_success "Migration files generated successfully in container!"
}

# Function to run migrations in container
run_migrations_in_container() {
    print_status "Running migrations in container..."

    docker compose exec backend bun run db:migrate

    print_success "Migrations completed successfully in container!"
}

# Function to seed database
seed_database() {
    print_status "Seeding database using bun..."

    bun run db:seed

    print_success "Database seeding completed successfully!"
}

# Function to seed database in container
seed_database_in_container() {
    print_status "Seeding database in container..."

    docker compose exec backend bun run db:seed

    print_success "Database seeding completed successfully in container!"
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
        "seed")
            seed_database
            ;;
        "generate-container")
            generate_migrations_in_container
            ;;
        "migrate-container")
            run_migrations_in_container
            ;;
        "seed-container")
            seed_database_in_container
            ;;
        *)
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
