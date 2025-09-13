#!/bin/bash

# Easy Picsy Service Starter
# This script provides easy commands to start frontend and backend services

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display menu
show_menu() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${GREEN}   Easy Picsy Service Manager   ${NC}"
    echo -e "${BLUE}================================${NC}"
    echo ""
    echo "Select an option:"
    echo "1) Start Frontend (port 4200)"
    echo "2) Start Backend (port 3000)"
    echo "3) Start Both Services"
    echo "4) Run Database Studio"
    echo "5) Exit"
    echo ""
    read -p "Enter your choice [1-5]: " choice
}

# Function to start frontend
start_frontend() {
    echo -e "${GREEN}Starting Frontend...${NC}"
    npx nx serve frontend
}

# Function to start backend
start_backend() {
    echo -e "${GREEN}Starting Backend...${NC}"
    npx nx serve backend
}

# Function to start both services
start_both() {
    echo -e "${GREEN}Starting Both Services...${NC}"
    npx nx run-many --target=serve --projects=frontend,backend --parallel
}

# Function to run database studio
run_db_studio() {
    echo -e "${GREEN}Starting Database Studio...${NC}"
    npm run db:studio
}

# Main script logic
if [ "$1" == "frontend" ]; then
    start_frontend
elif [ "$1" == "backend" ]; then
    start_backend
elif [ "$1" == "both" ]; then
    start_both
elif [ "$1" == "db" ]; then
    run_db_studio
else
    # Interactive menu
    show_menu
    case $choice in
        1) start_frontend ;;
        2) start_backend ;;
        3) start_both ;;
        4) run_db_studio ;;
        5) echo -e "${YELLOW}Exiting...${NC}" && exit 0 ;;
        *) echo -e "${YELLOW}Invalid option. Exiting...${NC}" && exit 1 ;;
    esac
fi