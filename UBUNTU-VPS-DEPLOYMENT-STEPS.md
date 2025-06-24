# Ubuntu VPS on Hostinger - Step-by-Step Deployment Guide

## 🎯 Overview
This guide will deploy your Hakim Car Service application on your Ubuntu VPS at `147.93.72.229` using your GitHub repository.

## 📋 Prerequisites
- SSH access to your Hostinger VPS
- Your GitHub repository: `https://github.com/AG-Ibtikar/hakim-car-service.git`
- Sudo privileges on the VPS

---

## 🚀 Step-by-Step Deployment

### **Step 1: Connect to Your VPS**
```bash
ssh root@147.93.72.229
```

### **Step 2: Update System and Install Git**
```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git
```

### **Step 3: Create Application Directory**
```bash
sudo mkdir -p /opt/hakim-car-service
sudo chown $USER:$USER /opt/hakim-car-service
cd /opt/hakim-car-service
```

### **Step 4: Clone Your Repository**
```bash
git clone https://github.com/AG-Ibtikar/hakim-car-service.git .
```

### **Step 5: Make Deployment Script Executable**
```bash
chmod +x deploy-hostinger.sh
```

### **Step 6: Run the Deployment Script**
```bash
./deploy-hostinger.sh
```

---

## 📊 What the Script Will Do

The deployment script will automatically:

1. **System Setup**
   - Update Ubuntu packages
   - Install required dependencies (Node.js, PostgreSQL, Nginx, etc.)

2. **Database Setup**
   - Install PostgreSQL
   - Create database and user
   - Configure database permissions

3. **Application Setup**
   - Create dedicated user (`hakim`)
   - Clone your repository
   - Install dependencies for both frontend and backend

4. **Environment Configuration**
   - Create `.env` files with production settings
   - Configure database connections
   - Set up JWT secrets and CORS

5. **Build Applications**
   - Build backend (NestJS)
   - Build frontend (Next.js)
   - Run database migrations

6. **Service Configuration**
   - Create systemd services for auto-startup
   - Configure Nginx as reverse proxy
   - Set up firewall rules

7. **Start Services**
   - Start backend service (port 3001)
   - Start frontend service (port 3000)
   - Start Nginx

---

## 🔍 Monitoring the Deployment

### **Watch the Script Output**
The script will show progress with colored output:
- 🟢 **Green**: Success messages
- 🟡 **Yellow**: Warnings
- 🔴 **Red**: Errors

### **Expected Duration**
- Total time: 10-15 minutes
- Most time spent on: npm install and build processes

---

## ✅ Verification Steps

### **Step 1: Check Service Status**
```bash
sudo systemctl status hakim-backend
sudo systemctl status hakim-frontend
sudo systemctl status nginx
```

### **Step 2: Check Ports**
```bash
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001
sudo netstat -tulpn | grep :80
```

### **Step 3: Test Application**
- **Main App**: http://147.93.72.229
- **Backend API**: http://147.93.72.229:3001
- **Frontend**: http://147.93.72.229:3000

---

## 🛠️ Troubleshooting

### **If Script Fails**

1. **Check Logs**
   ```bash
   sudo journalctl -u hakim-backend -f
   sudo journalctl -u hakim-frontend -f
   ```

2. **Common Issues**
   - **Port already in use**: `sudo lsof -i :3000` or `sudo lsof -i :3001`
   - **Permission issues**: `sudo chown -R hakim:hakim /opt/hakim-car-service`
   - **Database issues**: `sudo systemctl status postgresql`

3. **Restart Services**
   ```bash
   sudo systemctl restart hakim-backend hakim-frontend nginx
   ```

### **If You Need to Start Over**
```bash
sudo systemctl stop hakim-backend hakim-frontend nginx
sudo rm -rf /opt/hakim-car-service
# Then start from Step 3 again
```

---

## 🔧 Post-Deployment Configuration

### **Update Environment Variables**
```bash
sudo nano /opt/hakim-car-service/backend/backend-app/.env
sudo nano /opt/hakim-car-service/frontend/.env.local
```

### **Important Variables to Update**
- `JWT_SECRET`: Change to a strong secret
- `NEXTAUTH_SECRET`: Change to a strong secret
- `DB_PASSWORD`: Change database password
- Firebase/AWS credentials if using

### **Setup Domain (Optional)**
If you have a domain name:
```bash
sudo nano /etc/nginx/sites-available/hakim-car-service
# Change server_name 147.93.72.229; to server_name your-domain.com;
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📈 Management Commands

### **Service Management**
```bash
# Restart all services
sudo systemctl restart hakim-backend hakim-frontend nginx

# Check status
sudo systemctl status hakim-backend hakim-frontend nginx

# View logs
sudo journalctl -u hakim-backend -f
sudo journalctl -u hakim-frontend -f
```

### **Application Updates**
```bash
cd /opt/hakim-car-service
sudo -u hakim git pull origin master
cd backend/backend-app && sudo -u hakim npm run build
cd ../../frontend && sudo -u hakim npm run build
sudo systemctl restart hakim-backend hakim-frontend
```

### **Database Management**
```bash
# Backup
/opt/hakim-car-service/backup.sh

# Access database
sudo -u postgres psql hakim_car_service
```

---

## 🔒 Security Notes

1. **Change Default Passwords**
   - Database password
   - JWT secrets
   - NextAuth secret

2. **Firewall**
   - Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS) are open
   - Backend and frontend ports are only accessible locally

3. **Regular Updates**
   - Keep system packages updated
   - Update application dependencies regularly

---

## 📞 Support

If you encounter issues:

1. **Check the logs first**
2. **Verify all prerequisites are met**
3. **Ensure your GitHub repository is accessible**
4. **Check network connectivity**

The deployment script includes comprehensive error handling and will provide detailed feedback during the process.

---

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ All services show "active (running)" status
- ✅ You can access http://147.93.72.229 in your browser
- ✅ No error messages in the logs
- ✅ Database migrations completed successfully

**Ready to start? Begin with Step 1!** 