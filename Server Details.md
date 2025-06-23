# Hakim Car Service - Server Details

## Frontend Server
- **Port**: 3000
- **URL**: http://localhost:3000
- **Framework**: Next.js
- **Directory**: `/frontend`

### Status Check Commands
```bash
# Check if frontend is running
lsof -i :3000

# Start frontend server
cd frontend && npm run dev

# Stop frontend server
# Press Ctrl+C in the terminal where it's running
```

## Backend Server
- **Port**: 3001
- **URL**: http://localhost:3001
- **Framework**: NestJS
- **Directory**: `/backend/backend-app`

### Status Check Commands
```bash
# Check if backend is running
lsof -i :3001

# Start backend server
cd backend/backend-app && npm run start:dev

# Stop backend server
# Press Ctrl+C in the terminal where it's running
```

## Database Server
- **Type**: PostgreSQL
- **Port**: 5432
- **Database Name**: hakim_car_service
- **ORM**: Prisma

### Status Check Commands
```bash
# Check if PostgreSQL is running
pg_isready

# List all databases
psql -l

# Connect to database
psql -d hakim_car_service

# Check database migrations
cd backend/backend-app && npx prisma migrate status

# Generate Prisma client
cd backend/backend-app && npx prisma generate
```

## Environment Variables
### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hakim_car_service?schema=public"
JWT_SECRET="your-super-secret-key-change-in-production"
```

## Common Issues and Solutions

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # For frontend
lsof -i :3001  # For backend
lsof -i :5432  # For database

# Kill process
kill <PID>
```

### Database Connection Issues
```bash
# Check PostgreSQL service
brew services list  # For macOS
sudo service postgresql status  # For Linux

# Restart PostgreSQL
brew services restart postgresql  # For macOS
sudo service postgresql restart  # For Linux
```

### Prisma Issues
```bash
# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name <migration_name>

# Update database schema
npx prisma db push
```

## Monitoring
- Frontend logs: Check terminal running `npm run dev`
- Backend logs: Check terminal running `npm run start:dev`
- Database logs: Check PostgreSQL logs in system logs

## Backup and Restore
```bash
# Backup database
pg_dump hakim_car_service > backup.sql

# Restore database
psql hakim_car_service < backup.sql
``` 