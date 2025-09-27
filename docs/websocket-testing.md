# WebSocket Testing Documentation

## Overview

This document provides comprehensive testing guidelines for the Easy Picsy WebSocket realtime functionality. The WebSocket system handles real-time updates for QR code status changes, payment notifications, and event management.

## Architecture

### Backend Components
- **`EventsGateway`** - WebSocket gateway handling client connections and message broadcasting
- **`RealtimeService`** - Service layer for triggering WebSocket notifications
- **Namespace**: `/events` - All WebSocket events are scoped to this namespace

### Frontend Status
⚠️ **Currently Missing**: Frontend WebSocket client implementation is not yet implemented.

## WebSocket Events

### Client-to-Server Events (Incoming)

#### `joinEvent`
**Purpose**: Subscribe to real-time updates for a specific event
```typescript
// Client sends:
{
  eventId: string
}

// Server responds:
{
  eventId: string
}
```

#### `leaveEvent`
**Purpose**: Unsubscribe from event updates
```typescript
// Client sends:
{
  eventId: string
}

// Server responds:
{
  eventId: string
}
```

### Server-to-Client Events (Outgoing)

#### `paymentSuccess`
**Purpose**: Notify about successful payment
```typescript
{
  qrCodeId: string;
  eventId: string;
  paymentId: string;
  amount: number;
  currency: string;
}
```

#### `paymentFailed`
**Purpose**: Notify about failed payment
```typescript
{
  qrCodeId: string;
  eventId: string;
  paymentId: string;
  failureReason: string;
}
```

#### `qrExpiryWarning`
**Purpose**: Warn about upcoming QR code expiry (5 minutes before)
```typescript
{
  qrCodeId: string;
  eventId: string;
  minutesRemaining: number;
  message: string;
}
```

#### `error`
**Purpose**: Send error messages to specific clients
```typescript
{
  message: string;
}
```

## Authentication

### Token Requirements
All WebSocket connections require authentication via:
1. **Auth Header**: `Authorization: Bearer <token>`
2. **Query Parameter**: `?token=<token>`
3. **Auth Object**: `{ token: '<token>' }`

### Connection Flow
1. Client connects to WebSocket
2. Server validates token from handshake
3. If valid, connection is established
4. If invalid, connection is immediately closed

## Testing Methods

### 1. Manual Testing with WebSocket Client

#### Using Browser DevTools
```javascript
// Connect to WebSocket
const socket = io('ws://localhost:3000/events', {
  auth: {
    token: 'your-jwt-token-here'
  }
});

// Listen for essential events only
socket.on('paymentSuccess', (data) => {
  console.log('✅ Payment Success:', data);
});

socket.on('paymentFailed', (data) => {
  console.log('❌ Payment Failed:', data);
});

socket.on('qrExpiryWarning', (data) => {
  console.log('⏰ QR Expiry Warning:', data);
});

// Join an event room
socket.emit('joinEvent', { eventId: 'your-event-id' });

// Leave an event room
socket.emit('leaveEvent', { eventId: 'your-event-id' });
```

#### Using Postman WebSocket Testing
1. Open Postman
2. Create new WebSocket request
3. URL: `ws://localhost:3000/events`
4. Headers: `Authorization: Bearer <token>`
5. Connect and test events

### 2. Automated Testing

#### Backend Unit Tests
```typescript
// Example test for RealtimeService
describe('RealtimeService', () => {
  let service: RealtimeService;
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RealtimeService, EventsGateway],
    }).compile();

    service = module.get<RealtimeService>(RealtimeService);
    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should notify QR status update', () => {
    const spy = jest.spyOn(gateway, 'broadcastQRStatusUpdate');
    
    service.notifyQRStatusUpdate('event-123', {
      qrCodeId: 'qr-123',
      eventId: 'event-123',
      status: QrCodeStatus.USED,
    });

    expect(spy).toHaveBeenCalledWith('event-123', expect.any(Object));
  });
});
```

#### Integration Tests
```typescript
// Test WebSocket gateway integration
describe('EventsGateway Integration', () => {
  let app: INestApplication;
  let io: Socket;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should handle client connection', async () => {
    const client = io('ws://localhost:3000/events', {
      auth: { token: 'valid-token' }
    });

    await new Promise(resolve => {
      client.on('connect', resolve);
    });

    expect(client.connected).toBe(true);
  });
});
```

### 3. Load Testing

#### Using Artillery.io
```yaml
# artillery-websocket-test.yml
config:
  target: 'ws://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "WebSocket Connection Test"
    weight: 100
    engine: ws
    beforeRequest: "setAuthToken"
    flow:
      - connect:
          url: "/events"
          headers:
            Authorization: "Bearer {{ token }}"
      - emit:
          channel: "joinEvent"
          data: { eventId: "test-event-123" }
      - think: 5
      - emit:
          channel: "leaveEvent"
          data: { eventId: "test-event-123" }
```

### 4. End-to-End Testing Scenarios

#### Scenario 1: Payment Success Flow
1. **QR Code Generated** → No real-time event (instant response)
2. **Payment Processing** → No real-time event (handled by payment provider)
3. **Payment Success** → Client receives `paymentSuccess` event
4. **QR Code Cleanup** → No separate event needed

#### Scenario 2: Payment Failure Flow
1. **QR Code Generated** → No real-time event (instant response)
2. **Payment Processing** → No real-time event (handled by payment provider)
3. **Payment Failure** → Client receives `paymentFailed` event
4. **Retry Available** → User can generate new QR code

#### Scenario 3: QR Expiry Warning
1. **QR Code Generated** → No real-time event (instant response)
2. **5 Minutes Before Expiry** → Client receives `qrExpiryWarning` event
3. **QR Code Expires** → No separate event (handled by warning)

#### Scenario 4: Error Handling
1. **Invalid Token** → Connection rejected
2. **Network Disconnect** → Automatic cleanup
3. **Payment Failure** → Client receives `paymentFailed`

## Testing Tools

### 1. WebSocket Testing Tools
- **Postman** - WebSocket testing with GUI
- **wscat** - Command-line WebSocket client
- **Socket.IO Client** - JavaScript client library
- **Artillery.io** - Load testing for WebSockets

### 2. Browser Testing
```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:3000/events -H "Authorization: Bearer your-token"

# Send messages
{"event": "joinEvent", "data": {"eventId": "test-123"}}
```

### 3. Node.js Testing Client
```typescript
import { io } from 'socket.io-client';

const client = io('ws://localhost:3000/events', {
  auth: { token: 'your-token' }
});

client.on('connect', () => {
  console.log('Connected to WebSocket');
  
  // Join event room
  client.emit('joinEvent', { eventId: 'test-event' });
});

client.on('paymentSuccess', (data) => {
  console.log('✅ Payment Success:', data);
});

client.on('paymentFailed', (data) => {
  console.log('❌ Payment Failed:', data);
});

client.on('qrExpiryWarning', (data) => {
  console.log('⏰ QR Expiry Warning:', data);
});
```

## Environment Setup

### Backend Environment Variables
```bash
# WebSocket Configuration
CORS_ORIGIN=http://localhost:4200
PORT=3000

# Database (for testing)
DATABASE_URL=postgresql://user:password@localhost:5432/easy_picsy_test
```

### Frontend Environment Variables (Future)
```bash
# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Common Issues & Solutions

### 1. Connection Issues
**Problem**: WebSocket connection fails
**Solutions**:
- Check CORS configuration
- Verify authentication token
- Ensure server is running on correct port
- Check firewall settings

### 2. Authentication Issues
**Problem**: Connection rejected due to invalid token
**Solutions**:
- Verify JWT token is valid and not expired
- Check token format in auth header
- Ensure token has proper permissions

### 3. Event Not Received
**Problem**: Client doesn't receive expected events
**Solutions**:
- Verify client has joined the correct event room
- Check event room naming convention (`event_${eventId}`)
- Ensure backend is triggering the correct RealtimeService methods

### 4. Performance Issues
**Problem**: WebSocket connections are slow or dropping
**Solutions**:
- Monitor connection limits
- Check server resources
- Implement connection pooling
- Add heartbeat/ping-pong mechanism

## Monitoring & Debugging

### 1. Server Logs
```typescript
// Enable WebSocket logging
const logger = new Logger('EventsGateway');

// Log all connections
logger.log(`Client connected: ${client.id}`);
logger.log(`Client disconnected: ${client.id}`);

// Log all broadcasts
logger.log(`Broadcasted QR status update for event ${eventId}`);
```

### 2. Client-Side Debugging
```typescript
// Enable Socket.IO debugging
localStorage.debug = 'socket.io-client:*';

// Log all events
socket.onAny((event, ...args) => {
  console.log(`Received event: ${event}`, args);
});
```

### 3. Health Checks
```typescript
// Add WebSocket health check endpoint
@Get('health/websocket')
async checkWebSocketHealth() {
  return {
    status: 'healthy',
    connections: this.gateway.server.sockets.sockets.size,
    timestamp: new Date().toISOString(),
  };
}
```

## Future Enhancements

### 1. Frontend Implementation
- [ ] Add Socket.IO client to frontend
- [ ] Implement real-time dashboard updates
- [ ] Add connection status indicators
- [ ] Implement automatic reconnection

### 2. Advanced Features
- [ ] Add message queuing for offline clients
- [ ] Implement rate limiting
- [ ] Add message persistence
- [ ] Implement WebSocket clustering

### 3. Testing Improvements
- [ ] Add automated E2E tests
- [ ] Implement WebSocket mocking
- [ ] Add performance benchmarks
- [ ] Create WebSocket test utilities

## Quick Testing Steps

### 1. Basic WebSocket Connection Test
```bash
# 1. Start backend server
npm run start:dev

# 2. Test WebSocket connection
wscat -c ws://localhost:3000/events -H "Authorization: Bearer your-token"

# 3. Join event room
{"event": "joinEvent", "data": {"eventId": "test-event-123"}}
```

### 2. QR Code State Flow Test
```bash
# 1. Generate QR code
curl -X POST http://localhost:3000/api/qr-codes/generate \
  -H "Content-Type: application/json" \
  -d '{"eventId": "test-event-123", "userId": "test-user"}'

# 2. Check QR status (should be 'active')
curl http://localhost:3000/api/qr-codes/{qr-code-id}/status

# 3. Simulate payment success webhook
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "evt_123", "type": "event", "attributes": {"type": "payment.paid", "data": {"id": "{qr-code-id}", "type": "qrph", "attributes": {"code_id": "{qr-code-id}", "source_status": "paid", "payment_intent_id": "pi_123", "amount": 2000, "currency": "PHP"}}}}'

# 4. Check QR status (should be 'paid')
curl http://localhost:3000/api/qr-codes/{qr-code-id}/status

# 5. Simulate booth session end
curl -X POST http://localhost:3000/api/booth-logging/log-event \
  -H "Content-Type: application/json" \
  -d '{"eventType": "session_end", "qrCodeId": "{qr-code-id}", "sessionId": "session_123", "timestamp": "2024-01-01T00:00:00Z"}'

# 6. Check QR status (should be 'completed')
curl http://localhost:3000/api/qr-codes/{qr-code-id}/status
```

### 3. WebSocket Events Test
```bash
# 1. Connect to WebSocket
wscat -c ws://localhost:3000/events -H "Authorization: Bearer your-token"

# 2. Join event room
{"event": "joinEvent", "data": {"eventId": "test-event-123"}}

# 3. In another terminal, trigger payment success
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "evt_123", "type": "event", "attributes": {"type": "payment.paid", "data": {"id": "{qr-code-id}", "type": "qrph", "attributes": {"code_id": "{qr-code-id}", "source_status": "paid", "payment_intent_id": "pi_123", "amount": 2000, "currency": "PHP"}}}}'

# 4. Should see 'paymentSuccess' event in WebSocket
```

### 4. Error Scenarios Test
```bash
# 1. Test invalid QR code ID
curl http://localhost:3000/api/qr-codes/invalid-id/status
# Should return 404

# 2. Test payment failure
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "evt_123", "type": "event", "attributes": {"type": "payment.failed", "data": {"id": "{qr-code-id}", "type": "qrph", "attributes": {"code_id": "{qr-code-id}", "source_status": "failed", "payment_intent_id": "pi_123", "failed_message": "Test failure", "failed_code": "RJCT", "amount": 2000, "currency": "PHP"}}}}'

# 3. Check QR status (should be 'failed')
curl http://localhost:3000/api/qr-codes/{qr-code-id}/status
```

### 5. Database Verification
```sql
-- Check QR code status
SELECT id, status, is_active, created_at, used_at FROM qr_codes WHERE id = 'your-qr-code-id';

-- Check state changes
SELECT id, qr_code_id, from_state, to_state, created_at FROM qr_code_state_changes WHERE qr_code_id = 'your-qr-code-id';

-- Check payment records
SELECT id, qr_code_id, status, amount, created_at FROM payments WHERE qr_code_id = 'your-qr-code-id';

-- Check booth events
SELECT id, event_type, qr_code_id, created_at FROM booth_logs WHERE qr_code_id = 'your-qr-code-id';
```

## Conclusion

The WebSocket system is fully functional on the backend with all functions being actively used. The main gap is the frontend implementation, which should be prioritized for complete real-time functionality. This documentation provides comprehensive testing strategies for both current backend testing and future frontend integration.

---

## ⚠️ WebSocket Deprecated - Use Long Polling Instead

**WebSocket implementation has been replaced with Long Polling for better reliability and simplicity.**

### Why Long Polling is Better:

- ✅ **Simple HTTP requests** - No WebSocket complexity
- ✅ **Works everywhere** - No firewall/proxy issues  
- ✅ **Easy authentication** - Just add JWT headers
- ✅ **Reliable** - No connection drops to handle
- ✅ **Easy debugging** - Standard HTTP requests
- ✅ **Simple scaling** - Just add more HTTP servers

### Migration Guide:

**Old WebSocket approach:**
```javascript
const socket = io('ws://localhost:3000/events');
socket.on('paymentSuccess', (data) => { ... });
```

**New Long Polling approach:**
```javascript
const response = await fetch('/api/events/event-123/poll', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
data.events.forEach(event => { ... });
```

### See Long Polling Documentation:
📖 **[Long Polling Testing Guide](./long-polling-testing.md)**

### Quick Test:
```bash
# Test long polling
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/test-event-123/poll?timeout=30000"
```

