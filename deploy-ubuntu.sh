#!/bin/bash

# Hakim Car Service - Ubuntu Deployment Script
# This script deploys the full-stack application on Ubuntu server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="hakim-car-service"
APP_USER="hakim"
APP_DIR="/opt/$APP_NAME"
BACKEND_PORT=3001
FRONTEND_PORT=3000
DB_NAME="hakim_car_service"
DB_USER="hakim_user"
DB_PASSWORD="hakim_password_2024"  # Change this in production
NODE_VERSION="18"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user with sudo privileges."
    fi
}

# Update system packages
update_system() {
    log "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
}

# Install required packages
install_packages() {
    log "Installing required packages..."
    
    sudo apt install -y \
        curl \
        wget \
        git \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        unzip \
        nginx \
        certbot \
        python3-certbot-nginx \
        ufw \
        fail2ban
}

# Install Node.js
install_nodejs() {
    log "Installing Node.js $NODE_VERSION..."
    
    # Remove any existing Node.js installation
    sudo apt remove -y nodejs npm
    
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Verify installation
    node --version
    npm --version
}

# Install PostgreSQL
install_postgresql() {
    log "Installing PostgreSQL..."
    
    # Add PostgreSQL repository
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    sudo apt update
    
    # Install PostgreSQL
    sudo apt install -y postgresql postgresql-contrib
    
    # Start and enable PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
}

# Setup PostgreSQL database
setup_database() {
    log "Setting up PostgreSQL database..."
    
    # Create database user and database
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
}

# Create application user
create_app_user() {
    log "Creating application user..."
    
    sudo useradd -m -s /bin/bash $APP_USER || true
    sudo usermod -aG sudo $APP_USER
    
    # Set up SSH key for the user (optional)
    if [ -f ~/.ssh/id_rsa.pub ]; then
        sudo mkdir -p /home/$APP_USER/.ssh
        sudo cp ~/.ssh/id_rsa.pub /home/$APP_USER/.ssh/authorized_keys
        sudo chown -R $APP_USER:$APP_USER /home/$APP_USER/.ssh
        sudo chmod 700 /home/$APP_USER/.ssh
        sudo chmod 600 /home/$APP_USER/.ssh/authorized_keys
    fi
}

# Clone and setup application
setup_application() {
    log "Setting up application..."
    
    # Create application directory
    sudo mkdir -p $APP_DIR
    sudo chown $APP_USER:$APP_USER $APP_DIR
    
    # Clone repository (assuming it's in current directory)
    if [ -d ".git" ]; then
        sudo cp -r . $APP_DIR/
        sudo chown -R $APP_USER:$APP_USER $APP_DIR
    else
        error "Git repository not found in current directory"
    fi
}

# Setup backend
setup_backend() {
    log "Setting up backend..."
    
    cd $APP_DIR/backend/backend-app
    
    # Install dependencies with legacy peer deps to handle version conflicts
    log "Installing backend dependencies..."
    if ! npm install --legacy-peer-deps; then
        warning "Standard install failed, trying with --force..."
        npm install --force
    fi
    
    # Create environment file
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=$BACKEND_PORT
NODE_ENV=production

# CORS
CORS_ORIGIN="http://localhost:$FRONTEND_PORT,http://your-domain.com"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Firebase (if using)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"

# AWS S3 (if using)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket"
EOF
    
    # Run database migrations
    npx prisma generate
    npx prisma migrate deploy
    
    # Build the application
    npm run build
}

# Setup frontend
setup_frontend() {
    log "Setting up frontend..."
    
    cd $APP_DIR/frontend
    
    # Install dependencies with legacy peer deps to handle version conflicts
    log "Installing frontend dependencies..."
    if ! npm install --legacy-peer-deps; then
        warning "Standard install failed, trying with --force..."
        npm install --force
    fi
    
    # Create environment file
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:$BACKEND_PORT/api

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:$FRONTEND_PORT
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"

# Database (for NextAuth)
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# Google Maps (if using)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
EOF
    
    # Build the application
    npm run build
}

# Create systemd services
create_systemd_services() {
    log "Creating systemd services..."
    
    # Backend service
    sudo tee /etc/systemd/system/hakim-backend.service > /dev/null << EOF
[Unit]
Description=Hakim Car Service Backend
After=network.target postgresql.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR/backend/backend-app
ExecStart=/usr/bin/node dist/src/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$BACKEND_PORT

[Install]
WantedBy=multi-user.target
EOF
    
    # Frontend service
    sudo tee /etc/systemd/system/hakim-frontend.service > /dev/null << EOF
[Unit]
Description=Hakim Car Service Frontend
After=network.target hakim-backend.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$FRONTEND_PORT

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd
    sudo systemctl daemon-reload
    
    # Enable services
    sudo systemctl enable hakim-backend
    sudo systemctl enable hakim-frontend
}

# Setup Nginx
setup_nginx() {
    log "Setting up Nginx..."
    
    # Create Nginx configuration
    sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Change this to your domain
    
    # Frontend
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Uploads
    location /uploads/ {
        alias $APP_DIR/backend/backend-app/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test Nginx configuration
    sudo nginx -t
    
    # Restart Nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
}

# Setup firewall
setup_firewall() {
    log "Setting up firewall..."
    
    sudo ufw --force reset
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow ssh
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
}

# Setup SSL certificate (optional)
setup_ssl() {
    info "To setup SSL certificate, run:"
    info "sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
}

# Create backup script
create_backup_script() {
    log "Creating backup script..."
    
    sudo tee $APP_DIR/backup.sh > /dev/null << EOF
#!/bin/bash

# Backup script for Hakim Car Service
BACKUP_DIR="/opt/backups"
DATE=\$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p \$BACKUP_DIR

# Backup database
pg_dump -U $DB_USER -h localhost $DB_NAME > \$BACKUP_DIR/db_backup_\$DATE.sql

# Backup application files
tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz -C $APP_DIR .

# Keep only last 7 days of backups
find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: \$DATE"
EOF
    
    sudo chmod +x $APP_DIR/backup.sh
    sudo chown $APP_USER:$APP_USER $APP_DIR/backup.sh
    
    # Add to crontab for daily backups
    (sudo crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | sudo crontab -
}

# Start services
start_services() {
    log "Starting services..."
    
    sudo systemctl start hakim-backend
    sudo systemctl start hakim-frontend
    
    # Wait for services to start
    sleep 10
    
    # Check service status
    sudo systemctl status hakim-backend --no-pager
    sudo systemctl status hakim-frontend --no-pager
}

# Display deployment information
display_info() {
    log "Deployment completed successfully!"
    echo
    echo -e "${GREEN}=== Deployment Information ===${NC}"
    echo -e "Application Directory: ${BLUE}$APP_DIR${NC}"
    echo -e "Backend URL: ${BLUE}http://localhost:$BACKEND_PORT${NC}"
    echo -e "Frontend URL: ${BLUE}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "Database: ${BLUE}PostgreSQL on localhost:5432${NC}"
    echo -e "Database Name: ${BLUE}$DB_NAME${NC}"
    echo -e "Database User: ${BLUE}$DB_USER${NC}"
    echo
    echo -e "${YELLOW}=== Next Steps ===${NC}"
    echo "1. Update domain name in Nginx configuration"
    echo "2. Setup SSL certificate with Certbot"
    echo "3. Update environment variables with production values"
    echo "4. Configure monitoring and logging"
    echo
    echo -e "${GREEN}=== Useful Commands ===${NC}"
    echo "Check backend logs: sudo journalctl -u hakim-backend -f"
    echo "Check frontend logs: sudo journalctl -u hakim-frontend -f"
    echo "Restart services: sudo systemctl restart hakim-backend hakim-frontend"
    echo "Check service status: sudo systemctl status hakim-backend hakim-frontend"
    echo "Run backup: $APP_DIR/backup.sh"
}

# Main deployment function
main() {
    log "Starting Hakim Car Service deployment on Ubuntu..."
    
    check_root
    update_system
    install_packages
    install_nodejs
    install_postgresql
    setup_database
    create_app_user
    setup_application
    setup_backend
    setup_frontend
    create_systemd_services
    setup_nginx
    setup_firewall
    create_backup_script
    start_services
    display_info
    
    log "Deployment completed!"
}

# Run main function
main "$@" 