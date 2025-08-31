# Frontend Tasks - Photobooth Payment System

## Project Overview
Frontend implementation for a cashless payment system that integrates with dslrBooth installations. The system consists of an admin web application for event management and booth monitoring. Payment is handled directly through Paymongo QR codes that guests scan with their existing e-wallet apps.

## Current State Analysis
- **Architecture**: Nx monorepo with Next.js 15 frontend and NestJS backend
- **Existing Frontend**: Landing page with GSAP animations, blog functionality, Tailwind CSS
- **UI Framework**: Radix UI components, existing button/card components
- **Location**: `/apps/frontend/src/`

## Payment Flow Clarification
1. **Admin creates event** → Paymongo generates payment QR code
2. **Admin downloads QR image** → adds to dslrBooth lock screen background
3. **Guest scans QR code** → opens e-wallet app directly (GCash/PayMaya)
4. **Guest pays in e-wallet** → Paymongo processes payment
5. **Paymongo webhook** → notifies backend → unlocks booth

**Note**: No mobile payment interface needed - payment happens in existing e-wallet apps!

## Frontend Implementation Tasks

### Phase 1: Core Event Management UI (Admin Web Application)

#### 1.1 Authentication & Layout
- [ ] **Admin Authentication Pages**
  - Login form with validation
  - Password reset functionality  
  - Session management
  - Protected route middleware

- [ ] **Admin Dashboard Layout**
  - Authenticated layout wrapper
  - Navigation sidebar/header
  - Breadcrumb navigation
  - User profile dropdown

#### 1.2 Event Management Interface
- [ ] **Event Creation/Edit Form**
  - Form fields: name, price, description, currency
  - Form validation (required fields, price format)
  - Paymongo payment QR generation integration
  - Save/cancel actions
  - Success/error feedback

- [ ] **Event List/Table Component**
  - Sortable table with event data
  - Action buttons (edit, delete, activate/deactivate)
  - QR code download buttons
  - Pagination for large event lists
  - Search/filter functionality

- [ ] **Event Details View**
  - Event information display
  - Paymongo QR code preview
  - Download QR code as image functionality
  - Event statistics (payments, sessions)
  - Payment history for the event

#### 1.3 Dashboard Overview
- [ ] **Dashboard Home Page**
  - Key metrics cards (total events, active booths, revenue)
  - Recent payment activity feed
  - Quick actions panel (create event, download QRs)
  - Event status overview

### Phase 2: Booth Monitoring & Management

#### 2.1 Booth Status Interface
- [ ] **Booth Status Dashboard**
  - Live booth connection status grid
  - Active event per booth display
  - Last payment timestamp
  - Session status (locked/unlocked/active)

#### 2.2 Real-time Payment Monitoring
- [ ] **Payment Activity Feed**
  - Live payment notifications
  - Payment details (amount, booth, timestamp)
  - Success/failure status indicators
  - Revenue tracking per event/booth

### Phase 3: Real-time Communication

#### 3.1 SignalR Client Setup
- [ ] **SignalR Client Configuration**
  - Connection setup and management
  - Auto-reconnection logic
  - Connection status indicators

#### 3.2 Real-time Features
- [ ] **Booth Status Monitoring**
  - Live booth connection status
  - Real-time payment notifications
  - Session start/end indicators

- [ ] **Admin Real-time Dashboard**
  - Live payment activity feed
  - Booth status grid view
  - Real-time revenue updates

### Phase 4: API Integration & State Management

#### 4.1 API Client Layer
- [ ] **Event Management APIs**
  - `POST /api/events` - Create event with Paymongo QR
  - `GET /api/events` - List events
  - `PUT /api/events/:id` - Update event
  - `DELETE /api/events/:id` - Delete event
  - `GET /api/events/:id/qr` - Download QR code image

- [ ] **Payment Monitoring APIs**
  - `GET /api/payments` - List payments
  - `GET /api/payments/:eventId` - Event payment history
  - Paymongo webhook endpoints

- [ ] **SignalR Hub Methods**
  - `RegisterBooth(boothId)` - Bridge registration
  - `UnlockBooth(sessionId)` - Unlock command
  - `LockBooth()` - Lock command
  - `SessionEnded(data)` - Session completion

#### 4.2 State Management
- [ ] **Event State Management**
  - Event CRUD operations
  - Active event tracking
  - QR code management

- [ ] **Payment Monitoring State**
  - Live payment tracking
  - Payment history
  - Revenue analytics

- [ ] **Real-time State**
  - Booth connection states
  - Live payment notifications
  - Session activity tracking

### Phase 5: UI Components & Utilities

#### 5.1 Core Components
- [ ] **QR Code Display Component**
  - Paymongo QR code rendering
  - Download functionality
  - Preview and print options

- [ ] **Event Card Component**
  - Event information display
  - Action buttons (edit, download QR, delete)
  - Status indicators

- [ ] **Booth Status Component**
  - Connection status indicators
  - Active event display
  - Session status

#### 5.2 Form Components
- [ ] **Event Form Component**
  - Reusable for create/edit
  - Validation integration
  - Paymongo integration for QR generation

#### 5.3 Layout Components
- [ ] **Admin Layout Component**
  - Sidebar navigation
  - Header with user menu
  - Responsive design

- [ ] **Dashboard Grid Layout**
  - Responsive grid system
  - Card-based layout
  - Real-time data display

### Phase 6: Integration & Testing

#### 6.1 Backend Integration
- [ ] **Next.js API Routes**
  - Event management endpoints
  - Paymongo webhook handlers
  - SignalR hub integration

#### 6.2 Error Handling
- [ ] **Global Error Handling**
  - API error interceptors
  - User-friendly error messages
  - Retry mechanisms

- [ ] **Validation & Security**
  - Input validation
  - XSS protection
  - CSRF protection

#### 6.3 Testing
- [ ] **Component Testing**
  - Unit tests for admin components
  - Integration tests for event management
  - E2E tests for critical admin flows

## Technical Specifications

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS (existing setup)
- **Components**: Radix UI + custom components
- **Real-time**: SignalR JavaScript client
- **Payments**: Paymongo API integration (QR generation only)
- **State Management**: React hooks + Context API
- **Animations**: GSAP (already integrated)
- **Testing**: Jest + React Testing Library + Playwright

### File Structure
```
apps/frontend/src/
├── app/
│   ├── admin/                    # Admin dashboard pages
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── booths/
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── events/
│   │   ├── payments/
│   │   └── webhooks/
│   └── globals.css
├── components/
│   ├── admin/                    # Admin-specific components
│   ├── ui/                       # Shared UI components
│   └── layout/                   # Layout components
├── hooks/
│   ├── useSignalR.ts
│   ├── useEvents.ts
│   └── useBooths.ts
├── lib/
│   ├── api.ts                    # API client
│   ├── signalr.ts                # SignalR setup
│   └── paymongo.ts               # QR code integration
└── types/
    ├── events.ts
    ├── payments.ts
    ├── booths.ts
    └── api.ts
```

### Key Data Structures

#### Event Structure
```typescript
interface Event {
  eventId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isActive: boolean;
  paymongoQRCode: string;        // Paymongo QR code data
  qrCodeImageUrl: string;        // Downloadable QR image
  createdAt: string;
  updatedAt: string;
}
```

#### Payment Record Structure
```typescript
interface PaymentRecord {
  paymentId: string;
  eventId: string;
  boothId: string;
  amount: number;
  status: 'success' | 'failed';
  paymentMethod: 'gcash' | 'paymaya' | 'qr_ph';
  paymongoReference: string;
  createdAt: string;
}
```

#### Booth Status Structure
```typescript
interface BoothStatus {
  boothId: string;
  isConnected: boolean;
  currentEvent: string | null;
  lastPayment: string | null;
  sessionActive: boolean;
  lastSeen: string;
}
```

## Development Phases Timeline

- **Phase 1**: Event management UI (Week 5)
- **Phase 2**: Booth monitoring dashboard (Week 5-6)
- **Phase 3**: Real-time features (Week 6)  
- **Phase 4**: API integration (Week 6-7)
- **Phase 5**: Component library (Week 7)
- **Phase 6**: Testing and integration (Week 7-8)

## Dependencies to Add

```json
{
  "@microsoft/signalr": "^8.0.0",
  "paymongo": "^1.0.0",
  "zod": "^3.22.4",
  "react-hook-form": "^7.48.0",
  "@hookform/resolvers": "^3.3.0",
  "date-fns": "^2.30.0"
}
```

## Success Criteria

- [ ] Admin can create, edit, and manage events
- [ ] Paymongo QR codes generate correctly for events
- [ ] QR code images can be downloaded for dslrBooth integration
- [ ] Real-time booth status monitoring works
- [ ] Payment tracking and analytics display correctly
- [ ] Error handling provides clear user feedback
- [ ] Performance meets requirements (< 500ms API responses)
- [ ] UI is responsive and accessible
- [ ] SignalR communication with bridge apps functions properly