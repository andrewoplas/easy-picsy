# Backend Implementation Tasks

## Overview
This document tracks the backend implementation tasks for the Photobooth Payment System. Tasks are organized by sequence and dependencies.

## Technology Stack
- **Framework**: NestJS
- **Database**: PostgreSQL (via Supabase or standalone)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **Payment Provider**: Paymongo
- **Real-time**: Socket.io / SignalR
- **Environment**: Node.js

## Task Tracking

### Phase 1: Foundation Setup
**Priority: Critical | Status: Not Started**

- [ ] **1.1 Environment Configuration**
  - [ ] Create `.env.example` template
  - [ ] Set up `.env` with required variables:
    - DATABASE_URL
    - SUPABASE_URL
    - SUPABASE_ANON_KEY
    - SUPABASE_SERVICE_KEY
    - PAYMONGO_SECRET_KEY
    - PAYMONGO_PUBLIC_KEY
  - [ ] Install @nestjs/config module
  - [ ] Create config service for environment variables

- [ ] **1.2 Database & Drizzle Setup**
  - [ ] Install dependencies: `drizzle-orm postgres drizzle-kit @types/pg`
  - [ ] Create `drizzle.config.ts` for migrations
  - [ ] Set up database connection module
  - [ ] Create `src/db/` directory structure
  - [ ] Configure migration scripts in package.json

- [ ] **1.3 Supabase Auth Setup**
  - [ ] Install `@supabase/supabase-js`
  - [ ] Create Supabase client service
  - [ ] Set up auth module structure
  - [ ] Create JWT verification middleware

### Phase 2: Database Schema Design
**Priority: Critical | Status: Not Started**

- [ ] **2.1 Create Drizzle Schemas**
  - [ ] `src/db/schema/users.ts` - User profiles
    ```typescript
    - id (uuid, primary key)
    - supabase_id (uuid, unique)
    - email (string)
    - role (enum: admin, operator)
    - created_at (timestamp)
    - updated_at (timestamp)
    ```
  
  - [ ] `src/db/schema/events.ts` - Event management
    ```typescript
    - id (uuid, primary key)
    - name (string)
    - description (text)
    - price (decimal)
    - currency (string, default: PHP)
    - qr_code_url (string)
    - is_active (boolean)
    - created_by (uuid, foreign key)
    - created_at (timestamp)
    - updated_at (timestamp)
    ```
  
  - [ ] `src/db/schema/booths.ts` - Booth registration
    ```typescript
    - id (uuid, primary key)
    - booth_code (string, unique)
    - name (string)
    - location (string)
    - status (enum: online, offline, busy)
    - last_ping (timestamp)
    - created_at (timestamp)
    ```
  
  - [ ] `src/db/schema/payments.ts` - Payment records
    ```typescript
    - id (uuid, primary key)
    - event_id (uuid, foreign key)
    - booth_id (uuid, foreign key)
    - amount (decimal)
    - currency (string)
    - status (enum: pending, completed, failed, refunded)
    - paymongo_payment_id (string)
    - paymongo_reference (string)
    - payment_method (string)
    - paid_at (timestamp)
    - created_at (timestamp)
    ```
  
  - [ ] `src/db/schema/sessions.ts` - Booth sessions
    ```typescript
    - id (uuid, primary key)
    - booth_id (uuid, foreign key)
    - event_id (uuid, foreign key)
    - payment_id (uuid, foreign key)
    - start_time (timestamp)
    - end_time (timestamp)
    - status (enum: active, completed, cancelled)
    - created_at (timestamp)
    ```

- [ ] **2.2 Database Migrations**
  - [ ] Create initial migration
  - [ ] Test migration up/down
  - [ ] Set up seed data script

### Phase 3: Core Modules Implementation
**Priority: High | Status: Not Started**

- [ ] **3.1 Auth Module**
  - [ ] Create `src/modules/auth/` structure
  - [ ] Implement AuthGuard for route protection
  - [ ] Create CurrentUser decorator
  - [ ] Implement role-based access control (RBAC)
  - [ ] Create auth strategy for Supabase JWT
  - [ ] Add public route decorator

- [ ] **3.2 Users Module**
  - [ ] Create `src/modules/users/` structure
  - [ ] User service with Drizzle queries
  - [ ] User controller with CRUD endpoints
  - [ ] GET /api/users/profile (current user)
  - [ ] PUT /api/users/profile (update profile)

- [ ] **3.3 Events Module**
  - [ ] Create `src/modules/events/` structure
  - [ ] Event DTOs with class-validator
  - [ ] Event service with business logic
  - [ ] Event controller with endpoints:
    - [ ] POST /api/events (admin only)
    - [ ] GET /api/events (authenticated)
    - [ ] GET /api/events/:id (authenticated)
    - [ ] PUT /api/events/:id (admin only)
    - [ ] DELETE /api/events/:id (admin only)
    - [ ] POST /api/events/:id/activate (admin only)
    - [ ] POST /api/events/:id/deactivate (admin only)
  - [ ] QR code generation service

- [ ] **3.4 Booths Module**
  - [ ] Create `src/modules/booths/` structure
  - [ ] Booth registration service
  - [ ] Booth controller with endpoints:
    - [ ] POST /api/booths/register
    - [ ] GET /api/booths (admin only)
    - [ ] GET /api/booths/:id
    - [ ] PUT /api/booths/:id
    - [ ] POST /api/booths/:id/ping (heartbeat)
    - [ ] DELETE /api/booths/:id (admin only)

### Phase 4: Payment Integration
**Priority: High | Status: Not Started**

- [ ] **4.1 Paymongo Service**
  - [ ] Create `src/modules/payments/` structure
  - [ ] Install Paymongo SDK or create HTTP client
  - [ ] Implement payment service:
    - [ ] Create payment intent
    - [ ] Generate QR payment
    - [ ] Check payment status
    - [ ] Process refunds
  - [ ] Webhook signature validation

- [ ] **4.2 Payment Endpoints**
  - [ ] POST /api/payments/create-session
  - [ ] GET /api/payments/:id/status
  - [ ] POST /api/payments/webhook/paymongo (public)
  - [ ] GET /api/payments/history (authenticated)
  - [ ] POST /api/payments/:id/refund (admin only)

- [ ] **4.3 Payment Flow Integration**
  - [ ] Link payments to events
  - [ ] Validate payment amounts
  - [ ] Update booth status on payment
  - [ ] Create session records

### Phase 5: Real-time Communication
**Priority: Medium | Status: Not Started**

- [ ] **5.1 WebSocket Setup**
  - [ ] Install `@nestjs/websockets @nestjs/platform-socket.io socket.io`
  - [ ] Create WebSocket gateway
  - [ ] Implement authentication for WebSocket connections
  - [ ] Create room management for booths

- [ ] **5.2 SignalR Hub Implementation**
  - [ ] Create `src/modules/realtime/` structure
  - [ ] Implement hub methods:
    - [ ] RegisterBooth(boothId, eventId)
    - [ ] UnregisterBooth(boothId)
    - [ ] UnlockBooth(sessionId)
    - [ ] LockBooth(boothId)
    - [ ] SessionStarted(sessionId)
    - [ ] SessionEnded(sessionId)
    - [ ] PaymentReceived(paymentId)
  - [ ] Event broadcasting to specific booths

- [ ] **5.3 Bridge Communication Protocol**
  - [ ] Define message formats
  - [ ] Implement acknowledgment system
  - [ ] Add retry logic for failed messages
  - [ ] Connection status monitoring

### Phase 6: Sessions Management
**Priority: Medium | Status: Not Started**

- [ ] **6.1 Sessions Module**
  - [ ] Create `src/modules/sessions/` structure
  - [ ] Session service with state management
  - [ ] Session controller endpoints:
    - [ ] POST /api/sessions/start
    - [ ] POST /api/sessions/:id/end
    - [ ] GET /api/sessions/active
    - [ ] GET /api/sessions/history
  - [ ] Auto-timeout for abandoned sessions

- [ ] **6.2 dslrBooth Integration**
  - [ ] Webhook receiver for dslrBooth events
  - [ ] POST /api/webhooks/dslrbooth (local only)
  - [ ] Handle session lifecycle events
  - [ ] File upload tracking

### Phase 7: Security & Monitoring
**Priority: Medium | Status: Not Started**

- [ ] **7.1 Security Hardening**
  - [ ] Install and configure Helmet
  - [ ] Set up CORS properly
  - [ ] Implement rate limiting (@nestjs/throttler)
  - [ ] Add request validation pipes
  - [ ] SQL injection prevention with Drizzle
  - [ ] Input sanitization

- [ ] **7.2 Logging & Monitoring**
  - [ ] Set up Winston or Pino logger
  - [ ] Structured logging format
  - [ ] Error tracking service integration
  - [ ] Performance monitoring
  - [ ] Database query logging

- [ ] **7.3 Health Checks**
  - [ ] GET /api/health (public)
  - [ ] GET /api/health/ready (public)
  - [ ] Database connection check
  - [ ] External service checks (Supabase, Paymongo)

### Phase 8: Testing
**Priority: Medium | Status: Not Started**

- [ ] **8.1 Unit Tests**
  - [ ] Auth service tests
  - [ ] Event service tests
  - [ ] Payment service tests
  - [ ] Booth service tests
  - [ ] Session service tests

- [ ] **8.2 Integration Tests**
  - [ ] API endpoint tests
  - [ ] Database operation tests
  - [ ] WebSocket connection tests
  - [ ] Payment flow tests

- [ ] **8.3 E2E Tests**
  - [ ] Complete payment flow
  - [ ] Booth registration and operation
  - [ ] Session lifecycle
  - [ ] Error scenarios

### Phase 9: Documentation
**Priority: Low | Status: Not Started**

- [ ] **9.1 API Documentation**
  - [ ] Set up Swagger/OpenAPI
  - [ ] Document all endpoints
  - [ ] Add request/response examples
  - [ ] Authentication documentation

- [ ] **9.2 WebSocket Documentation**
  - [ ] Event descriptions
  - [ ] Message formats
  - [ ] Connection requirements
  - [ ] Error codes

- [ ] **9.3 Deployment Documentation**
  - [ ] Environment setup guide
  - [ ] Database migration guide
  - [ ] Production checklist
  - [ ] Troubleshooting guide

### Phase 10: Deployment Preparation
**Priority: Low | Status: Not Started**

- [ ] **10.1 Build Configuration**
  - [ ] Optimize build process
  - [ ] Set up production build script
  - [ ] Environment-specific configs
  - [ ] Docker containerization (optional)

- [ ] **10.2 Performance Optimization**
  - [ ] Database query optimization
  - [ ] Caching strategy
  - [ ] Connection pooling
  - [ ] Response compression

- [ ] **10.3 Production Readiness**
  - [ ] Security audit
  - [ ] Load testing
  - [ ] Backup strategy
  - [ ] Monitoring setup
  - [ ] CI/CD pipeline

## Dependencies Between Phases

```mermaid
graph TD
    Phase1[Phase 1: Foundation] --> Phase2[Phase 2: Database Schema]
    Phase2 --> Phase3[Phase 3: Core Modules]
    Phase3 --> Phase4[Phase 4: Payment Integration]
    Phase3 --> Phase5[Phase 5: Real-time Communication]
    Phase4 --> Phase6[Phase 6: Sessions Management]
    Phase5 --> Phase6
    Phase6 --> Phase7[Phase 7: Security & Monitoring]
    Phase7 --> Phase8[Phase 8: Testing]
    Phase8 --> Phase9[Phase 9: Documentation]
    Phase9 --> Phase10[Phase 10: Deployment]
```

## Quick Start Commands

```bash
# Install all dependencies
npm install drizzle-orm postgres drizzle-kit @supabase/supabase-js @nestjs/config @nestjs/websockets @nestjs/platform-socket.io socket.io helmet @nestjs/throttler class-validator class-transformer qrcode

# Install dev dependencies
npm install -D @types/pg @types/qrcode

# Database commands
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
npm run db:studio    # Open Drizzle Studio

# Development
npm run start:dev    # Start in development mode
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

## Environment Variables Template

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/photobooth_db

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Paymongo
PAYMONGO_SECRET_KEY=sk_test_xxxxx
PAYMONGO_PUBLIC_KEY=pk_test_xxxxx
PAYMONGO_WEBHOOK_SECRET=whsk_xxxxx

# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGINS=http://localhost:3001,http://localhost:4200

# WebSocket
WS_PORT=3001

# Bridge Communication
BRIDGE_API_KEY=your-bridge-api-key
```

## Progress Tracking

| Phase | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Phase 1 | 11 | 0 | 0% |
| Phase 2 | 5 | 0 | 0% |
| Phase 3 | 25 | 0 | 0% |
| Phase 4 | 12 | 0 | 0% |
| Phase 5 | 11 | 0 | 0% |
| Phase 6 | 8 | 0 | 0% |
| Phase 7 | 12 | 0 | 0% |
| Phase 8 | 11 | 0 | 0% |
| Phase 9 | 10 | 0 | 0% |
| Phase 10 | 10 | 0 | 0% |
| **Total** | **115** | **0** | **0%** |

## Notes

- Tasks should be completed in sequence within each phase
- Some phases can be worked on in parallel (see dependency graph)
- Update task status as: Not Started → In Progress → Completed
- Add comments or issues encountered below each task as needed
- Review and update time estimates based on actual progress

---

*Last Updated: [Current Date]*
*Next Review: [Review Date]*