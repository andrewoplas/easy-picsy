# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for building (including Python for native modules)
RUN apk add --no-cache python3 make g++

# Copy workspace package files
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY libs/commons/package*.json ./libs/commons/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npx nx build commons && npx nx build backend --configuration=production

# Production stage
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy the entire built workspace structure
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/libs/commons ./libs/commons
COPY --from=base /app/apps/backend/dist ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "main.js"]