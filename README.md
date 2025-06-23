# Hakim - Car Service Platform

A comprehensive car service platform that connects car owners with service providers, built with Next.js frontend and NestJS backend.

## 🚀 Features

- **User Authentication & Authorization**: Secure login/register with role-based access
- **Service Booking & Management**: Complete service request lifecycle
- **Vehicle Management**: Add, edit, and manage user vehicles
- **Admin Dashboard**: Comprehensive admin panel for service management
- **Real-time Notifications**: Push notifications for service updates
- **File Upload**: Image upload for service documentation
- **Responsive Design**: Mobile-first responsive web application
- **WhatsApp Integration**: Service request notifications via WhatsApp

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication solution
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Firebase Admin SDK** - Push notifications
- **AWS S3** - File storage (optional)

### DevOps & Deployment
- **Ubuntu Server** - Production deployment
- **Nginx** - Reverse proxy and web server
- **Systemd** - Service management
- **PM2** - Process manager
- **Docker** - Containerization (optional)

## 📁 Project Structure

```
hakim-car-service/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable React components
│   ├── services/           # API service functions
│   ├── styles/             # CSS modules and global styles
│   └── types/              # TypeScript type definitions
├── backend/                 # NestJS backend application
│   └── backend-app/        # Main backend application
│       ├── src/            # Source code
│       │   ├── auth/       # Authentication module
│       │   ├── users/      # User management
│       │   ├── vehicles/   # Vehicle management
│       │   ├── service-requests/ # Service requests
│       │   ├── bookings/   # Booking management
│       │   ├── reviews/    # Review system
│       │   ├── services/   # Service types
│       │   ├── notifications/ # Push notifications
│       │   ├── upload/     # File upload handling
│       │   └── shared/     # Shared utilities
│       ├── prisma/         # Database schema and migrations
│       └── uploads/        # File upload directory
├── docs/                   # Documentation
├── scripts/               # Deployment and utility scripts
├── backups/               # Database and application backups
└── deploy-ubuntu.sh       # Ubuntu deployment script
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Git**
- **npm** or **yarn**

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:AG-Ibtikar/hakim-car-service.git
   cd hakim-car-service
   ```

2. **Setup Backend**
   ```bash
   cd backend/backend-app
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Update environment variables
   # DATABASE_URL, JWT_SECRET, etc.
   
   # Run database migrations
   npx prisma migrate dev
   
   # Start development server
   npm run start:dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Copy environment file
   cp .env.example .env.local
   
   # Update environment variables
   # NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, etc.
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Admin Dashboard: http://localhost:3000/admin

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hakim_car_service"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Firebase (optional)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"

# AWS S3 (optional)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_S3_BUCKET="your-s3-bucket"
```

### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your-nextauth-secret"

# Database (for NextAuth)
DATABASE_URL="postgresql://user:password@localhost:5432/hakim_car_service"

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

## 🚀 Production Deployment

### Ubuntu Server Deployment

1. **Run the deployment script**
   ```bash
   chmod +x deploy-ubuntu.sh
   ./deploy-ubuntu.sh
   ```

2. **Update domain configuration**
   - Edit Nginx configuration: `/etc/nginx/sites-available/hakim-car-service`
   - Replace `your-domain.com` with your actual domain

3. **Setup SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

4. **Update environment variables**
   - Backend: `/opt/hakim-car-service/backend/backend-app/.env`
   - Frontend: `/opt/hakim-car-service/frontend/.env.local`

### Manual Deployment Steps

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Database Setup**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE hakim_car_service;
   CREATE USER hakim_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE hakim_car_service TO hakim_user;
   ```

3. **Application Deployment**
   ```bash
   # Clone repository
   sudo mkdir -p /opt/hakim-car-service
   sudo chown $USER:$USER /opt/hakim-car-service
   git clone git@github.com:AG-Ibtikar/hakim-car-service.git /opt/hakim-car-service
   
   # Setup backend
   cd /opt/hakim-car-service/backend/backend-app
   npm install
   npm run build
   
   # Setup frontend
   cd /opt/hakim-car-service/frontend
   npm install
   npm run build
   ```

## 🔍 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh JWT token

### User Management
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/vehicles` - Get user vehicles

### Service Requests
- `POST /service-requests` - Create service request
- `GET /service-requests` - List service requests
- `GET /service-requests/:id` - Get service request details
- `PUT /service-requests/:id` - Update service request

### Admin Endpoints
- `GET /admin/requests` - List all service requests
- `PUT /admin/requests/:id/status` - Update request status
- `GET /admin/users` - List all users
- `GET /admin/statistics` - Get system statistics

## 🛡 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Admin and customer roles
- **Input Validation** - Zod schema validation
- **CORS Protection** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **SQL Injection Protection** - Prisma ORM
- **XSS Protection** - Content Security Policy headers

## 📊 Monitoring & Logging

### Service Management
```bash
# Check service status
sudo systemctl status hakim-backend
sudo systemctl status hakim-frontend

# View logs
sudo journalctl -u hakim-backend -f
sudo journalctl -u hakim-frontend -f

# Restart services
sudo systemctl restart hakim-backend hakim-frontend
```

### Database Management
```bash
# Backup database
pg_dump hakim_car_service > backup.sql

# Restore database
psql hakim_car_service < backup.sql

# Check migrations
cd backend/backend-app && npx prisma migrate status
```

## 🔄 Backup & Recovery

### Automated Backups
The deployment script creates automated daily backups:
- Database backups stored in `/opt/backups/`
- Application files backed up as tar.gz
- 7-day retention policy

### Manual Backup
```bash
# Run backup script
/opt/hakim-car-service/backup.sh

# Or manually
pg_dump hakim_car_service > backup_$(date +%Y%m%d_%H%M%S).sql
tar -czf app_backup_$(date +%Y%m%d_%H%M%S).tar.gz /opt/hakim-car-service/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Version History

- **v1.0.0** - Initial release with basic functionality
- **v1.1.0** - Added admin dashboard and enhanced UI
- **v1.2.0** - WhatsApp integration and improved notifications
- **v1.3.0** - Enhanced security and performance optimizations 