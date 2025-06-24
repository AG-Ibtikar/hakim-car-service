#!/bin/bash

# Backend Deployment Script for Hostinger VPS
# Deploys backend from backend/backend-app directory

set -e

echo "🚀 Starting Backend Deployment on Hostinger VPS..."

# VPS Configuration
VPS_IP="147.93.72.229"
VPS_USER="root"
REPO_URL="https://github.com/AG-Ibtikar/hakim-car-service.git"
PROJECT_DIR="/var/www/hakim-car-service"
BACKEND_DIR="$PROJECT_DIR/backend/backend-app"

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

# Navigate to backend directory
print_status "Navigating to backend directory: $BACKEND_DIR"
run_on_vps "cd $BACKEND_DIR"

# Check if backend directory exists
if ! run_on_vps "[ -d '$BACKEND_DIR' ]"; then
    print_error "Backend directory not found: $BACKEND_DIR"
    print_status "Available directories in backend:"
    run_on_vps "ls -la $PROJECT_DIR/backend/"
    exit 1
fi

# Install dependencies
print_status "Installing backend dependencies..."
run_on_vps "cd $BACKEND_DIR && npm install --legacy-peer-deps"

# If the above fails, try with force
if [ $? -ne 0 ]; then
    print_warning "First install attempt failed. Trying with force flag..."
    run_on_vps "cd $BACKEND_DIR && npm install --legacy-peer-deps --force"
fi

# Check if .env file exists, if not create from example
if ! run_on_vps "[ -f '$BACKEND_DIR/.env' ]"; then
    print_warning "No .env file found. Creating from example..."
    run_on_vps "cd $BACKEND_DIR && cp .env.example .env 2>/dev/null || echo 'Creating basic .env file...'"
    run_on_vps "cd $BACKEND_DIR && cat > .env << 'EOF'
# Database
DATABASE_URL=\"postgresql://hakim_user:hakim_password@localhost:5432/hakim_car_service\"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=production

# Backend URL for file uploads and API
BACKEND_URL=http://147.93.72.229:3001

# Frontend URL for CORS
FRONTEND_URL=http://147.93.72.229:3000

# AWS S3 (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=

# Firebase (optional)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
EOF"
    print_warning "Please update the .env file with your actual configuration"
fi

# Run database migrations
print_status "Running database migrations..."
run_on_vps "cd $BACKEND_DIR && npx prisma migrate deploy"

# Build the application
print_status "Building backend application..."
run_on_vps "cd $BACKEND_DIR && npm run build"

# Stop any existing backend process
print_status "Stopping existing backend processes..."
run_on_vps "pkill -f 'node.*3001' || echo 'No existing backend process found'"

# Start the backend server
print_status "Starting backend server on port 3001..."
run_on_vps "cd $BACKEND_DIR && nohup npm run start:prod > backend.log 2>&1 &"

# Wait a moment for the server to start
sleep 3

# Check if the server is running
if run_on_vps "curl -s http://localhost:3001/health > /dev/null"; then
    print_success "Backend server is running successfully on port 3001"
    print_status "Backend URL: http://147.93.72.229:3001"
else
    print_error "Backend server failed to start"
    print_status "Checking logs..."
    run_on_vps "tail -20 $BACKEND_DIR/backend.log"
    exit 1
fi

# Check if Nginx is configured for the backend
print_status "Checking Nginx configuration..."
if ! run_on_vps "[ -f '/etc/nginx/sites-available/hakim-backend' ]"; then
    print_status "Creating Nginx configuration for backend..."
    run_on_vps "cat > /etc/nginx/sites-available/hakim-backend << 'EOF'
server {
    listen 80;
    server_name api.hakimcarservice.com 147.93.72.229;

    location / {
        proxy_pass http://localhost:3001;
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
    run_on_vps "ln -sf /etc/nginx/sites-available/hakim-backend /etc/nginx/sites-enabled/"
    run_on_vps "nginx -t && systemctl reload nginx"
    print_success "Nginx configuration created and enabled"
fi

print_success "🎉 Backend deployment completed successfully!"
print_status "Backend is running on:"
print_status "  - Direct: http://147.93.72.229:3001"
print_status "  - Via Nginx: http://147.93.72.229 (port 80)"
print_status "  - Health check: http://147.93.72.229:3001/health"

print_status "To monitor the backend logs:"
print_status "  ssh root@147.93.72.229 'tail -f $BACKEND_DIR/backend.log'" 