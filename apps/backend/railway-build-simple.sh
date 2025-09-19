#!/bin/bash

# Simple Railway build script for Easy Picsy Backend
set -e

echo "🚀 Starting Railway build process..."

# Check Node.js version
echo "📋 Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

# Install all dependencies (including dev dependencies for build)
echo "📦 Installing all dependencies..."
npm install --legacy-peer-deps

# Build the application using webpack directly
echo "🔨 Building application with webpack..."
npx webpack-cli build --node-env=production --mode=production

# Verify build output
if [ -f "dist/main.js" ]; then
    echo "✅ Build successful! Output found at dist/main.js"
else
    echo "❌ Build failed! Output not found at dist/main.js"
    exit 1
fi

echo "🎉 Railway build completed successfully!"
