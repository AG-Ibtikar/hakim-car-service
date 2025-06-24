#!/bin/bash

# Frontend Deployment Script for Hostinger VPS
# Deploys frontend from frontend directory

set -e

echo "🚀 Starting Frontend Deployment on Hostinger VPS..."

# VPS Configuration
VPS_IP="147.93.72.229"
VPS_USER="root"
REPO_URL="https://github.com/AG-Ibtikar/hakim-car-service.git"
PROJECT_DIR="/var/www/hakim-car-service"
FRONTEND_DIR="$PROJECT_DIR/frontend"

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

# Function to run commands on VPS
run_on_vps() {
    ssh $VPS_USER@$VPS_IP "$1"
}

# Function to copy files to VPS
copy_to_vps() {
    scp -r "$1" $VPS_USER@$VPS_IP:"$2"
}

print_status "Connecting to VPS and checking system status..."

# Check if project directory exists, if not clone the repo
if ! run_on_vps "[ -d '$PROJECT_DIR' ]"; then
    print_status "Project directory not found. Cloning repository..."
    run_on_vps "mkdir -p /var/www && cd /var/www && git clone $REPO_URL"
    print_success "Repository cloned successfully"
else
    print_status "Project directory exists. Pulling latest changes..."
    run_on_vps "cd $PROJECT_DIR && git pull origin main"
    print_success "Repository updated successfully"
fi

# Navigate to frontend directory
print_status "Navigating to frontend directory: $FRONTEND_DIR"
run_on_vps "cd $FRONTEND_DIR"

# Check if frontend directory exists
if ! run_on_vps "[ -d '$FRONTEND_DIR' ]"; then
    print_error "Frontend directory not found: $FRONTEND_DIR"
    print_status "Available directories in project:"
    run_on_vps "ls -la $PROJECT_DIR/"
    exit 1
fi

# Create production environment file
print_status "Creating production environment file..."
run_on_vps "cd $FRONTEND_DIR && cat > .env.production << 'EOF'
# Production Environment Configuration
NEXT_PUBLIC_API_URL=http://147.93.72.229:3001

# Google Maps API Key (update this with your actual key)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
EOF"

# Install dependencies
print_status "Installing frontend dependencies..."
run_on_vps "cd $FRONTEND_DIR && npm install"

# Build the application
print_status "Building frontend application..."
run_on_vps "cd $FRONTEND_DIR && npm run build"

# Check if the build was successful
if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Stop any existing frontend process
print_status "Stopping existing frontend processes..."
run_on_vps "pkill -f 'next start' || echo 'No existing frontend process found'"

# Start the frontend server
print_status "Starting frontend server on port 3000..."
run_on_vps "cd $FRONTEND_DIR && nohup npm start > frontend.log 2>&1 &"

# Wait a moment for the server to start
sleep 5

# Check if the server is running
if run_on_vps "curl -s http://localhost:3000 > /dev/null"; then
    print_success "Frontend server is running successfully on port 3000"
    print_status "Frontend URL: http://147.93.72.229:3000"
else
    print_error "Frontend server failed to start"
    print_status "Checking logs..."
    run_on_vps "tail -20 $FRONTEND_DIR/frontend.log"
    exit 1
fi

# Check if Nginx is configured for the frontend
print_status "Checking Nginx configuration..."
if ! run_on_vps "[ -f '/etc/nginx/sites-available/hakim-frontend' ]"; then
    print_status "Creating Nginx configuration for frontend..."
    run_on_vps "cat > /etc/nginx/sites-available/hakim-frontend << 'EOF'
server {
    listen 80;
    server_name hakimcarservice.com www.hakimcarservice.com 147.93.72.229;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF"
    
    # Enable the site
    run_on_vps "ln -sf /etc/nginx/sites-available/hakim-frontend /etc/nginx/sites-enabled/"
    run_on_vps "nginx -t && systemctl reload nginx"
    print_success "Nginx configuration created and enabled"
fi

print_success "🎉 Frontend deployment completed successfully!"
print_status "Frontend is running on:"
print_status "  - Direct: http://147.93.72.229:3000"
print_status "  - Via Nginx: http://147.93.72.229 (port 80)"
print_status "  - Domain: http://hakimcarservice.com (if configured)"

print_status "To monitor the frontend logs:"
print_status "  ssh root@147.93.72.229 'tail -f $FRONTEND_DIR/frontend.log'"

print_warning "Don't forget to:"
print_warning "  1. Update the Google Maps API key in .env.production"
print_warning "  2. Configure your domain DNS to point to 147.93.72.229"
print_warning "  3. Set up SSL certificates for production" 