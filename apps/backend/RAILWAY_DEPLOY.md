# Railway Deployment Configuration

This directory contains the complete Railway deployment configuration using TOML files.

## Files

### `railway.toml`
Main Railway service configuration:
- Build settings and watch patterns
- Deployment configuration with health checks
- Environment variables
- Service restart policies

### `nixpacks.toml`
Nixpacks build configuration:
- Node.js 20 setup
- Dependency installation with monorepo support
- Build process for commons + backend
- Production environment variables

## Build Process

1. **Setup Phase**: Install Node.js 20, npm, git
2. **Install Phase**: 
   - Navigate to workspace root
   - Install all dependencies with `--legacy-peer-deps`
3. **Build Phase**:
   - Build commons library first
   - Build backend in production mode
   - Return to backend directory
4. **Start**: Run `node dist/main.js`

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
