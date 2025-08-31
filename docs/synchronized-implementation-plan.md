# Synchronized Implementation Plan - Frontend & Backend

This document synchronizes frontend and backend tasks to enable feature-by-feature testing. Each module can be developed and tested independently before moving to the next.

## Module 1: Foundation & Authentication
**Goal**: Basic app structure with authentication working end-to-end

### Backend Tasks
1. **Environment Configuration** (backend-tasks.md: 1.1)
   - Set up .env with required variables
   - Install @nestjs/config module
   - Create config service

2. **Database & Drizzle Setup** (backend-tasks.md: 1.2)
   - Install dependencies
   - Create database connection module
   - Set up migration scripts

3. **Supabase Auth Setup** (backend-tasks.md: 1.3)
   - Install @supabase/supabase-js
   - Create Supabase client service
   - Set up auth module structure
   - Create JWT verification middleware

4. **User Schema & Auth Module** (backend-tasks.md: 2.1 users, 3.1)
   - Create users table schema
   - Implement AuthGuard
   - Create auth endpoints (login, logout, verify)
   - GET /api/users/profile endpoint

### Frontend Tasks
1. **Admin Authentication Pages** (frontend-tasks.md: 1.1)
   - Login form with validation
   - Session management
   - Protected route middleware

2. **Admin Dashboard Layout** (frontend-tasks.md: 1.1)
   - Authenticated layout wrapper
   - Navigation sidebar/header
   - User profile dropdown

### Testing Checklist
- [ ] User can log in via frontend
- [ ] JWT token is stored and sent with requests
- [ ] Protected routes redirect to login when unauthenticated
- [ ] User profile displays in header
- [ ] Logout works correctly

---

## Module 2: Event Management (CRUD)
**Goal**: Complete event management without payment integration

### Backend Tasks
1. **Event Schema Creation** (backend-tasks.md: 2.1 events)
   - Create events table schema
   - Run migrations

2. **Events Module** (backend-tasks.md: 3.3)
   - Event DTOs with validation
   - Event service with business logic
   - CRUD endpoints:
     - POST /api/events
     - GET /api/events
     - GET /api/events/:id
     - PUT /api/events/:id
     - DELETE /api/events/:id

### Frontend Tasks
1. **Event Creation/Edit Form** (frontend-tasks.md: 1.2)
   - Form fields: name, price, description, currency
   - Form validation
   - Save/cancel actions

2. **Event List/Table Component** (frontend-tasks.md: 1.2)
   - Sortable table with event data
   - Action buttons (edit, delete)
   - Pagination
   - Search/filter

3. **Event Details View** (frontend-tasks.md: 1.2)
   - Event information display
   - Event statistics placeholder

### Testing Checklist
- [ ] Create new event via form
- [ ] View all events in table
- [ ] Edit existing event
- [ ] Delete event with confirmation
- [ ] Form validation works
- [ ] Pagination works for many events

---

## Module 3: Paymongo Integration & Dynamic QR Codes
**Goal**: Generate and manage dynamic payment QR codes for events with session-based regeneration

### Backend Tasks
1. **Payment Schema** (backend-tasks.md: 2.1 payments)
   - Create payments table schema
   - Add QR code tracking fields
   - Run migrations

2. **QR Code Management Schema** (backend-tasks.md: 2.1 qr_codes)
   - Create qr_codes table for tracking active QR codes
   - Include expiry timestamps and status tracking
   - Link to events and sessions

3. **Paymongo Service** (backend-tasks.md: 4.1)
   - Install Paymongo SDK
   - Create payment service with dynamic QR generation
   - Generate one-time use QR codes with 30-minute expiry
   - QR code expiry validation and cleanup

4. **Session-Based QR Generation** (backend-tasks.md: 4.4)
   - Generate QR code on session end
   - Invalidate previous QR codes
   - Track QR code lifecycle (active, expired, used)
   - Automatic cleanup of expired QR codes

5. **Update Event Endpoints** (backend-tasks.md: 3.3)
   - Modify POST /api/events to generate initial Paymongo QR
   - Add GET /api/events/:id/qr/current endpoint for active QR
   - Add POST /api/events/:id/qr/regenerate for manual regeneration
   - Add GET /api/qr-codes/:id/status for QR validation

### Frontend Tasks
1. **QR Code Status Monitoring** (frontend-tasks.md: 1.2, 5.1)
   - Display QR code status and expiry information
   - QR code expiry countdown display
   - Real-time QR status updates from backend

2. **QR Code Management Dashboard** (frontend-tasks.md: 5.2)
   - QR code expiry notifications
   - QR code history/tracking display
   - Manual QR regeneration trigger (API call only)
   - QR code usage analytics display

**Note**: QR code generation and display is handled by the desktop application

### Testing Checklist
- [ ] Creating event generates initial Paymongo QR code via API
- [ ] Desktop app can fetch current QR code via API
- [ ] QR code status displays correctly in web dashboard
- [ ] QR code regenerates on session end
- [ ] Expired QR codes are properly invalidated
- [ ] QR code status updates in real-time on web dashboard
- [ ] Manual QR regeneration API works correctly
- [ ] QR code contains correct payment information
- [ ] Multiple QR codes for same event are tracked properly
- [ ] Desktop app receives QR updates via WebSocket

---

## Module 4: Booth Management
**Goal**: Register and monitor booth connections

### Backend Tasks
1. **Booth Schema** (backend-tasks.md: 2.1 booths)
   - Create booths table schema
   - Run migrations

2. **Booths Module** (backend-tasks.md: 3.4)
   - Booth registration service
   - Booth endpoints:
     - POST /api/booths/register
     - GET /api/booths
     - GET /api/booths/:id
     - POST /api/booths/:id/ping

### Frontend Tasks
1. **Booth Status Dashboard** (frontend-tasks.md: 2.1)
   - Booth connection status grid
   - Active event per booth display
   - Last seen timestamp

2. **Booth Management UI** (frontend-tasks.md: 2.1)
   - Booth registration interface
   - Booth details view
   - Status indicators

### Testing Checklist
- [ ] Register new booth via API
- [ ] View all booths in dashboard
- [ ] Booth status updates on ping
- [ ] Offline booths show as disconnected

---

## Module 5: Real-time Communication
**Goal**: Enable live updates between backend and frontend

### Backend Tasks
1. **WebSocket Setup** (backend-tasks.md: 5.1)
   - Install Socket.io dependencies
   - Create WebSocket gateway
   - Implement auth for WebSocket

2. **SignalR Hub** (backend-tasks.md: 5.2)
   - Implement hub methods
   - Event broadcasting
   - Connection management

### Frontend Tasks
1. **SignalR Client Setup** (frontend-tasks.md: 3.1)
   - Connection setup and management
   - Auto-reconnection logic
   - Connection status indicators

2. **Real-time Features** (frontend-tasks.md: 3.2)
   - Live booth status updates
   - Real-time notifications

### Testing Checklist
- [ ] WebSocket connection establishes
- [ ] Booth status updates in real-time
- [ ] Connection status shows correctly
- [ ] Auto-reconnection works on disconnect

---

## Module 6: Payment Processing & Webhooks
**Goal**: Handle actual payments and unlock booths

### Backend Tasks
1. **Payment Endpoints** (backend-tasks.md: 4.2)
   - POST /api/payments/webhook/paymongo
   - GET /api/payments/history
   - Payment validation logic

2. **Payment Flow Integration** (backend-tasks.md: 4.3)
   - Link payments to events
   - Update booth status on payment
   - Broadcast unlock command via WebSocket

### Frontend Tasks
1. **Payment Activity Feed** (frontend-tasks.md: 2.2)
   - Live payment notifications
   - Payment details display
   - Revenue tracking

2. **Dashboard Updates** (frontend-tasks.md: 1.3)
   - Recent payment activity
   - Revenue metrics
   - Payment statistics

### Testing Checklist
- [ ] Paymongo webhook receives payment
- [ ] Payment appears in activity feed
- [ ] Booth receives unlock command
- [ ] Revenue metrics update
- [ ] Payment history displays correctly

---

## Module 7: Session Management
**Goal**: Track photobooth usage sessions

### Backend Tasks
1. **Session Schema** (backend-tasks.md: 2.1 sessions)
   - Create sessions table schema
   - Run migrations

2. **Sessions Module** (backend-tasks.md: 6.1)
   - Session service
   - Session endpoints:
     - POST /api/sessions/start
     - POST /api/sessions/:id/end
     - GET /api/sessions/active

3. **dslrBooth Integration** (backend-tasks.md: 6.2)
   - Webhook receiver for dslrBooth
   - Session lifecycle management

### Frontend Tasks
1. **Session Monitoring** (frontend-tasks.md: 2.1)
   - Active sessions display
   - Session history
   - Session duration tracking

### Testing Checklist
- [ ] Session starts on booth unlock
- [ ] Session ends on booth lock
- [ ] Active sessions display correctly
- [ ] Session history shows past usage

---

## Module 8: Analytics & Reporting
**Goal**: Provide business insights and metrics

### Backend Tasks
1. **Analytics Endpoints**
   - GET /api/analytics/revenue
   - GET /api/analytics/usage
   - GET /api/analytics/events

### Frontend Tasks
1. **Dashboard Metrics** (frontend-tasks.md: 1.3)
   - Revenue charts
   - Usage statistics
   - Event performance

### Testing Checklist
- [ ] Revenue metrics calculate correctly
- [ ] Usage statistics display
- [ ] Charts render with data

---

## Testing Strategy

### Unit Testing Order
1. Backend auth service
2. Backend event service
3. Frontend auth components
4. Frontend event components
5. Backend payment service
6. Backend booth service
7. Frontend real-time components

### Integration Testing Order
1. Auth flow (login → protected route → profile)
2. Event CRUD (create → list → edit → delete)
3. Payment flow (create event → generate QR → mock payment)
4. Booth registration (register → ping → status update)
5. Real-time updates (connect → receive updates)
6. Full payment cycle (payment → unlock → session → lock)

### E2E Testing Scenarios
1. **Happy Path**: Admin login → Create event → Download QR → Mock payment → Booth unlocks
2. **Multi-booth**: Multiple booths with different events
3. **Error Recovery**: Network disconnection → Reconnection → State sync
4. **Concurrent Payments**: Multiple payments for same event

---

## Development Schedule

### Week 1: Foundation
- Module 1: Authentication (Frontend + Backend)
- Module 2: Event Management (Frontend + Backend)

### Week 2: Payments
- Module 3: Paymongo Integration
- Module 4: Booth Management

### Week 3: Real-time
- Module 5: WebSocket/SignalR
- Module 6: Payment Processing

### Week 4: Polish
- Module 7: Session Management
- Module 8: Analytics
- Testing & Bug Fixes

---

## Environment Setup for Testing

### Backend (.env)
```env
# Minimal setup for module testing
DATABASE_URL=postgresql://localhost:5432/photobooth_dev
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PAYMONGO_SECRET_KEY=sk_test_xxxxx  # Test key for Module 3+
PORT=3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Success Metrics per Module

| Module | Backend API | Frontend UI | Integration | Test Coverage |
|--------|------------|-------------|-------------|---------------|
| Auth | ✅ Working endpoints | ✅ Login/Logout | ✅ JWT flow | 80%+ |
| Events | ✅ CRUD operations | ✅ Forms/Tables | ✅ Data sync | 80%+ |
| Payments | ✅ QR generation | ✅ QR display | ✅ Paymongo | 70%+ |
| Booths | ✅ Registration | ✅ Status grid | ✅ Updates | 70%+ |
| Real-time | ✅ WebSocket | ✅ Live updates | ✅ Connected | 60%+ |
| Sessions | ✅ Tracking | ✅ Display | ✅ Lifecycle | 60%+ |

---

## Notes
- Each module should be fully testable before moving to the next
- Frontend and backend tasks for each module should be developed in parallel
- Use mock data for modules that depend on incomplete features
- Run integration tests after completing each module
- Keep both frontend and backend servers running during development