#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting restore process..."

# Restore application files
echo "Restoring application files..."
tar -xzf "$SCRIPT_DIR/app_backup.tar.gz" -C "$(dirname "$(dirname "$SCRIPT_DIR")")"

# Restore database schema
echo "Restoring database schema..."
cd "$(dirname "$(dirname "$SCRIPT_DIR")")/backend/backend-app"
npx prisma generate
npx prisma db push

# Restore database data
echo "Restoring database data..."
PGPASSWORD=postgres psql -U postgres -d hakim_car_service -c "\COPY service_requests FROM '$SCRIPT_DIR/service_requests.csv' WITH CSV HEADER"

echo "Restore completed successfully!"
