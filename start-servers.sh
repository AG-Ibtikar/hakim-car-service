#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Hakim Car Service servers...${NC}"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $1 is already in use. Attempting to kill the process...${NC}"
        lsof -ti :$1 | xargs kill -9
        sleep 2
    fi
}

# Function to check if PostgreSQL is running
check_postgres() {
    if ! pg_isready > /dev/null 2>&1; then
        echo -e "${RED}PostgreSQL is not running. Starting PostgreSQL...${NC}"
        brew services start postgresql
        sleep 5
    fi
}

# Function to check if database exists
check_database() {
    if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw hakim_car_service; then
        echo -e "${RED}Database hakim_car_service does not exist. Creating...${NC}"
        psql -U postgres -c "CREATE DATABASE hakim_car_service;"
    fi
}

# Kill any existing Node.js processes
echo -e "${GREEN}Cleaning up existing processes...${NC}"
pkill -f node

# Check and start PostgreSQL
echo -e "${GREEN}Checking PostgreSQL...${NC}"
check_postgres
check_database

# Check ports
echo -e "${GREEN}Checking ports...${NC}"
check_port 3000
check_port 3001

# Start backend server
echo -e "${GREEN}Starting backend server...${NC}"
cd backend/backend-app
npm run start:dev &
BACKEND_PID=$!
cd ../..

# Wait for backend to start
echo -e "${GREEN}Waiting for backend to start...${NC}"
sleep 10

# Start frontend server
echo -e "${GREEN}Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Save PIDs to a file for later cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .server_pids

echo -e "${GREEN}All servers are starting up...${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend: http://localhost:3001${NC}"
echo -e "${GREEN}Database: PostgreSQL on port 5432${NC}"

# Function to handle script termination
cleanup() {
    echo -e "${GREEN}Shutting down servers...${NC}"
    if [ -f .server_pids ]; then
        kill $(cat .server_pids) 2>/dev/null
        rm .server_pids
    fi
    exit 0
}

# Set up trap for cleanup on script termination
trap cleanup SIGINT SIGTERM

# Keep script running
wait 