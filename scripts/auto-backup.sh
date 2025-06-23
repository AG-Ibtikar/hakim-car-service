#!/bin/bash

# Configuration
BACKUP_DIR="/Users/ahmedgaber/Hakim- Car Service/backup"
PROJECT_DIR="/Users/ahmedgaber/Hakim- Car Service"
MAX_BACKUPS=7  # Keep last 7 backups

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/hakim-car-service-backup-$TIMESTAMP.tar.gz"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Starting automated backup..."

# Create backup
echo "📦 Creating backup..."
cd "$PROJECT_DIR" || exit 1
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='backup' \
    --exclude='*.log' \
    -czf "$BACKUP_FILE" .

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup created successfully: $BACKUP_FILE${NC}"
    
    # Generate MD5 checksum
    MD5SUM=$(md5sum "$BACKUP_FILE" | cut -d' ' -f1)
    echo "$MD5SUM" > "$BACKUP_FILE.md5"
    
    # Rotate old backups
    echo "🔄 Rotating old backups..."
    cd "$BACKUP_DIR" || exit 1
    ls -t hakim-car-service-backup-*.tar.gz | tail -n +$((MAX_BACKUPS + 1)) | xargs -r rm
    
    # Verify the backup
    echo "🔍 Verifying backup..."
    if tar -tzf "$BACKUP_FILE" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Backup verification passed${NC}"
    else
        echo -e "${RED}✗ Backup verification failed${NC}"
        exit 1
    fi
    
    # Log backup details
    echo "📝 Logging backup details..."
    echo "Backup completed at $(date)" >> "$BACKUP_DIR/backup.log"
    echo "Backup file: $BACKUP_FILE" >> "$BACKUP_DIR/backup.log"
    echo "MD5: $MD5SUM" >> "$BACKUP_DIR/backup.log"
    echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)" >> "$BACKUP_DIR/backup.log"
    echo "----------------------------------------" >> "$BACKUP_DIR/backup.log"
    
    echo -e "${GREEN}✓ Backup process completed successfully${NC}"
else
    echo -e "${RED}✗ Backup creation failed${NC}"
    exit 1
fi 