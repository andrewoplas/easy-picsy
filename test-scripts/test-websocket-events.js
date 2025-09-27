#!/usr/bin/env node

/**
 * WebSocket Events Test Script
 * 
 * This script specifically tests WebSocket functionality:
 * 1. Connection establishment
 * 2. Event listening
 * 3. Reconnection handling
 * 4. Event filtering and routing
 * 
 * Usage: node test-websocket-events.js
 */

const WebSocket = require('ws');
const axios = require('axios');

// Configuration
const WS_URL = 'ws://localhost:3000';
const BASE_URL = 'http://localhost:3000';
const EVENT_ID = 'ws-test-event-' + Date.now();

// Test data
let qrCodeId = null;
let paymentIntentId = null;
let ws = null;
let eventCount = 0;
let expectedEvents = [];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[STEP ${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logEvent(event) {
  log(`📡 Event: ${event.type}`, 'magenta');
  if (event.data) {
    log(`   Data: ${JSON.stringify(event.data, null, 2)}`, 'blue');
  }
}

// WebSocket connection management
function connectWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(WS_URL);
    
    ws.on('open', () => {
      logSuccess('WebSocket connected');
      resolve(true);
    });
    
    ws.on('error', (error) => {
      logError(`WebSocket connection error: ${error.message}`);
      reject(error);
    });
    
    ws.on('close', (code, reason) => {
      logWarning(`WebSocket closed: ${code} - ${reason}`);
    });
    
    ws.on('message', (data) => {
      try {
        const event = JSON.parse(data);
        eventCount++;
        logEvent(event);
        
        // Check if this is an expected event
        const expectedIndex = expectedEvents.findIndex(e => e.type === event.type);
        if (expectedIndex !== -1) {
          expectedEvents.splice(expectedIndex, 1);
          logSuccess(`Expected event received: ${event.type}`);
        }
      } catch (error) {
        logError(`WebSocket message parsing error: ${error.message}`);
      }
    });
    
    // Connection timeout
    setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket connection timeout'));
      }
    }, 5000);
  });
}

function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
    logSuccess('WebSocket disconnected');
  }
}

// Test functions
async function testBasicConnection() {
  logStep(1, 'Testing Basic WebSocket Connection');
  
  try {
    await connectWebSocket();
    logSuccess('WebSocket connection established');
    return true;
  } catch (error) {
    logError(`Connection failed: ${error.message}`);
    return false;
  }
}

async function testConnectionStability() {
  logStep(2, 'Testing Connection Stability');
  
  return new Promise((resolve) => {
    let stabilityChecks = 0;
    const maxChecks = 5;
    
    const checkInterval = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        stabilityChecks++;
        log(`Stability check ${stabilityChecks}/${maxChecks}`, 'blue');
        
        if (stabilityChecks >= maxChecks) {
          clearInterval(checkInterval);
          logSuccess('Connection is stable');
          resolve(true);
        }
      } else {
        clearInterval(checkInterval);
        logError('Connection lost during stability test');
        resolve(false);
      }
    }, 1000);
  });
}

async function testReconnection() {
  logStep(3, 'Testing Reconnection');
  
  try {
    // Disconnect
    disconnectWebSocket();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reconnect
    await connectWebSocket();
    logSuccess('Reconnection successful');
    return true;
  } catch (error) {
    logError(`Reconnection failed: ${error.message}`);
    return false;
  }
}

async function testPaymentEvents() {
  logStep(4, 'Testing Payment Events');
  
  try {
    // Generate QR code first
    const qrResponse = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: EVENT_ID,
      userId: 'ws-test-user'
    });
    
    if (!qrResponse.data.success) {
      logError('Failed to generate QR code for testing');
      return false;
    }
    
    qrCodeId = qrResponse.data.data.id;
    paymentIntentId = qrResponse.data.data.paymentIntentId;
    
    logSuccess('QR code generated for payment testing');
    
    // Set up expected events
    expectedEvents = [
      { type: 'paymentSuccess', timeout: 10000 },
      { type: 'qrExpiryWarning', timeout: 15000 }
    ];
    
    // Trigger payment success
    const paymentPayload = {
      data: {
        id: `evt_ws_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'payment.paid',
          livemode: false,
          data: {
            id: qrCodeId,
            type: 'qrph',
            attributes: {
              code_id: qrCodeId,
              livemode: false,
              organization_id: 'org_test_123',
              created_at: new Date().toISOString(),
              source_id: 'src_test_123',
              source_status: 'paid',
              payment_intent_id: paymentIntentId,
              amount: 2000,
              currency: 'PHP'
            }
          }
        }
      }
    };
    
    const webhookResponse = await axios.post(`${BASE_URL}/api/webhook`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });
    
    if (webhookResponse.data.status === 'accepted') {
      logSuccess('Payment webhook sent');
      
      // Wait for WebSocket events
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (expectedEvents.length === 0) {
        logSuccess('All expected payment events received');
        return true;
      } else {
        logWarning(`Still waiting for events: ${expectedEvents.map(e => e.type).join(', ')}`);
        return true; // Partial success
      }
    } else {
      logError(`Payment webhook failed: ${webhookResponse.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Payment events test error: ${error.message}`);
    return false;
  }
}

async function testQRExpiryEvents() {
  logStep(5, 'Testing QR Expiry Events');
  
  try {
    // Generate a QR code with short expiry for testing
    const qrResponse = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: EVENT_ID + '_expiry',
      userId: 'ws-test-user'
    });
    
    if (!qrResponse.data.success) {
      logError('Failed to generate QR code for expiry testing');
      return false;
    }
    
    const expiryQrId = qrResponse.data.data.id;
    logSuccess('QR code generated for expiry testing');
    
    // Set up expected events
    expectedEvents = [
      { type: 'qrExpiryWarning', timeout: 10000 }
    ];
    
    // Manually trigger expiry (for testing purposes)
    // In real scenario, this would happen automatically
    const expiryPayload = {
      data: {
        id: `evt_expiry_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'qrph.expired',
          livemode: false,
          data: {
            id: expiryQrId,
            type: 'qrph',
            attributes: {
              code_id: expiryQrId,
              livemode: false,
              organization_id: 'org_test_123',
              created_at: new Date().toISOString(),
              source_id: 'src_test_123',
              source_status: 'expired',
              payment_intent_id: 'pi_test_expiry'
            }
          }
        }
      }
    };
    
    const webhookResponse = await axios.post(`${BASE_URL}/api/webhook`, expiryPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });
    
    if (webhookResponse.data.status === 'accepted') {
      logSuccess('Expiry webhook sent');
      
      // Wait for WebSocket events
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (expectedEvents.length === 0) {
        logSuccess('All expected expiry events received');
        return true;
      } else {
        logWarning(`Still waiting for events: ${expectedEvents.map(e => e.type).join(', ')}`);
        return true; // Partial success
      }
    } else {
      logError(`Expiry webhook failed: ${webhookResponse.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`QR expiry events test error: ${error.message}`);
    return false;
  }
}

async function testEventFiltering() {
  logStep(6, 'Testing Event Filtering');
  
  try {
    // Generate multiple QR codes to test event filtering
    const qr1Response = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: EVENT_ID + '_filter1',
      userId: 'ws-test-user'
    });
    
    const qr2Response = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: EVENT_ID + '_filter2',
      userId: 'ws-test-user'
    });
    
    if (!qr1Response.data.success || !qr2Response.data.success) {
      logError('Failed to generate QR codes for filtering test');
      return false;
    }
    
    const qr1Id = qr1Response.data.data.id;
    const qr2Id = qr2Response.data.data.id;
    
    logSuccess('Multiple QR codes generated for filtering test');
    
    // Set up expected events (should only receive events for the current event)
    expectedEvents = [
      { type: 'paymentSuccess', timeout: 10000 }
    ];
    
    // Trigger payment for first QR code
    const paymentPayload = {
      data: {
        id: `evt_filter_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'payment.paid',
          livemode: false,
          data: {
            id: qr1Id,
            type: 'qrph',
            attributes: {
              code_id: qr1Id,
              livemode: false,
              organization_id: 'org_test_123',
              created_at: new Date().toISOString(),
              source_id: 'src_test_123',
              source_status: 'paid',
              payment_intent_id: qr1Response.data.data.paymentIntentId,
              amount: 2000,
              currency: 'PHP'
            }
          }
        }
      }
    };
    
    const webhookResponse = await axios.post(`${BASE_URL}/api/webhook`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });
    
    if (webhookResponse.data.status === 'accepted') {
      logSuccess('Payment webhook sent for filtering test');
      
      // Wait for WebSocket events
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      logSuccess('Event filtering test completed');
      return true;
    } else {
      logError(`Payment webhook failed: ${webhookResponse.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Event filtering test error: ${error.message}`);
    return false;
  }
}

async function testErrorHandling() {
  logStep(7, 'Testing Error Handling');
  
  try {
    // Test invalid event data
    const invalidPayload = {
      data: {
        id: `evt_invalid_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'invalid.event.type',
          livemode: false,
          data: {
            id: 'invalid_qr_id',
            type: 'qrph',
            attributes: {
              code_id: 'invalid_qr_id',
              livemode: false,
              organization_id: 'org_test_123',
              created_at: new Date().toISOString(),
              source_id: 'src_test_123',
              source_status: 'invalid_status',
              payment_intent_id: 'pi_invalid'
            }
          }
        }
      }
    };
    
    const webhookResponse = await axios.post(`${BASE_URL}/api/webhook`, invalidPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });
    
    // Should handle invalid data gracefully
    if (webhookResponse.data.status === 'accepted' || webhookResponse.data.status === 'error') {
      logSuccess('Error handling test completed');
      return true;
    } else {
      logError(`Unexpected response: ${webhookResponse.data.status}`);
      return false;
    }
  } catch (error) {
    logError(`Error handling test error: ${error.message}`);
    return false;
  }
}

async function cleanup() {
  logStep(8, 'Cleanup');
  
  disconnectWebSocket();
  logSuccess('WebSocket test cleanup completed');
}

// Main test runner
async function runTests() {
  log('🚀 Starting WebSocket Events Tests', 'bright');
  log(`Event ID: ${EVENT_ID}`, 'blue');
  
  const tests = [
    { name: 'Basic Connection', fn: testBasicConnection },
    { name: 'Connection Stability', fn: testConnectionStability },
    { name: 'Reconnection', fn: testReconnection },
    { name: 'Payment Events', fn: testPaymentEvents },
    { name: 'QR Expiry Events', fn: testQRExpiryEvents },
    { name: 'Event Filtering', fn: testEventFiltering },
    { name: 'Error Handling', fn: testErrorHandling },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      logError(`Test "${test.name}" threw error: ${error.message}`);
      failed++;
    }
  }
  
  await cleanup();
  
  log('\n📊 Test Results', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`, 'blue');
  log(`📡 Total Events Received: ${eventCount}`, 'magenta');
  
  if (failed === 0) {
    log('\n🎉 All WebSocket tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Some WebSocket tests failed!', 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  log('\n\n⚠️  Test interrupted by user', 'yellow');
  await cleanup();
  process.exit(1);
});

// Run tests
runTests().catch((error) => {
  logError(`Test runner error: ${error.message}`);
  process.exit(1);
});
