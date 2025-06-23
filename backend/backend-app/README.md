# Hakim Car Service Platform

A full-stack application for managing car service requests, bookings, and vehicle maintenance.

## Tech Stack

### Backend
- NestJS (Node.js framework)
- PostgreSQL (Database)
- Prisma (ORM)
- JWT Authentication
- TypeScript

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- React Icons

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hakim-car-service
```

2. Set up environment variables:

Backend (.env):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/hakim_car_service"
JWT_SECRET="your-jwt-secret"
FRONTEND_URL="http://localhost:3000"
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/backend-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run start:dev
```

The backend server will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register/customer - Register new customer
- POST /api/auth/register/technician - Register new technician
- POST /api/auth/login/customer - Customer login
- POST /api/auth/login/technician - Technician login
- POST /api/auth/login/admin - Admin login
- GET /api/auth/profile - Get user profile

### Service Requests
- POST /api/service-requests/guest - Create guest service request
- POST /api/service-requests - Create authenticated service request
- GET /api/service-requests - Get all service requests
- GET /api/service-requests/my-requests - Get user's service requests
- GET /api/service-requests/:id - Get specific service request
- PATCH /api/service-requests/:id - Update service request
- DELETE /api/service-requests/:id - Delete service request

### Vehicles
- POST /api/vehicles - Add new vehicle
- GET /api/vehicles - Get all vehicles
- GET /api/vehicles/:id - Get specific vehicle
- PUT /api/vehicles/:id - Update vehicle
- DELETE /api/vehicles/:id - Delete vehicle

## Deployment

### Backend Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start:prod
```

### Frontend Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## Production Considerations

1. Set up proper environment variables for production
2. Configure CORS settings for production domains
3. Set up SSL/TLS certificates
4. Configure proper database backups
5. Set up monitoring and logging
6. Configure proper security headers
7. Set up CI/CD pipeline

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
