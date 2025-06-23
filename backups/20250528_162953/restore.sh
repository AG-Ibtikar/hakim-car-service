#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting restore process..."

# Restore database schema
echo "Restoring database schema..."
cd "$(dirname "$(dirname "$SCRIPT_DIR")")/backend/backend-app"
npx prisma generate
npx prisma db push

# Restore database data
echo "Restoring database data..."
PGPASSWORD=postgres psql -U postgres -d hakim_car_service -f "$SCRIPT_DIR/restore.sql"

echo "Restore completed successfully!" 