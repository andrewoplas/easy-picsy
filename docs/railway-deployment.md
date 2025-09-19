# Railway Deployment Guide

This guide covers deploying the Easy Picsy backend to [Railway](https://railway.app/).

## Prerequisites

- Railway account
- GitHub repository with your code
- Environment variables configured

## Quick Start

### 1. Connect GitHub Repository

1. Go to [Railway](https://railway.app/)
2. Click "Deploy from GitHub Repo"
3. Select your Easy Picsy repository
4. Choose the `apps/backend` directory as the root

### 2. Configure Environment Variables

Set the following environment variables in Railway dashboard:

#### Required Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=7d

# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api
API_VERSION=v1
```

#### Optional Variables
```bash
# CORS (if you need specific origins)
CORS_ORIGIN=https://your-frontend-domain.com

# PayMongo (for payments)
PAYMONGO_SECRET_KEY=your-paymongo-secret
PAYMONGO_PUBLIC_KEY=your-paymongo-public
```

### 3. Database Setup

Railway provides PostgreSQL databases. Add a PostgreSQL service:

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set the `DATABASE_URL` environment variable
4. Run migrations (see Database Migrations section below)

## Configuration Files

### Dockerfile
The `Dockerfile` is optimized for Railway deployment:
- Uses Node.js 18 Alpine for smaller image size
- Installs system dependencies
- Builds the application
- Creates non-root user for security
- Includes health check

### nixpacks.toml
Railway's build system configuration:
- Specifies Node.js 18 and PostgreSQL
- Defines build phases
- Sets production environment variables

### Health Check
The application includes a health check endpoint at `/health` that returns:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "version": "1.0.0"
}
```

## Database Migrations

### Option 1: Manual Migration
Connect to your Railway PostgreSQL database and run migrations manually:

```bash
# Get database connection details from Railway
railway connect

# Run migrations
npx drizzle-kit migrate
```

### Option 2: Automated Migration
Add migration to your startup script (recommended for production):

```bash
# In start.sh, add before starting the app:
if [ -n "$DATABASE_URL" ]; then
  echo "🗄️  Running database migrations..."
  npx drizzle-kit migrate
fi
```

## Deployment Process

### Automatic Deployment
Railway automatically deploys when you push to your main branch. The deployment process:

1. **Build Phase**: Installs dependencies and builds the application
2. **Start Phase**: Runs the application using the start script
3. **Health Check**: Verifies the application is running correctly

### Manual Deployment
You can also trigger deployments manually:

1. Go to your Railway project dashboard
2. Click "Deploy" → "Deploy Latest"
3. Monitor the deployment logs

## Monitoring and Logs

### Viewing Logs
- Go to your service in Railway dashboard
- Click on "Logs" tab
- View real-time application logs

### Health Monitoring
- Railway automatically monitors the `/health` endpoint
- Failed health checks will trigger service restarts
- Monitor uptime in the Railway dashboard

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
CORS_ORIGIN=*
```

### Production
```bash
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation
- Check build logs in Railway dashboard

#### 2. Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database service is running
- Ensure migrations have been run

#### 3. Health Check Failures
- Verify the application starts successfully
- Check that port 3000 is exposed
- Review application logs for errors

#### 4. CORS Issues
- Set `CORS_ORIGIN` to your frontend domain
- Avoid using `*` in production

### Debug Commands

```bash
# Check environment variables
railway variables

# View logs
railway logs

# Connect to database
railway connect

# SSH into container (if needed)
railway shell
```

## Performance Optimization

### Resource Limits
Railway provides different resource tiers:
- **Hobby**: 512MB RAM, 1 vCPU
- **Pro**: 8GB RAM, 4 vCPU
- **Team**: Custom resources

### Database Optimization
- Use connection pooling (configured in `DatabaseService`)
- Monitor query performance
- Set up database backups

### Application Optimization
- Enable gzip compression
- Use CDN for static assets
- Monitor memory usage

## Security Considerations

### Environment Variables
- Never commit secrets to version control
- Use Railway's environment variable management
- Rotate secrets regularly

### Database Security
- Use strong passwords
- Enable SSL connections
- Restrict database access

### Application Security
- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting

## Scaling

### Horizontal Scaling
Railway supports horizontal scaling:
1. Go to your service settings
2. Adjust the number of replicas
3. Railway will automatically load balance

### Vertical Scaling
Upgrade your Railway plan for more resources:
1. Go to project settings
2. Select a higher tier plan
3. Restart your service

## Backup and Recovery

### Database Backups
Railway provides automatic database backups:
- Daily backups for Pro plans
- Point-in-time recovery
- Manual backup triggers

### Application Backups
- Keep your code in version control
- Document environment variables
- Test disaster recovery procedures

## Cost Optimization

### Resource Monitoring
- Monitor CPU and memory usage
- Scale down during low traffic periods
- Use Railway's cost analysis tools

### Database Optimization
- Use appropriate database sizes
- Monitor query performance
- Clean up unused data

## Support

### Railway Support
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway GitHub](https://github.com/railwayapp)

### Application Support
- Check application logs
- Review error monitoring
- Test locally with Railway environment variables

## Next Steps

After successful deployment:

1. **Test the API**: Verify all endpoints work correctly
2. **Set up monitoring**: Configure alerts and monitoring
3. **Configure domain**: Set up custom domain if needed
4. **Set up CI/CD**: Configure automatic deployments
5. **Monitor performance**: Track metrics and optimize

## Example Railway Configuration

Here's a complete example of environment variables for a production deployment:

```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Database (automatically set by Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# PayMongo (optional)
PAYMONGO_SECRET_KEY=sk_test_...
PAYMONGO_PUBLIC_KEY=pk_test_...
```

This configuration will get your Easy Picsy backend running on Railway with all the necessary services and optimizations for production use.
