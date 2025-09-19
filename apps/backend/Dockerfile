# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    postgresql-client

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY tsconfig.json ./

# Copy workspace dependencies
COPY libs/ ./libs/

# Copy backend source
COPY apps/backend/package*.json ./apps/backend/
COPY apps/backend/tsconfig*.json ./apps/backend/
COPY apps/backend/webpack.config.js ./apps/backend/
COPY apps/backend/src/ ./apps/backend/src/

# Install dependencies
RUN npm ci --only=production

# Build the application
RUN cd apps/backend && npm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port (Railway will set PORT environment variable)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "apps/backend/dist/main.js"]
