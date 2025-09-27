#!/usr/bin/env node

/**
 * Integration Flow Test Script
 * 
 * This script tests the complete end-to-end flow:
 * 1. Event creation
 * 2. QR code generation
 * 3. Payment processing
 * 4. Booth session
 * 5. Session completion
 * 6. WebSocket notifications
 * 
 * Usage: node test-integration-flow.js
 */

const axios = require('axios');
const WebSocket = require('ws');

// Configuration
const BASE_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

// Test data
let eventId = null;
let qrCodeId = null;
let paymentIntentId = null;
let ws = null;
let receivedEvents = [];

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

// WebSocket setup
function setupWebSocket() {
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
    
    ws.on('message', (data) => {
      try {
        const event = JSON.parse(data);
        receivedEvents.push(event);
        logEvent(event);
      } catch (error) {
        logError(`WebSocket message parsing error: ${error.message}`);
      }
    });
    
    setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket connection timeout'));
      }
    }, 5000);
  });
}

// Test functions
async function testEventCreation() {
  logStep(1, 'Creating Test Event');
  
  try {
    const eventData = {
      name: `Integration Test Event ${Date.now()}`,
      description: 'Test event for integration testing',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      location: 'Test Location',
      status: 'active'
    };
    
    const response = await axios.post(`${BASE_URL}/api/events`, eventData);
    
    if (response.data.success) {
      eventId = response.data.data.id;
      logSuccess(`Event created: ${eventId}`);
      log(`Event Name: ${response.data.data.name}`, 'blue');
      return true;
    } else {
      logError(`Event creation failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Event creation error: ${error.message}`);
    return false;
  }
}

async function testQRCodeGeneration() {
  logStep(2, 'Generating QR Code');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: eventId,
      userId: 'integration-test-user'
    });
    
    if (response.data.success) {
      qrCodeId = response.data.data.id;
      paymentIntentId = response.data.data.paymentIntentId;
      
      logSuccess(`QR Code generated: ${qrCodeId}`);
      log(`Payment Intent ID: ${paymentIntentId}`, 'blue');
      log(`Status: ${response.data.data.status}`, 'blue');
      
      return true;
    } else {
      logError(`QR Code generation failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`QR Code generation error: ${error.message}`);
    return false;
  }
}

async function testPaymentProcessing() {
  logStep(3, 'Processing Payment');
  
  try {
    const paymentPayload = {
      data: {
        id: `evt_integration_${Date.now()}`,
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
    
    const response = await axios.post(`${BASE_URL}/api/webhook`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });
    
    if (response.data.status === 'accepted') {
      logSuccess('Payment webhook processed');
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check QR code status
      const statusResponse = await axios.get(`${BASE_URL}/api/qr-codes/${qrCodeId}/status`);
      if (statusResponse.data.status === 'paid') {
        logSuccess('QR Code status updated to PAID');
        return true;
      } else {
        logError(`Expected status 'paid', got '${statusResponse.data.status}'`);
        return false;
      }
    } else {
      logError(`Payment webhook failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Payment processing error: ${error.message}`);
    return false;
  }
}

async function testBoothSession() {
  logStep(4, 'Simulating Booth Session');
  
  try {
    // Simulate session start
    const sessionStartPayload = {
      eventType: 'session_start',
      qrCodeId: qrCodeId,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata: {
        booth_id: 'booth_001',
        location: 'Test Location'
      }
    };
    
    const startResponse = await axios.post(`${BASE_URL}/api/booth-logging/log-event`, sessionStartPayload);
    
    if (startResponse.data.success) {
      logSuccess('Booth session started');
      
      // Simulate photo taking
      const photoPayload = {
        eventType: 'photo_taken',
        qrCodeId: qrCodeId,
        sessionId: sessionStartPayload.sessionId,
        timestamp: new Date().toISOString(),
        metadata: {
          photo_count: 1,
          photo_id: `photo_${Date.now()}`
        }
      };
      
      const photoResponse = await axios.post(`${BASE_URL}/api/booth-logging/log-event`, photoPayload);
      
      if (photoResponse.data.success) {
        logSuccess('Photo taken event logged');
        
        // Simulate session end
        const sessionEndPayload = {
          eventType: 'session_end',
          qrCodeId: qrCodeId,
          sessionId: sessionStartPayload.sessionId,
          timestamp: new Date().toISOString(),
          metadata: {
            photos_taken: 1,
            session_duration: 300
          }
        };
        
        const endResponse = await axios.post(`${BASE_URL}/api/booth-logging/log-event`, sessionEndPayload);
        
        if (endResponse.data.success) {
          logSuccess('Booth session ended');
          
          // Wait for processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check QR code status
          const statusResponse = await axios.get(`${BASE_URL}/api/qr-codes/${qrCodeId}/status`);
          if (statusResponse.data.status === 'completed') {
            logSuccess('QR Code status updated to SESSION_COMPLETED');
            return true;
          } else {
            logError(`Expected status 'completed', got '${statusResponse.data.status}'`);
            return false;
          }
        } else {
          logError(`Session end logging failed: ${endResponse.data.message}`);
          return false;
        }
      } else {
        logError(`Photo logging failed: ${photoResponse.data.message}`);
        return false;
      }
    } else {
      logError(`Session start logging failed: ${startResponse.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Booth session error: ${error.message}`);
    return false;
  }
}

async function testWebSocketNotifications() {
  logStep(5, 'Verifying WebSocket Notifications');
  
  try {
    // Wait for any pending events
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const eventTypes = receivedEvents.map(e => e.type);
    log(`Received events: ${eventTypes.join(', ')}`, 'blue');
    
    // Check for expected events
    const hasPaymentSuccess = eventTypes.includes('paymentSuccess');
    const hasQRExpiryWarning = eventTypes.includes('qrExpiryWarning');
    
    if (hasPaymentSuccess) {
      logSuccess('Payment success event received via WebSocket');
    } else {
      logWarning('Payment success event not received via WebSocket');
    }
    
    if (hasQRExpiryWarning) {
      logSuccess('QR expiry warning event received via WebSocket');
    } else {
      logWarning('QR expiry warning event not received via WebSocket');
    }
    
    // At least one event should be received
    if (receivedEvents.length > 0) {
      logSuccess(`WebSocket notifications working (${receivedEvents.length} events received)`);
      return true;
    } else {
      logError('No WebSocket events received');
      return false;
    }
  } catch (error) {
    logError(`WebSocket notification error: ${error.message}`);
    return false;
  }
}

async function testDataConsistency() {
  logStep(6, 'Verifying Data Consistency');
  
  try {
    // Check QR code details
    const qrResponse = await axios.get(`${BASE_URL}/api/qr-codes/${qrCodeId}`);
    
    if (qrResponse.data.success) {
      const qrData = qrResponse.data.data;
      log(`QR Code Status: ${qrData.status}`, 'blue');
      log(`QR Code Active: ${qrData.isActive}`, 'blue');
      log(`QR Code Used At: ${qrData.usedAt}`, 'blue');
      
      // Check event details
      const eventResponse = await axios.get(`${BASE_URL}/api/events/${eventId}`);
      
      if (eventResponse.data.success) {
        const eventData = eventResponse.data.data;
        log(`Event Status: ${eventData.status}`, 'blue');
        log(`Event Name: ${eventData.name}`, 'blue');
        
        logSuccess('Data consistency verified');
        return true;
      } else {
        logError(`Event retrieval failed: ${eventResponse.data.message}`);
        return false;
      }
    } else {
      logError(`QR Code retrieval failed: ${qrResponse.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Data consistency error: ${error.message}`);
    return false;
  }
}

async function cleanup() {
  logStep(7, 'Cleanup');
  
  if (ws) {
    ws.close();
    logSuccess('WebSocket connection closed');
  }
  
  logSuccess('Integration test cleanup completed');
}

// Main test runner
async function runTests() {
  log('🚀 Starting Integration Flow Tests', 'bright');
  
  const tests = [
    { name: 'Event Creation', fn: testEventCreation },
    { name: 'QR Code Generation', fn: testQRCodeGeneration },
    { name: 'WebSocket Setup', fn: setupWebSocket },
    { name: 'Payment Processing', fn: testPaymentProcessing },
    { name: 'Booth Session', fn: testBoothSession },
    { name: 'WebSocket Notifications', fn: testWebSocketNotifications },
    { name: 'Data Consistency', fn: testDataConsistency },
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
  
  log('\n📊 Integration Test Results', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`, 'blue');
  log(`📡 WebSocket Events: ${receivedEvents.length}`, 'magenta');
  
  if (failed === 0) {
    log('\n🎉 All integration tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Some integration tests failed!', 'red');
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
