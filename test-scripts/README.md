# Easy Picsy Test Scripts

This directory contains comprehensive test scripts for testing the Easy Picsy QR code state management and WebSocket functionality.

## Prerequisites

1. **Backend Server Running**: Ensure the backend server is running on `localhost:3000`
2. **Database Setup**: Ensure the database is properly configured and migrated
3. **Dependencies**: Install required Node.js packages

## Installation

```bash
cd test-scripts
npm install
```

## Test Scripts

### 1. QR State Management Test (`test-qr-state-management.js`)

Tests the complete QR code lifecycle:
- QR code generation (ACTIVE status)
- Payment success (PAID status)
- Session completion (SESSION_COMPLETED status)
- Error scenarios (FAILED, EXPIRED)
- WebSocket connection and events

**Usage:**
```bash
npm run test:qr-state
# or
node test-qr-state-management.js
```

**What it tests:**
- QR code generation with proper status
- Payment webhook processing
- Booth session event logging
- WebSocket event broadcasting
- Error handling and edge cases

### 2. WebSocket Events Test (`test-websocket-events.js`)

Specifically tests WebSocket functionality:
- Connection establishment and stability
- Event listening and filtering
- Reconnection handling
- Payment and expiry event broadcasting

**Usage:**
```bash
npm run test:websocket
# or
node test-websocket-events.js
```

**What it tests:**
- WebSocket connection management
- Event filtering and routing
- Reconnection scenarios
- Error handling in WebSocket events

### 3. Integration Flow Test (`test-integration-flow.js`)

Tests the complete end-to-end flow:
- Event creation
- QR code generation
- Payment processing
- Booth session simulation
- Session completion
- WebSocket notifications
- Data consistency

**Usage:**
```bash
npm run test:integration
# or
node test-integration-flow.js
```

**What it tests:**
- Complete user journey
- Data consistency across services
- WebSocket notifications in real flow
- Database state management

## Running All Tests

```bash
npm run test:all
```

This will run all three test scripts in sequence.

## Test Configuration

### Environment Variables

The tests use the following default configuration:
- **Backend URL**: `http://localhost:3000`
- **WebSocket URL**: `ws://localhost:3000`
- **Event ID**: Auto-generated with timestamp
- **User ID**: Auto-generated with timestamp

### Custom Configuration

You can modify the configuration at the top of each test script:

```javascript
// Configuration
const BASE_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';
const EVENT_ID = 'test-event-' + Date.now();
const USER_ID = 'test-user-' + Date.now();
```

## Expected Test Flow

### QR State Management Test
1. Generate QR code → Status: `ACTIVE`
2. Check QR code status → Should be valid
3. Connect to WebSocket → Should connect successfully
4. Process payment success → Status: `PAID`
5. Verify WebSocket events → Should receive `paymentSuccess`
6. Complete booth session → Status: `SESSION_COMPLETED`
7. Test error scenarios → Should handle failures gracefully

### WebSocket Events Test
1. Establish WebSocket connection
2. Test connection stability
3. Test reconnection handling
4. Test payment event broadcasting
5. Test QR expiry event broadcasting
6. Test event filtering
7. Test error handling

### Integration Flow Test
1. Create test event
2. Generate QR code for event
3. Set up WebSocket connection
4. Process payment (simulate webhook)
5. Simulate booth session (start → photos → end)
6. Verify WebSocket notifications
7. Check data consistency

## Test Results

Each test script provides detailed output including:
- ✅ Success indicators
- ❌ Error indicators
- ⚠️ Warning indicators
- 📡 WebSocket event logs
- 📊 Final test results

### Sample Output

```
🚀 Starting QR Code State Management Tests
Event ID: test-event-1703123456789
User ID: test-user-1703123456789

[STEP 1] Testing QR Code Generation
✅ QR Code generated successfully
QR Code ID: qr_abc123
Payment Intent ID: pi_xyz789
Status: active
✅ QR Code status is ACTIVE

[STEP 2] Testing QR Code Status Check
✅ QR Code status retrieved
Status: active
Is Active: true
Is Valid: true

[STEP 3] Testing WebSocket Connection
✅ WebSocket connected

[STEP 4] Testing Payment Success (PAID status)
✅ Payment success webhook processed
✅ QR Code status updated to PAID

[STEP 5] Testing WebSocket Events
📡 WebSocket Event: paymentSuccess
✅ Payment success event received
✅ All expected WebSocket events received

[STEP 6] Testing Session Completion (SESSION_COMPLETED status)
✅ Booth session end event logged
✅ QR Code status updated to SESSION_COMPLETED

[STEP 7] Testing Error Scenarios
✅ Correctly handled invalid QR code ID (404)
✅ Payment failure webhook processed
✅ QR Code status updated to FAILED

[STEP 8] Cleanup
✅ WebSocket connection closed
✅ Test cleanup completed

📊 Test Results
✅ Passed: 7
❌ Failed: 0
📈 Success Rate: 100%

🎉 All tests passed!
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure backend server is running on port 3000
2. **WebSocket Connection Failed**: Check WebSocket gateway is properly configured
3. **Database Errors**: Ensure database is migrated and accessible
4. **Payment Webhook Errors**: Check webhook endpoint configuration

### Debug Steps

1. Check backend logs for detailed error information
2. Verify database connections and table structures
3. Test with simplified payloads first
4. Use database queries to verify data updates
5. Check WebSocket gateway logs for connection issues

### Database Queries for Debugging

```sql
-- Check QR code status
SELECT id, status, is_active, created_at, used_at FROM qr_codes WHERE id = 'your-qr-code-id';

-- Check payment records
SELECT id, qr_code_id, status, amount, created_at FROM payments WHERE qr_code_id = 'your-qr-code-id';

-- Check booth events
SELECT id, event_type, qr_code_id, created_at FROM booth_logs WHERE qr_code_id = 'your-qr-code-id';

-- Check state changes
SELECT id, qr_code_id, from_state, to_state, created_at FROM qr_code_state_changes WHERE qr_code_id = 'your-qr-code-id';
```

## Contributing

When adding new tests:
1. Follow the existing naming convention
2. Include proper error handling
3. Add detailed logging
4. Update this README
5. Test thoroughly before committing

## Notes

- Tests use auto-generated IDs to avoid conflicts
- Each test cleans up after itself
- Tests can be run independently or together
- WebSocket tests include connection stability checks
- Integration tests simulate real user workflows
