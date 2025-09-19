#!/bin/bash

# Railway startup script for Easy Picsy Backend
set -e

echo "🚀 Starting Easy Picsy Backend on Railway..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
  echo "📦 Production environment detected"
  
  # Run database migrations if DATABASE_URL is set
  if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Running database migrations..."
    # Note: Add your migration command here when you have one
    # npx drizzle-kit migrate
  fi
  
  # Start the application
  echo "🎯 Starting NestJS application..."
  exec node dist/main.js
else
  echo "🔧 Development environment detected"
  echo "🎯 Starting NestJS application in development mode..."
  exec node dist/main.js
fi
