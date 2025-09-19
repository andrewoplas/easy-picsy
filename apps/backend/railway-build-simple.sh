#!/bin/bash

# Railway build script for Easy Picsy Backend
set -e

echo "🚀 Starting Railway build process..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Ensure we're in the workspace root
echo "📂 Current directory: $(pwd)"
echo "📂 Contents: $(ls -la)"

# Build commons library first (required dependency)
echo "🔨 Building commons library..."
npx nx build commons

# Build the backend application
echo "🔨 Building backend application..."
npx nx build backend --configuration=production

# Verify build output
if [ -f "apps/backend/dist/main.js" ]; then
    echo "✅ Build successful! Output found at apps/backend/dist/main.js"
    echo "📁 Build contents:"
    ls -la apps/backend/dist/
else
    echo "❌ Build failed! Output not found at apps/backend/dist/main.js"
    echo "📁 Checking dist directory:"
    ls -la apps/backend/ || echo "No dist directory found"
    exit 1
fi

echo "🎉 Railway build completed successfully!"
