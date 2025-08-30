# Photobooth Payment System - Implementation Guide

## Project Overview

This document outlines the implementation plan for a cashless payment system that integrates with existing dslrBooth installations. The system allows photobooth operators to accept digital payments via QR codes while maintaining their current dslrBooth workflow.

## Architecture Overview

### System Components
1. **Web Application** - Event management and QR code generation
2. **C# Bridge Application** - Local integration with dslrBooth
3. **Cloud Backend** - Payment processing and communication hub
4. **dslrBooth Integration** - API calls and webhook monitoring

### Technology Stack
- **Backend**: NextJS + SignalR
- **Bridge App**: C# .NET 6 + Windows Forms
- **Database**: PostgreSQL
- **Payment Provider**: Paymongo (QR Ph, GCash, PayMaya)
- **Communication**: WebSocket (SignalR) for real-time updates

## User Flows

### Admin Setup Flow
```
1. Admin logs into web app
2. Creates event with details (name, price, description)
3. System generates unique QR code for event
4. Admin downloads QR code graphic
5. Admin adds QR code to dslrBooth lock screen background
6. Admin manually selects active event in Bridge UI
7. Admin starts corresponding event in dslrBooth
```

### Guest Payment Flow
```
1. Guest approaches locked booth
2. Scans QR code from lock screen
3. Redirected to mobile payment page
4. Completes payment via GCash/PayMaya/etc
5. Bridge receives payment notification
6. Bridge validates payment matches selected event
7. Bridge calls dslrBooth API to unlock booth
8. Guest uses booth normally
9. Session completes → dslrBooth sends webhook
10. Bridge locks booth again
```

## Implementation Details

### 1. Cloud Backend (Node.js)

**Key Components:**
- **Event Management API**: CRUD operations for events
- **Payment Integration**: Paymongo webhook handling
- **SignalR Hub**: Real-time communication with bridge apps
- **QR Code Generation**: Dynamic QR codes with event metadata

**Core APIs:**
```javascript
POST /api/events              // Create new event
GET  /api/events              // List all events  
POST /api/create-session      // Generate payment QR
POST /webhook/paymongo        // Payment completion webhook
```

**SignalR Hub Methods:**
```javascript
RegisterBooth(boothId)        // Bridge registers with cloud
UnlockBooth(sessionId)        // Command to unlock specific booth
LockBooth()                   // Command to lock booth
SessionEnded(data)            // Bridge reports session completion
```

### 2. C# Bridge Application

**Architecture:**
- **Console Application** with Windows Forms UI
- **Background Service** for webhook monitoring
- **HTTP Client** for dslrBooth API calls
- **SignalR Client** for cloud communication

**Key Classes:**
```csharp
class Program                 // Entry point and service coordination
class BridgeService          // Core business logic
class BridgeUI               // Windows Forms interface
class DslrBoothApiClient     // HTTP client for dslrBooth
class CloudSignalRClient     // SignalR communication
class WebhookServer          // Local HTTP server for dslrBooth webhooks
```

**UI Components:**
- **Event Selector**: Dropdown populated from cloud API
- **Status Indicators**: Connection status, last payment, active event
- **System Tray Integration**: Minimize to tray, right-click menu
- **Event Refresh**: Manual sync with cloud events

### 3. Event Management System

**Event Data Structure:**
```json
{
  "eventId": "evt_12345",
  "name": "Sarah's Wedding",
  "description": "Wedding celebration booth",
  "price": 50.00,
  "currency": "PHP",
  "isActive": true,
  "qrCodeUrl": "https://app.com/pay?event=evt_12345",
  "createdAt": "2025-08-31T10:00:00Z"
}
```

**Event-Bridge Mapping:**
- Bridge polls cloud API for available events
- Operator selects active event from dropdown
- Bridge registers with cloud using "boothId-eventId" pattern
- Payment validation ensures event match before unlock

### 4. dslrBooth Integration

**API Integration:**
```csharp
// Unlock booth
POST http://localhost:8080/api/exit-lock
{
  "password": "dslr_api_password"
}

// Lock booth  
POST http://localhost:8080/api/show-lock
{
  "password": "dslr_api_password"
}
```

**Webhook Integration:**
Bridge runs local HTTP server on port 3001 to receive dslrBooth webhooks:
- `session_start` - Log session beginning
- `file_upload` - Extract event name for validation  
- `session_end` - Trigger booth lock

**dslrBooth Configuration:**
- Enable API: Settings > General > API
- Set webhook URL: http://localhost:3001/dslrbooth-webhook
- Configure webhook events: session_start, file_upload, session_end

### 5. Payment Processing

**Payment Flow:**
1. QR code contains: `https://app.com/pay?event=evt_12345&booth=booth_001`
2. Payment page loads with event details and pricing
3. Paymongo payment intent created with event metadata
4. Guest completes payment via mobile wallet
5. Paymongo webhook confirms payment
6. Cloud backend routes unlock command to specific bridge

**Payment Validation:**
- Event ID in payment must match bridge's selected event
- Booth ID must match registered bridge
- Payment amount must match event pricing
- Payment must be successful status

### 6. Error Handling & Edge Cases

**Network Connectivity:**
- Bridge auto-reconnects to cloud on connection loss
- Queue payment notifications during offline periods
- Graceful degradation if dslrBooth API unavailable

**Payment Failures:**
- Invalid event ID → clear error message to user
- Booth offline → payment refund process
- Wrong event selected → reject with operator notification

**dslrBooth Integration Issues:**
- API password mismatch → alert in bridge UI
- Webhook server down → restart mechanism
- Session timeout → auto-lock after configured period

## Deployment Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │  Cloud Backend  │    │    Database     │
│   (Frontend)    │◄──►│   (Node.js)     │◄──►│ (PostgreSQL)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               ▲
                               │ SignalR/WebSocket
                               ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  C# Bridge App  │◄──►│   dslrBooth     │
                       │ (Booth Computer)│    │   Software      │
                       └─────────────────┘    └─────────────────┘
```

### Bridge App Deployment
- **Installation**: Single executable (.exe) with setup script
- **Configuration**: Environment variables or config file
- **Auto-start**: Windows service or startup folder
- **Updates**: Manual download or auto-updater mechanism

## Development Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Cloud backend with event CRUD APIs
- [ ] Basic SignalR hub for communication
- [ ] C# bridge console application structure
- [ ] dslrBooth API integration testing

### Phase 2: Payment Integration (Week 3-4)  
- [ ] Paymongo payment flow implementation
- [ ] QR code generation with event metadata
- [ ] Payment webhook processing
- [ ] Bridge payment validation logic

### Phase 3: UI Development (Week 5)
- [ ] Windows Forms interface for bridge
- [ ] Event selection and status display
- [ ] System tray integration
- [ ] Error handling and user feedback

### Phase 4: Testing & Deployment (Week 6-7)
- [ ] End-to-end testing with real dslrBooth setup
- [ ] Error scenario testing
- [ ] Performance optimization
- [ ] Deployment packaging and documentation

### Phase 5: Production Readiness (Week 8)
- [ ] Production environment setup
- [ ] Monitoring and logging implementation
- [ ] User documentation and training materials
- [ ] Go-live with initial customer

## Security Considerations

### API Security
- **Authentication**: API keys for cloud communication
- **HTTPS**: All external communication encrypted
- **Webhook Validation**: Verify Paymongo webhook signatures
- **Rate Limiting**: Prevent API abuse

### Bridge Application
- **Local Access Only**: dslrBooth API only accessible locally
- **Configuration Encryption**: Sensitive settings encrypted
- **Auto-lock Timeout**: Prevent unauthorized booth access
- **Audit Logging**: Track all booth operations

## Performance Requirements

### Bridge Application
- **Memory Usage**: < 50MB total footprint
- **CPU Usage**: < 5% during idle, < 10% during operations  
- **Startup Time**: < 3 seconds to full operation
- **Response Time**: < 1 second from payment to unlock

### Cloud Backend
- **Response Time**: < 500ms for API calls
- **Throughput**: Support 100+ concurrent booths
- **Uptime**: 99.9% availability target
- **Payment Processing**: < 3 seconds end-to-end

## Monitoring & Analytics

### Bridge Monitoring
- Connection status to cloud
- dslrBooth API health checks
- Payment processing success rates
- Error frequency and types

### Business Analytics  
- Revenue per event
- Session completion rates
- Popular event types
- Geographic usage patterns

## Configuration Management

### Bridge Configuration
```json
{
  "boothId": "booth-001",
  "cloudServerUrl": "wss://api.photoboothpay.com",
  "dslrBoothApiUrl": "http://localhost:8080",
  "dslrBoothApiPassword": "generated_password",
  "webhookPort": 3001,
  "autoReconnect": true,
  "sessionTimeout": 300
}
```

### Environment Variables
```bash
BOOTH_ID=booth-001
CLOUD_SERVER=wss://api.photoboothpay.com
DSLR_API_PASSWORD=secret_password
WEBHOOK_PORT=3001
```

## Support & Maintenance

### Documentation Deliverables
- [ ] Operator Setup Guide
- [ ] Troubleshooting Manual  
- [ ] API Documentation
- [ ] Video Installation Tutorial

### Support Tools
- [ ] Remote diagnostic capabilities
- [ ] Log collection utilities
- [ ] Configuration validation tools
- [ ] Health check dashboards

## Success Metrics

### Technical Success
- < 1% payment processing failures
- < 5 second average unlock time
- Zero unauthorized booth access
- 99% uptime for bridge applications

### Business Success
- 50% reduction in payment handling time
- 20% increase in session volume
- 95% operator satisfaction score
- Positive ROI within 3 months

---

**Note**: This document serves as a comprehensive guide for implementation. Regular updates should be made as development progresses and requirements evolve.