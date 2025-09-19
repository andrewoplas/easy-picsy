# Railway Deployment Configuration

This directory contains the modern Railway deployment configuration using Dockerfile and TOML.

## Files

### `railway.toml`
Main Railway service configuration:
- Dockerfile-based build
- Watch patterns for auto-deployment
- Deployment configuration with health checks
- Environment variables
- Service restart policies

### `Dockerfile`
Multi-stage Docker build:
- **Build Stage**: Installs dependencies and builds the application
- **Production Stage**: Creates optimized production image
- **Security**: Runs as non-root user
- **Health Check**: Built-in health monitoring

## Build Process

1. **Build Stage**:
   - Uses Node.js 20 Alpine base image
   - Installs build dependencies (Python, make, g++)
   - Copies workspace package files
   - Installs all dependencies with `--legacy-peer-deps`
   - Builds commons library first, then backend

2. **Production Stage**:
   - Clean Node.js 20 Alpine image
   - Copies only built application and production dependencies
   - Creates non-root user for security
   - Sets up health check monitoring

## Environment Variables

Railway will automatically set:
- `NODE_ENV=production`
- `PORT=3000`
- `NPM_CONFIG_PRODUCTION=false` (needed for build tools)

Additional environment variables needed in Railway dashboard:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`

## Health Check

Railway will monitor the `/api/health` endpoint with a 300-second timeout.

## Deployment

1. Commit and push changes
2. Railway auto-detects `railway.toml`
3. Builds using `nixpacks.toml` configuration
4. Deploys with automatic health checks

## Watch Patterns

Railway watches for changes in:
- `**/*.ts`
- `**/*.js`
- `**/*.json`
- `package*.json`

Any changes to these files will trigger a new deployment.
