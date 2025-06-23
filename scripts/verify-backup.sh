#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required commands
for cmd in tar gzip md5sum; do
    if ! command_exists $cmd; then
        echo -e "${RED}Error: $cmd is required but not installed.${NC}"
        exit 1
    fi
done

# Check if backup file is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide the backup file path${NC}"
    echo "Usage: ./verify-backup.sh <backup-file.tar.gz>"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo "🔍 Verifying backup: $BACKUP_FILE"

# Verify archive integrity
echo "📦 Checking archive integrity..."
if tar -tzf "$BACKUP_FILE" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Archive integrity check passed${NC}"
else
    echo -e "${RED}✗ Archive integrity check failed${NC}"
    exit 1
fi

# List contents
echo -e "\n📋 Backup contents:"
tar -tzf "$BACKUP_FILE" | grep -v "node_modules" | grep -v ".git" | head -n 10
echo "... (showing first 10 entries)"

# Check file count
FILE_COUNT=$(tar -tzf "$BACKUP_FILE" | wc -l)
echo -e "\n📊 Total files in backup: $FILE_COUNT"

# Check backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo -e "📦 Backup size: $BACKUP_SIZE"

# Generate MD5 checksum
echo -e "\n🔐 Generating MD5 checksum..."
MD5SUM=$(md5sum "$BACKUP_FILE" | cut -d' ' -f1)
echo "MD5: $MD5SUM"

echo -e "\n${GREEN}✓ Backup verification completed successfully${NC}" 