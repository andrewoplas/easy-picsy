# Long Polling Testing Documentation

## Overview

This document provides comprehensive testing guidelines for the Easy Picsy Long Polling realtime functionality. Long polling provides a simple and reliable way to receive real-time updates without the complexity of WebSockets.

## Architecture

### Backend Components
- **`LongPollingController`** - HTTP endpoints for long polling
- **`RealtimeService`** - Service layer for event storage and retrieval
- **Event Queues** - In-memory storage for events per event ID
- **Cleanup Cron** - Automatic cleanup of old events and requests

### Frontend Integration
✅ **Simple HTTP requests** - No special WebSocket libraries needed
✅ **Easy authentication** - Just add JWT headers
✅ **Reliable** - Works through any firewall/proxy
✅ **Easy debugging** - Standard HTTP requests

## API Endpoints

### 1. Long Polling - Wait for Events
```
GET /api/events/{eventId}/poll?timeout=30000
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "eventId": "event-123",
      "type": "paymentSuccess",
      "data": {
        "qrCodeId": "qr-123",
        "paymentId": "pi-123",
        "amount": 2000,
        "currency": "PHP"
      },
      "timestamp": 1703123456789
    }
  ],
  "count": 1,
  "eventId": "event-123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get Events Since Timestamp
```
GET /api/events/{eventId}/events?since=1234567890
Authorization: Bearer <jwt-token>
```

### 3. Clear Events
```
GET /api/events/{eventId}/clear
Authorization: Bearer <jwt-token>
```

### 4. Get Statistics
```
GET /api/events/stats
Authorization: Bearer <jwt-token>
```

## Event Types

### Payment Success
```json
{
  "type": "paymentSuccess",
  "data": {
    "qrCodeId": "qr-123",
    "eventId": "event-123",
    "paymentId": "pi-123",
    "amount": 2000,
    "currency": "PHP"
  }
}
```

### Payment Failed
```json
{
  "type": "paymentFailed",
  "data": {
    "qrCodeId": "qr-123",
    "eventId": "event-123",
    "paymentId": "pi-123",
    "failureReason": "Insufficient funds"
  }
}
```

### QR Expiry Warning
```json
{
  "type": "qrExpiryWarning",
  "data": {
    "qrCodeId": "qr-123",
    "eventId": "event-123",
    "minutesRemaining": 5,
    "message": "QR code expires in 5 minutes"
  }
}
```

## Testing Methods

### 1. Manual Testing with curl

#### Basic Long Polling Test
```bash
# Start long polling (will timeout after 30 seconds)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/test-event-123/poll?timeout=30000"
```

#### Get Events Since Timestamp
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/test-event-123/events?since=0"
```

#### Get Statistics
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/stats"
```

### 2. Automated Testing

#### Run the Test Script
```bash
node test-long-polling.js
```

#### Test with Postman
1. Create GET request to `http://localhost:3000/api/events/test-event-123/poll`
2. Add Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Add query parameter: `timeout=30000`
4. Send request and wait for response

### 3. Frontend Integration

#### JavaScript Client
```javascript
class LongPollingClient {
  constructor(eventId, token) {
    this.eventId = eventId;
    this.token = token;
    this.isPolling = false;
  }

  async startPolling() {
    this.isPolling = true;
    await this.poll();
  }

  async poll() {
    if (!this.isPolling) return;

    try {
      const response = await fetch(
        `/api/events/${this.eventId}/poll?timeout=30000`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      const data = await response.json();
      
      if (data.success && data.events.length > 0) {
        data.events.forEach(event => {
          this.handleEvent(event);
        });
      }

      // Immediately poll again
      if (this.isPolling) {
        this.poll();
      }
    } catch (error) {
      console.error('Polling error:', error);
      // Retry after delay
      setTimeout(() => this.poll(), 1000);
    }
  }

  handleEvent(event) {
    switch (event.type) {
      case 'paymentSuccess':
        console.log('✅ Payment successful:', event.data);
        break;
      case 'paymentFailed':
        console.log('❌ Payment failed:', event.data);
        break;
      case 'qrExpiryWarning':
        console.log('⏰ QR expires soon:', event.data);
        break;
    }
  }

  stopPolling() {
    this.isPolling = false;
  }
}

// Usage
const client = new LongPollingClient('event-123', 'your-jwt-token');
client.startPolling();
```

## Quick Testing Steps

### 1. Basic Long Polling Test
```bash
# 1. Start backend server
npm run start:dev

# 2. Test long polling (will timeout after 5 seconds)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/test-event-123/poll?timeout=5000"
```

### 2. Event Triggering Test
```bash
# 1. Start long polling in one terminal
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:3000/api/events/test-event-123/poll?timeout=30000"

# 2. In another terminal, trigger a payment event
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"data": {"id": "evt_123", "type": "event", "attributes": {"type": "payment.paid", "data": {"id": "code_test", "type": "qrph", "attributes": {"code_id": "code_test", "source_status": "paid", "payment_intent_id": "pi_test", "amount": 2000, "currency": "PHP"}}}}'
```

### 3. Concurrent Polling Test
```bash
# Start multiple long polling requests simultaneously
for i in {1..3}; do
  curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    "http://localhost:3000/api/events/test-event-123/poll?timeout=10000" &
done
wait
```

## Expected Results

### Successful Long Polling
```json
{
  "success": true,
  "events": [],
  "count": 0,
  "eventId": "test-event-123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### With Events
```json
{
  "success": true,
  "events": [
    {
      "eventId": "test-event-123",
      "type": "paymentSuccess",
      "data": {
        "qrCodeId": "qr-123",
        "paymentId": "pi-123",
        "amount": 2000,
        "currency": "PHP"
      },
      "timestamp": 1703123456789
    }
  ],
  "count": 1,
  "eventId": "test-event-123",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check JWT token is valid and not expired
2. **Timeout**: Normal behavior - request will timeout if no events
3. **No Events**: Events are only stored for matching event IDs
4. **Connection Refused**: Ensure backend server is running

### Debug Steps

1. Check backend logs for long polling requests
2. Verify JWT token is valid
3. Test with curl first, then integrate into frontend
4. Check event ID matches between polling and event triggering

## Benefits of Long Polling

### ✅ Advantages
- **Simple HTTP requests** - No WebSocket complexity
- **Works everywhere** - No firewall/proxy issues
- **Easy authentication** - Standard JWT headers
- **Reliable** - No connection drops to handle
- **Easy debugging** - Standard HTTP tools
- **Simple scaling** - Just add more HTTP servers

### ⚠️ Considerations
- **Slight delay** - 1-2 second delay vs instant WebSocket
- **Server resources** - Holds connections open
- **Timeout handling** - Need to handle timeouts gracefully

## Conclusion

Long polling provides a simple, reliable, and easy-to-debug solution for real-time updates in the Easy Picsy system. It's perfect for the photo booth use case where slight delays are acceptable and reliability is more important than instant updates.
