# Hakim Car Service - Deployment Guide

This guide covers the complete deployment process for the Hakim Car Service platform on Ubuntu servers.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Deployment](#quick-deployment)
3. [Manual Deployment](#manual-deployment)
4. [Environment Configuration](#environment-configuration)
5. [SSL Certificate Setup](#ssl-certificate-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Backup & Recovery](#backup--recovery)

## 🎯 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or higher
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB free space
- **CPU**: 2 cores minimum
- **Network**: Stable internet connection

### Domain & DNS
- Registered domain name
- DNS access to configure A records
- SSL certificate (Let's Encrypt recommended)

### Development Environment
- Git installed
- SSH key configured for GitHub access
- Local development environment working

## 🚀 Quick Deployment

### Automated Deployment Script

1. **Clone the repository**
   ```bash
   git clone git@github.com:AG-Ibtikar/hakim-car-service.git
   cd hakim-car-service
   ```

2. **Run the deployment script**
   ```bash
   chmod +x deploy-ubuntu.sh
   ./deploy-ubuntu.sh
   ```

3. **Update domain configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/hakim-car-service
   # Replace 'your-domain.com' with your actual domain
   sudo systemctl reload nginx
   ```

4. **Setup SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## 🔧 Manual Deployment

### Step 1: Server Preparation

1. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install essential packages**
   ```bash
   sudo apt install -y curl wget git build-essential software-properties-common
   ```

3. **Install Node.js 18**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

4. **Install PostgreSQL**
   ```bash
   sudo apt install -y postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

5. **Install Nginx**
   ```bash
   sudo apt install -y nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

6. **Install Certbot for SSL**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

### Step 2: Database Setup

1. **Create database and user**
   ```bash
   sudo -u postgres psql
   ```
   
   ```sql
   CREATE DATABASE hakim_car_service;
   CREATE USER hakim_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE hakim_car_service TO hakim_user;
   ALTER USER hakim_user CREATEDB;
   \q
   ```

2. **Test database connection**
   ```bash
   psql -h localhost -U hakim_user -d hakim_car_service
   ```

### Step 3: Application Setup

1. **Create application directory**
   ```bash
   sudo mkdir -p /opt/hakim-car-service
   sudo chown $USER:$USER /opt/hakim-car-service
   ```

2. **Clone repository**
   ```bash
   git clone git@github.com:AG-Ibtikar/hakim-car-service.git /opt/hakim-car-service
   ```

3. **Setup backend**
   ```bash
   cd /opt/hakim-car-service/backend/backend-app
   npm install
   
   # Create environment file
   cp .env.example .env
   nano .env
   ```

4. **Configure backend environment**
   ```env
   # Database
   DATABASE_URL="postgresql://hakim_user:your_secure_password@localhost:5432/hakim_car_service"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=3001
   NODE_ENV=production
   
   # CORS
   CORS_ORIGIN="https://your-domain.com"
   
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
   ```

5. **Run database migrations**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

6. **Build backend**
   ```bash
   npm run build
   ```

7. **Setup frontend**
   ```bash
   cd /opt/hakim-car-service/frontend
   npm install
   
   # Create environment file
   cp .env.example .env.local
   nano .env.local
   ```

8. **Configure frontend environment**
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-domain.com/api
   
   # NextAuth Configuration
   NEXTAUTH_URL=https://your-domain.com
   NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
   
   # Database (for NextAuth)
   DATABASE_URL="postgresql://hakim_user:your_secure_password@localhost:5432/hakim_car_service"
   
   # Google Maps (if using)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
   ```

9. **Build frontend**
   ```bash
   npm run build
   ```

### Step 4: Service Configuration

1. **Create systemd service for backend**
   ```bash
   sudo tee /etc/systemd/system/hakim-backend.service > /dev/null << EOF
   [Unit]
   Description=Hakim Car Service Backend
   After=network.target postgresql.service
   
   [Service]
   Type=simple
   User=$USER
   WorkingDirectory=/opt/hakim-car-service/backend/backend-app
   ExecStart=/usr/bin/node dist/src/main.js
   Restart=always
   RestartSec=10
   Environment=NODE_ENV=production
   Environment=PORT=3001
   
   [Install]
   WantedBy=multi-user.target
   EOF
   ```

2. **Create systemd service for frontend**
   ```bash
   sudo tee /etc/systemd/system/hakim-frontend.service > /dev/null << EOF
   [Unit]
   Description=Hakim Car Service Frontend
   After=network.target hakim-backend.service
   
   [Service]
   Type=simple
   User=$USER
   WorkingDirectory=/opt/hakim-car-service/frontend
   ExecStart=/usr/bin/npm start
   Restart=always
   RestartSec=10
   Environment=NODE_ENV=production
   Environment=PORT=3000
   
   [Install]
   WantedBy=multi-user.target
   EOF
   ```

3. **Enable and start services**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable hakim-backend
   sudo systemctl enable hakim-frontend
   sudo systemctl start hakim-backend
   sudo systemctl start hakim-frontend
   ```

### Step 5: Nginx Configuration

1. **Create Nginx configuration**
   ```bash
   sudo tee /etc/nginx/sites-available/hakim-car-service > /dev/null << EOF
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       # Frontend
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
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:3001/api/;
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
           alias /opt/hakim-car-service/backend/backend-app/uploads/;
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
   ```

2. **Enable site and restart Nginx**
   ```bash
   sudo ln -sf /etc/nginx/sites-available/hakim-car-service /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 6: Firewall Configuration

1. **Configure UFW firewall**
   ```bash
   sudo ufw --force reset
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw --force enable
   ```

## 🔐 SSL Certificate Setup

### Let's Encrypt SSL Certificate

1. **Obtain SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

2. **Test automatic renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

3. **Setup automatic renewal cron job**
   ```bash
   sudo crontab -e
   # Add this line:
   # 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 📊 Monitoring & Maintenance

### Service Management

1. **Check service status**
   ```bash
   sudo systemctl status hakim-backend
   sudo systemctl status hakim-frontend
   sudo systemctl status nginx
   sudo systemctl status postgresql
   ```

2. **View service logs**
   ```bash
   # Backend logs
   sudo journalctl -u hakim-backend -f
   
   # Frontend logs
   sudo journalctl -u hakim-frontend -f
   
   # Nginx logs
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Restart services**
   ```bash
   sudo systemctl restart hakim-backend hakim-frontend nginx
   ```

### Database Management

1. **Check database status**
   ```bash
   sudo systemctl status postgresql
   pg_isready
   ```

2. **Database backup**
   ```bash
   pg_dump hakim_car_service > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

3. **Check database size**
   ```bash
   psql -U hakim_user -d hakim_car_service -c "SELECT pg_size_pretty(pg_database_size('hakim_car_service'));"
   ```

### Performance Monitoring

1. **System resources**
   ```bash
   # CPU and memory usage
   htop
   
   # Disk usage
   df -h
   
   # Process monitoring
   ps aux | grep node
   ```

2. **Application performance**
   ```bash
   # Check response times
   curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com/api/health"
   ```

## 🔄 Backup & Recovery

### Automated Backup Script

1. **Create backup script**
   ```bash
   sudo tee /opt/hakim-car-service/backup.sh > /dev/null << EOF
   #!/bin/bash
   
   BACKUP_DIR="/opt/backups"
   DATE=\$(date +%Y%m%d_%H%M%S)
   
   mkdir -p \$BACKUP_DIR
   
   # Backup database
   pg_dump -U hakim_user -h localhost hakim_car_service > \$BACKUP_DIR/db_backup_\$DATE.sql
   
   # Backup application files
   tar -czf \$BACKUP_DIR/app_backup_\$DATE.tar.gz -C /opt/hakim-car-service .
   
   # Keep only last 7 days of backups
   find \$BACKUP_DIR -name "*.sql" -mtime +7 -delete
   find \$BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
   
   echo "Backup completed: \$DATE"
   EOF
   ```

2. **Make script executable and setup cron**
   ```bash
   sudo chmod +x /opt/hakim-car-service/backup.sh
   sudo crontab -e
   # Add this line for daily backups at 2 AM:
   # 0 2 * * * /opt/hakim-car-service/backup.sh
   ```

### Manual Backup

1. **Database backup**
   ```bash
   pg_dump -U hakim_user -h localhost hakim_car_service > backup.sql
   ```

2. **Application files backup**
   ```bash
   tar -czf app_backup.tar.gz /opt/hakim-car-service/
   ```

3. **Configuration backup**
   ```bash
   sudo tar -czf config_backup.tar.gz /etc/nginx/sites-available/hakim-car-service /etc/systemd/system/hakim-*.service
   ```

### Recovery Procedures

1. **Database recovery**
   ```bash
   psql -U hakim_user -d hakim_car_service < backup.sql
   ```

2. **Application recovery**
   ```bash
   tar -xzf app_backup.tar.gz -C /opt/
   sudo systemctl restart hakim-backend hakim-frontend
   ```

3. **Configuration recovery**
   ```bash
   sudo tar -xzf config_backup.tar.gz -C /
   sudo systemctl daemon-reload
   sudo systemctl restart hakim-backend hakim-frontend nginx
   ```

## 🛠 Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   # Check service logs
   sudo journalctl -u hakim-backend -n 50
   sudo journalctl -u hakim-frontend -n 50
   
   # Check port availability
   sudo netstat -tlnp | grep :3000
   sudo netstat -tlnp | grep :3001
   ```

2. **Database connection issues**
   ```bash
   # Test database connection
   psql -U hakim_user -d hakim_car_service -c "SELECT 1;"
   
   # Check PostgreSQL logs
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

3. **Nginx configuration errors**
   ```bash
   # Test Nginx configuration
   sudo nginx -t
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate manually
   sudo certbot renew
   ```

### Performance Issues

1. **High memory usage**
   ```bash
   # Check memory usage
   free -h
   
   # Check Node.js memory usage
   ps aux | grep node
   ```

2. **Slow database queries**
   ```bash
   # Enable query logging
   sudo nano /etc/postgresql/*/main/postgresql.conf
   # Set: log_statement = 'all'
   sudo systemctl restart postgresql
   ```

3. **Nginx performance**
   ```bash
   # Check Nginx worker processes
   sudo nginx -T | grep worker_processes
   
   # Monitor Nginx performance
   sudo tail -f /var/log/nginx/access.log | grep -E "(GET|POST)"
   ```

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load balancer setup**
   - Use Nginx as load balancer
   - Configure multiple application instances
   - Setup session persistence

2. **Database scaling**
   - Consider read replicas
   - Implement connection pooling
   - Monitor query performance

3. **File storage scaling**
   - Use AWS S3 or similar for file storage
   - Implement CDN for static assets
   - Configure proper caching headers

### Vertical Scaling

1. **Server resources**
   - Increase RAM and CPU
   - Use SSD storage
   - Optimize database configuration

2. **Application optimization**
   - Enable compression
   - Implement caching strategies
   - Optimize database queries

## 🔒 Security Hardening

1. **Firewall configuration**
   ```bash
   sudo ufw default deny incoming
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Fail2ban setup**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

3. **Regular security updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **SSL/TLS configuration**
   - Use strong cipher suites
   - Enable HSTS
   - Configure security headers

## 📞 Support

For deployment issues:
1. Check the logs: `sudo journalctl -u hakim-backend -f`
2. Verify configuration files
3. Test connectivity: `curl -I https://your-domain.com`
4. Create an issue on GitHub with detailed error information

## 📝 Maintenance Checklist

### Daily
- [ ] Check service status
- [ ] Monitor error logs
- [ ] Verify SSL certificate validity

### Weekly
- [ ] Review backup logs
- [ ] Check disk usage
- [ ] Monitor performance metrics
- [ ] Update system packages

### Monthly
- [ ] Review security logs
- [ ] Update SSL certificates
- [ ] Performance optimization review
- [ ] Database maintenance

### Quarterly
- [ ] Full system backup
- [ ] Security audit
- [ ] Performance testing
- [ ] Documentation updates 