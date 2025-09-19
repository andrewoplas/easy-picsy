#!/bin/bash

# Simple Railway build script for Easy Picsy Backend
set -e

echo "🚀 Starting Railway build process..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Install all dependencies (including dev dependencies for build)
echo "📦 Installing all dependencies..."
cd ../.. && npm install --legacy-peer-deps

# Build the application using Nx
echo "🔨 Building application with Nx..."
npx nx build backend --configuration=production

# Verify build output
if [ -f "apps/backend/dist/main.js" ]; then
    echo "✅ Build successful! Output found at apps/backend/dist/main.js"
else
    echo "❌ Build failed! Output not found at apps/backend/dist/main.js"
    exit 1
fi

echo "🎉 Railway build completed successfully!"
