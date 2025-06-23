# Hakim Car Service - Hostinger VPS Deployment Guide

## Overview
This guide will help you deploy the Hakim Car Service application on your Hostinger VPS with IP address `147.93.72.229`.

## Prerequisites
- Access to your Hostinger VPS via SSH
- Your GitHub repository URL
- Sudo privileges on the VPS

## Step 1: Prepare Your GitHub Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Note your GitHub repository URL** - you'll need this for the deployment script.

## Step 2: Update the Deployment Script

1. **Edit the deployment script** to include your actual GitHub repository URL:
   ```bash
   # Open the script for editing
   nano deploy-hostinger.sh
   ```

2. **Update the GITHUB_REPO variable** (around line 20):
   ```bash
   GITHUB_REPO="https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
   ```

3. **Update other configuration variables** if needed:
   - `DB_PASSWORD`: Change the database password
   - `JWT_SECRET`: Update with a strong secret key
   - `NEXTAUTH_SECRET`: Update with a strong secret key

## Step 3: Upload and Run the Deployment Script

1. **Upload the script to your VPS**:
   ```bash
   # From your local machine
   scp deploy-hostinger.sh root@147.93.72.229:/home/root/
   ```

2. **SSH into your VPS**:
   ```bash
   ssh root@147.93.72.229
   ```

3. **Make the script executable**:
   ```bash
   chmod +x deploy-hostinger.sh
   ```

4. **Run the deployment script**:
   ```bash
   ./deploy-hostinger.sh
   ```

## Step 4: Monitor the Deployment

The script will:
- Update system packages
- Install Node.js, PostgreSQL, Nginx, and other dependencies
- Create a dedicated user for the application
- Clone your repository from GitHub
- Set up the database
- Configure environment variables
- Build both frontend and backend
- Create systemd services for automatic startup
- Configure Nginx as a reverse proxy
- Set up firewall rules
- Create backup scripts

## Step 5: Verify Deployment

After the script completes, verify the deployment:

1. **Check service status**:
   ```bash
   sudo systemctl status hakim-backend
   sudo systemctl status hakim-frontend
   sudo systemctl status nginx
   ```

2. **Access your application**:
   - Main application: http://147.93.72.229
   - Backend API: http://147.93.72.229:3001
   - Frontend: http://147.93.72.229:3000

3. **Check logs if needed**:
   ```bash
   sudo journalctl -u hakim-backend -f
   sudo journalctl -u hakim-frontend -f
   ```

## Step 6: Post-Deployment Configuration

### Environment Variables
Update the following environment variables in production:

1. **Backend** (`/opt/hakim-car-service/backend/backend-app/.env`):
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET`

2. **Frontend** (`/opt/hakim-car-service/frontend/.env.local`):
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Domain Configuration (Optional)
If you have a domain name:

1. **Update Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/hakim-car-service
   ```
   Change `server_name 147.93.72.229;` to `server_name your-domain.com;`

2. **Setup SSL certificate**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Step 7: Useful Commands

### Service Management
```bash
# Restart services
sudo systemctl restart hakim-backend hakim-frontend nginx

# Check service status
sudo systemctl status hakim-backend hakim-frontend nginx

# View logs
sudo journalctl -u hakim-backend -f
sudo journalctl -u hakim-frontend -f
```

### Application Management
```bash
# Access application directory
cd /opt/hakim-car-service

# Update from GitHub
sudo -u hakim git pull origin main

# Rebuild after updates
cd backend/backend-app && sudo -u hakim npm run build
cd ../../frontend && sudo -u hakim npm run build

# Restart services after updates
sudo systemctl restart hakim-backend hakim-frontend
```

### Database Management
```bash
# Access PostgreSQL
sudo -u postgres psql

# Backup database
/opt/hakim-car-service/backup.sh

# Restore database
sudo -u postgres psql hakim_car_service < backup_file.sql
```

### Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop

# Check network connections
netstat -tulpn
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo netstat -tulpn | grep :3000
   sudo netstat -tulpn | grep :3001
   ```

2. **Permission issues**:
   ```bash
   sudo chown -R hakim:hakim /opt/hakim-car-service
   ```

3. **Database connection issues**:
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -c "\l"
   ```

4. **Nginx configuration issues**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

### Log Locations
- Application logs: `sudo journalctl -u hakim-backend -f`
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: `/var/log/postgresql/postgresql-*.log`

## Security Considerations

1. **Change default passwords**:
   - Database password
   - JWT secrets
   - NextAuth secret

2. **Configure firewall**:
   - The script sets up basic UFW rules
   - Consider additional security measures

3. **Regular updates**:
   - Keep system packages updated
   - Update application dependencies regularly

4. **Backup strategy**:
   - Daily automated backups are configured
   - Test backup restoration periodically

## Support

If you encounter issues during deployment:

1. Check the logs for error messages
2. Verify all prerequisites are met
3. Ensure your GitHub repository is accessible
4. Check network connectivity and firewall settings

The deployment script includes comprehensive error handling and will provide detailed feedback during the deployment process. 