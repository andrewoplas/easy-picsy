# Railway Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation
- [x] Dockerfile created and optimized for Railway
- [x] nixpacks.toml configuration added
- [x] Health check endpoint implemented (`/health`)
- [x] Graceful shutdown handling added
- [x] Environment configuration updated
- [x] Startup script created
- [x] Package.json scripts added
- [x] Railway configuration files created

### ✅ Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `DATABASE_URL` (Railway PostgreSQL)
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `JWT_SECRET`
- [ ] `JWT_EXPIRATION=7d`
- [ ] `CORS_ORIGIN` (your frontend domain)
- [ ] `PAYMONGO_SECRET_KEY` (optional)
- [ ] `PAYMONGO_PUBLIC_KEY` (optional)

### ✅ Database Setup
- [ ] PostgreSQL service added to Railway project
- [ ] Database migrations ready
- [ ] Connection string verified

## Deployment Steps

### 1. Create Railway Project
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Click "Deploy from GitHub Repo"
- [ ] Select your Easy Picsy repository
- [ ] Choose `apps/backend` as root directory

### 2. Add PostgreSQL Database
- [ ] In Railway project, click "New"
- [ ] Select "Database" → "PostgreSQL"
- [ ] Wait for database to be provisioned
- [ ] Note the `DATABASE_URL` environment variable

### 3. Configure Environment Variables
- [ ] Go to your service settings
- [ ] Add all required environment variables
- [ ] Use the template from `railway.env.example`

### 4. Deploy
- [ ] Railway will automatically build and deploy
- [ ] Monitor build logs for any errors
- [ ] Check health check endpoint: `https://your-app.railway.app/health`

### 5. Run Database Migrations
- [ ] Connect to your database
- [ ] Run migrations manually or via startup script
- [ ] Verify tables are created

### 6. Test Deployment
- [ ] Test health endpoint: `GET /health`
- [ ] Test API endpoints
- [ ] Verify WebSocket connections
- [ ] Check logs for any errors

## Post-Deployment Verification

### ✅ Health Check
- [ ] Health endpoint returns 200 OK
- [ ] Response includes status, timestamp, uptime
- [ ] No errors in health check logs

### ✅ API Functionality
- [ ] Authentication endpoints work
- [ ] Event CRUD operations work
- [ ] QR code generation works
- [ ] WebSocket connections work
- [ ] Payment integration works (if configured)

### ✅ Database
- [ ] All tables created successfully
- [ ] Database connections stable
- [ ] Migrations applied correctly

### ✅ Monitoring
- [ ] Logs are visible in Railway dashboard
- [ ] No critical errors in logs
- [ ] Performance metrics look good
- [ ] Health checks passing

## Troubleshooting

### Common Issues
- **Build fails**: Check dependencies and TypeScript compilation
- **Health check fails**: Verify port 3000 is exposed and app starts
- **Database connection fails**: Check DATABASE_URL and credentials
- **CORS errors**: Verify CORS_ORIGIN is set correctly

### Debug Commands
```bash
# Check environment variables
railway variables

# View logs
railway logs

# Connect to database
railway connect

# Restart service
railway redeploy
```

## Security Checklist

### ✅ Environment Security
- [ ] No secrets in code
- [ ] All secrets in Railway environment variables
- [ ] Strong JWT secret generated
- [ ] Database credentials secure

### ✅ Application Security
- [ ] CORS configured for production domain
- [ ] HTTPS enabled (Railway default)
- [ ] Input validation enabled
- [ ] Error handling doesn't expose sensitive data

## Performance Checklist

### ✅ Resource Optimization
- [ ] Appropriate Railway plan selected
- [ ] Database connection pooling configured
- [ ] Memory usage monitored
- [ ] CPU usage within limits

### ✅ Application Optimization
- [ ] Production build optimized
- [ ] Unnecessary files excluded (.railwayignore)
- [ ] Logging level appropriate for production
- [ ] Health checks efficient

## Success Criteria

Your deployment is successful when:
- [ ] Health endpoint returns 200 OK
- [ ] All API endpoints respond correctly
- [ ] Database operations work
- [ ] WebSocket connections work
- [ ] No critical errors in logs
- [ ] Application handles traffic properly

## Next Steps After Deployment

1. **Set up monitoring**: Configure alerts and monitoring
2. **Configure domain**: Set up custom domain if needed
3. **Set up CI/CD**: Configure automatic deployments
4. **Performance testing**: Load test your application
5. **Backup strategy**: Ensure database backups are working
6. **Documentation**: Update deployment docs with any customizations

## Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Easy Picsy Backend Docs](./railway-deployment.md)
