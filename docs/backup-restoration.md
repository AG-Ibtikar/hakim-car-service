# Backup Restoration Guide

This guide provides step-by-step instructions for restoring the Hakim Car Service application from a backup.

## Prerequisites

- Unix-like operating system (macOS, Linux)
- Basic command-line knowledge
- Required tools:
  - `tar`
  - `gzip`
  - `md5sum`
  - `npm` (Node.js package manager)

## Restoration Steps

### 1. Verify Backup Integrity

Before restoring, verify the backup file's integrity:

```bash
./scripts/verify-backup.sh /path/to/backup-file.tar.gz
```

The script will:
- Check archive integrity
- Display backup contents
- Show file count and size
- Generate MD5 checksum

### 2. Prepare Restoration Environment

1. Create a new directory for the restored application:
   ```bash
   mkdir hakim-car-service-restored
   cd hakim-car-service-restored
   ```

2. Extract the backup:
   ```bash
   tar -xzf /path/to/backup-file.tar.gz
   ```

### 3. Restore Dependencies

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd ../backend/backend-app
   npm install
   ```

### 4. Configure Environment

1. Set up frontend environment:
   ```bash
   cd ../../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. Set up backend environment:
   ```bash
   cd ../backend/backend-app
   cp .env.example .env
   # Edit .env with your configuration
   ```

### 5. Database Restoration

1. Start the database service:
   ```bash
   cd ../backend/backend-app
   docker-compose up -d db
   ```

2. Run database migrations:
   ```bash
   npm run migration:run
   ```

### 6. Verify Installation

1. Start the backend server:
   ```bash
   npm run start:dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd ../../frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **Missing Dependencies**
   - Error: `Cannot find module 'next'`
   - Solution: Run `npm install` in the frontend directory

2. **Database Connection Issues**
   - Error: `Unable to connect to database`
   - Solution: Check database credentials in `.env` file

3. **Port Conflicts**
   - Error: `Port 3000 is already in use`
   - Solution: Change port in frontend configuration or stop conflicting service

### Getting Help

If you encounter issues not covered in this guide:
1. Check the application logs
2. Review the backup verification output
3. Contact system administrator

## Backup Rotation

The system maintains the last 7 backups by default. Older backups are automatically removed during the backup process.

## Security Notes

- Keep backup files secure
- Don't commit backup files to version control
- Regularly test restoration process
- Store backups in multiple locations 