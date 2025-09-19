# Railway Deployment Fixes

## Issues Fixed

### 1. Node.js Version Mismatch
**Problem**: Railway was using Node.js 18, but NestJS 11.x requires Node.js 20+

**Solution**: Updated all configuration files to use Node.js 20:
- `apps/backend/nixpacks.toml`: Changed from `nodejs_18` to `nodejs_20`
- `apps/backend/Dockerfile`: Changed from `node:18-alpine` to `node:20-alpine`
- `package.json`: Added engines field requiring Node.js 20+

### 2. Package Lock File Sync Issue
**Problem**: `package-lock.json` was out of sync with `package.json`

**Solution**: Regenerated the package-lock.json file:
```bash
cd apps/backend
rm -f package-lock.json
npm install
```

### 3. Deprecated npm Commands
**Problem**: Using deprecated `--only=production` flag

**Solution**: Updated to use `--omit=dev`:
- `apps/backend/nixpacks.toml`
- `apps/backend/Dockerfile`

### 4. Monorepo Build Process
**Problem**: Railway needed to understand the Nx monorepo structure

**Solution**: Updated build commands to use `npx nx build backend` instead of direct npm scripts

## Updated Configuration Files

### nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "npm", "postgresql"]

[phases.install]
cmds = [
  "npm ci --omit=dev"
]

[phases.build]
cmds = [
  "npx nx build backend"
]

[start]
cmd = "node apps/backend/dist/main.js"

[variables]
NODE_ENV = "production"
PORT = "3000"
```

### Dockerfile
```dockerfile
# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# ... rest of configuration
# Install dependencies
RUN npm ci --omit=dev

# Build the application
RUN npx nx build backend
```

### package.json
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

## Deployment Steps

1. **Push Changes**: Commit and push all the fixes to your repository
2. **Redeploy**: Railway will automatically detect the changes and redeploy
3. **Monitor Logs**: Check the build logs to ensure the build succeeds
4. **Test Health Endpoint**: Verify `/health` endpoint works

## Expected Build Output

The build should now succeed with:
- Node.js 20 installation
- Successful dependency installation
- Successful Nx build of the backend
- Application starting on port 3000

## Troubleshooting

If you still encounter issues:

1. **Check Node.js Version**: Ensure Railway is using Node.js 20
2. **Verify Dependencies**: Check that all required packages are installed
3. **Check Build Logs**: Look for any specific error messages
4. **Test Locally**: Run `nx build backend` locally to verify it works

## Environment Variables

Make sure these are set in Railway:
- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL` (from Railway PostgreSQL)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET`

The deployment should now work correctly with these fixes!
