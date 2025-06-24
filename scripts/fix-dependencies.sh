#!/bin/bash

# Fix Dependencies Script for Hakim Car Service Backend
# Resolves NestJS version conflicts

set -e

echo "🔧 Fixing dependency conflicts..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Navigate to backend directory
cd backend/backend-app

print_status "Cleaning npm cache..."
    npm cache clean --force
    
print_status "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

print_status "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully!"
else
    print_warning "First attempt failed. Trying with force flag..."
    npm install --legacy-peer-deps --force
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully with force flag!"
    else
        print_error "Failed to install dependencies. Please check the error messages above."
        exit 1
    fi
fi

print_status "Building the application..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Please check the error messages above."
    exit 1
fi

print_success "🎉 Dependency conflicts resolved successfully!"
print_status "You can now run the deployment script again." 