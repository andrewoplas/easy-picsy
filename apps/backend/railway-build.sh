#!/bin/bash

# Railway build script for Easy Picsy Backend
set -e

echo "🚀 Starting Railway build process..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev

# Build the application using nx
echo "🔨 Building application..."
npx nx build backend

# Verify build output
if [ -f "apps/backend/dist/main.js" ]; then
    echo "✅ Build successful! Output found at apps/backend/dist/main.js"
else
    echo "❌ Build failed! Output not found at apps/backend/dist/main.js"
    exit 1
fi

echo "🎉 Railway build completed successfully!"
