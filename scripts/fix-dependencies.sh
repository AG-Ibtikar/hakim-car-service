#!/bin/bash

# Hakim Car Service - Dependency Fix Script
# This script fixes common dependency issues during deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Function to fix NestJS dependency issues
fix_nestjs_dependencies() {
    local project_dir="$1"
    
    if [ ! -d "$project_dir" ]; then
        error "Project directory $project_dir does not exist"
        return 1
    fi
    
    log "Fixing NestJS dependencies in $project_dir"
    
    cd "$project_dir"
    
    # Remove node_modules and package-lock.json
    if [ -d "node_modules" ]; then
        log "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        log "Removing existing package-lock.json..."
        rm -f package-lock.json
    fi
    
    # Clear npm cache
    log "Clearing npm cache..."
    npm cache clean --force
    
    # Try different installation strategies
    log "Attempting npm install with legacy peer deps..."
    if npm install --legacy-peer-deps; then
        log "Successfully installed dependencies with --legacy-peer-deps"
        return 0
    fi
    
    warning "Legacy peer deps failed, trying with --force..."
    if npm install --force; then
        log "Successfully installed dependencies with --force"
        return 0
    fi
    
    error "All installation methods failed"
    return 1
}

# Function to update package.json with consistent versions
update_package_versions() {
    local project_dir="$1"
    
    if [ ! -f "$project_dir/package.json" ]; then
        error "package.json not found in $project_dir"
        return 1
    fi
    
    log "Updating package.json in $project_dir"
    
    # Create backup
    cp "$project_dir/package.json" "$project_dir/package.json.backup"
    
    # Update NestJS versions to v11
    sed -i 's/"@nestjs\/common": "\^10\.0\.0"/"@nestjs\/common": "^11.0.0"/g' "$project_dir/package.json"
    sed -i 's/"@nestjs\/core": "\^10\.0\.0"/"@nestjs\/core": "^11.0.0"/g' "$project_dir/package.json"
    sed -i 's/"@nestjs\/platform-express": "\^10\.4\.18"/"@nestjs\/platform-express": "^11.0.0"/g' "$project_dir/package.json"
    
    log "Package.json updated successfully"
}

# Function to check for dependency conflicts
check_dependencies() {
    local project_dir="$1"
    
    if [ ! -d "$project_dir" ]; then
        error "Project directory $project_dir does not exist"
        return 1
    fi
    
    log "Checking dependencies in $project_dir"
    
    cd "$project_dir"
    
    # Check for version conflicts
    if npm ls 2>&1 | grep -q "ERESOLVE"; then
        warning "Dependency conflicts detected"
        return 1
    fi
    
    log "No dependency conflicts found"
    return 0
}

# Main function
main() {
    log "Starting dependency fix script..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
        error "This script should be run from the project root directory"
        exit 1
    fi
    
    # Fix backend dependencies
    if [ -d "backend/backend-app" ]; then
        log "Processing backend/backend-app..."
        
        # Update package.json versions
        update_package_versions "backend/backend-app"
        
        # Check for conflicts
        if ! check_dependencies "backend/backend-app"; then
            # Fix dependencies
            fix_nestjs_dependencies "backend/backend-app"
        fi
    fi
    
    # Fix root level backend-app if it exists
    if [ -d "backend-app" ]; then
        log "Processing backend-app..."
        
        # Update package.json versions
        update_package_versions "backend-app"
        
        # Check for conflicts
        if ! check_dependencies "backend-app"; then
            # Fix dependencies
            fix_nestjs_dependencies "backend-app"
        fi
    fi
    
    # Fix backend-app000 if it exists
    if [ -d "backend-app000" ]; then
        log "Processing backend-app000..."
        
        # Update package.json versions
        update_package_versions "backend-app000"
        
        # Check for conflicts
        if ! check_dependencies "backend-app000"; then
            # Fix dependencies
            fix_nestjs_dependencies "backend-app000"
        fi
    fi
    
    # Fix frontend dependencies
    if [ -d "frontend" ]; then
        log "Processing frontend..."
        
        if [ -d "frontend/node_modules" ]; then
            log "Removing existing frontend node_modules..."
            rm -rf frontend/node_modules
        fi
        
        if [ -f "frontend/package-lock.json" ]; then
            log "Removing existing frontend package-lock.json..."
            rm -f frontend/package-lock.json
        fi
        
        cd frontend
        
        log "Installing frontend dependencies..."
        if npm install; then
            log "Frontend dependencies installed successfully"
        else
            warning "Frontend installation failed, trying with legacy peer deps..."
            npm install --legacy-peer-deps
        fi
        
        cd ..
    fi
    
    log "Dependency fix script completed!"
    
    echo
    echo -e "${GREEN}=== Next Steps ===${NC}"
    echo "1. Test the application: npm run start:dev"
    echo "2. Run tests: npm test"
    echo "3. Build the application: npm run build"
    echo
    echo -e "${YELLOW}=== Troubleshooting ===${NC}"
    echo "If you still encounter issues:"
    echo "- Try: npm install --legacy-peer-deps"
    echo "- Try: npm install --force"
    echo "- Check Node.js version (recommended: v18+)"
    echo "- Clear npm cache: npm cache clean --force"
}

# Run main function
main "$@" 