# Backup Created on Wed May 28 16:32:26 +04 2025

## Backup Contents
- Application files (app_backup.tar.gz)
- Database schema (schema.prisma)
- Service requests data (service_requests.csv)

## How to Restore

1. Navigate to this backup directory:
   ```bash
   cd backups/20250528_163158
   ```

2. Run the restore script:
   ```bash
   ./restore.sh
   ```

## Manual Restore Steps (if needed)

1. Restore application files:
   ```bash
   tar -xzf app_backup.tar.gz -C /path/to/project/root
   ```

2. Restore database schema:
   ```bash
   cd /path/to/project/root/backend/backend-app
   npx prisma generate
   npx prisma db push
   ```

3. Restore database data:
   ```bash
   PGPASSWORD=postgres psql -U postgres -d hakim_car_service -c "\COPY service_requests FROM 'backups/20250528_163158/service_requests.csv' WITH CSV HEADER"
   ```
