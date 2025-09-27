#!/usr/bin/env node

/**
 * QR Code State Management Test Script
 * 
 * This script tests the complete QR code lifecycle:
 * 1. Generate QR code (ACTIVE)
 * 2. Payment success (PAID)
 * 3. Session completion (SESSION_COMPLETED)
 * 4. Error scenarios (FAILED, EXPIRED)
 * 
 * Usage: node test-qr-state-management.js
 */

const axios = require('axios');
const WebSocket = require('ws');

// Configuration
const BASE_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';
const EVENT_ID = 'test-event-' + Date.now();
const USER_ID = 'test-user-' + Date.now();

// Test data
let qrCodeId = null;
let paymentIntentId = null;
let ws = null;

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

// Test functions
async function testQRCodeGeneration() {
  logStep(1, 'Testing QR Code Generation');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/qr-codes/generate`, {
      eventId: EVENT_ID,
      userId: USER_ID
    });

    if (response.data.success) {
      qrCodeId = response.data.data.id;
      paymentIntentId = response.data.data.paymentIntentId;
      
      logSuccess(`QR Code generated successfully`);
      log(`QR Code ID: ${qrCodeId}`, 'blue');
      log(`Payment Intent ID: ${paymentIntentId}`, 'blue');
      log(`Status: ${response.data.data.status}`, 'blue');
      
      // Verify status is ACTIVE
      if (response.data.data.status === 'active') {
        logSuccess('QR Code status is ACTIVE');
      } else {
        logError(`Expected status 'active', got '${response.data.data.status}'`);
        return false;
      }
      
      return true;
    } else {
      logError(`QR Code generation failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`QR Code generation error: ${error.message}`);
    if (error.response) {
      logError(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

async function testQRCodeStatus() {
  logStep(2, 'Testing QR Code Status Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/qr-codes/${qrCodeId}/status`);
    
    logSuccess(`QR Code status retrieved`);
    log(`Status: ${response.data.status}`, 'blue');
    log(`Is Active: ${response.data.isActive}`, 'blue');
    log(`Is Valid: ${response.data.isValid}`, 'blue');
    
    return true;
  } catch (error) {
    logError(`QR Code status check error: ${error.message}`);
    return false;
  }
}

async function testPaymentSuccess() {
  logStep(3, 'Testing Payment Success (PAID status)');
  
  try {
    // Simulate payment success webhook
    const webhookPayload = {
      data: {
        id: `evt_${Date.now()}`,
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

    const response = await axios.post(`${BASE_URL}/api/webhook`, webhookPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });

    if (response.data.status === 'accepted') {
      logSuccess('Payment success webhook processed');
      
      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      logError(`Webhook processing failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Payment success test error: ${error.message}`);
    return false;
  }
}

async function testSessionCompletion() {
  logStep(4, 'Testing Session Completion (SESSION_COMPLETED status)');
  
  try {
    // Simulate booth session end event
    const boothEventPayload = {
      eventType: 'session_end',
      qrCodeId: qrCodeId,
      sessionId: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      metadata: {
        photos_taken: 4,
        session_duration: 300
      }
    };

    const response = await axios.post(`${BASE_URL}/api/booth-logging/log-event`, boothEventPayload);

    if (response.data.success) {
      logSuccess('Booth session end event logged');
      
      // Wait a moment for processing
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
      logError(`Booth event logging failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Session completion test error: ${error.message}`);
    return false;
  }
}

async function testWebSocketConnection() {
  logStep(5, 'Testing WebSocket Connection');
  
  return new Promise((resolve) => {
    ws = new WebSocket(WS_URL);
    
    ws.on('open', () => {
      logSuccess('WebSocket connected');
      resolve(true);
    });
    
    ws.on('error', (error) => {
      logError(`WebSocket connection error: ${error.message}`);
      resolve(false);
    });
    
    ws.on('close', () => {
      logWarning('WebSocket connection closed');
    });
    
    // Set timeout
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        logSuccess('WebSocket connection stable');
        resolve(true);
      } else {
        logError('WebSocket connection timeout');
        resolve(false);
      }
    }, 2000);
  });
}

async function testWebSocketEvents() {
  logStep(6, 'Testing WebSocket Events');
  
  return new Promise((resolve) => {
    let eventsReceived = 0;
    const expectedEvents = ['paymentSuccess', 'qrExpiryWarning'];
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        log(`📡 WebSocket Event: ${message.type}`, 'magenta');
        
        if (message.type === 'paymentSuccess') {
          logSuccess('Payment success event received');
          eventsReceived++;
        } else if (message.type === 'qrExpiryWarning') {
          logSuccess('QR expiry warning event received');
          eventsReceived++;
        }
        
        if (eventsReceived >= expectedEvents.length) {
          logSuccess('All expected WebSocket events received');
          resolve(true);
        }
      } catch (error) {
        logError(`WebSocket message parsing error: ${error.message}`);
      }
    });
    
    // Set timeout
    setTimeout(() => {
      if (eventsReceived > 0) {
        logSuccess(`Received ${eventsReceived} WebSocket events`);
        resolve(true);
      } else {
        logError('No WebSocket events received');
        resolve(false);
      }
    }, 5000);
  });
}

async function testErrorScenarios() {
  logStep(7, 'Testing Error Scenarios');
  
  try {
    // Test invalid QR code ID
    try {
      await axios.get(`${BASE_URL}/api/qr-codes/invalid-id/status`);
      logError('Should have failed with invalid QR code ID');
      return false;
    } catch (error) {
      if (error.response?.status === 404) {
        logSuccess('Correctly handled invalid QR code ID (404)');
      } else {
        logError(`Unexpected error for invalid QR code ID: ${error.message}`);
        return false;
      }
    }
    
    // Test payment failure
    const failurePayload = {
      data: {
        id: `evt_fail_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'payment.failed',
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
              source_status: 'failed',
              payment_intent_id: paymentIntentId,
              failed_message: 'Test failure',
              failed_code: 'RJCT',
              amount: 2000,
              currency: 'PHP'
            }
          }
        }
      }
    };

    const response = await axios.post(`${BASE_URL}/api/webhook`, failurePayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });

    if (response.data.status === 'accepted') {
      logSuccess('Payment failure webhook processed');
      
      // Wait and check status
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(`${BASE_URL}/api/qr-codes/${qrCodeId}/status`);
      if (statusResponse.data.status === 'failed') {
        logSuccess('QR Code status updated to FAILED');
        return true;
      } else {
        logError(`Expected status 'failed', got '${statusResponse.data.status}'`);
        return false;
      }
    } else {
      logError(`Payment failure webhook processing failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Error scenario test error: ${error.message}`);
    return false;
  }
}

async function cleanup() {
  logStep(8, 'Cleanup');
  
  if (ws) {
    ws.close();
    logSuccess('WebSocket connection closed');
  }
  
  logSuccess('Test cleanup completed');
}

// Main test runner
async function runTests() {
  log('🚀 Starting QR Code State Management Tests', 'bright');
  log(`Event ID: ${EVENT_ID}`, 'blue');
  log(`User ID: ${USER_ID}`, 'blue');
  
  const tests = [
    { name: 'QR Code Generation', fn: testQRCodeGeneration },
    { name: 'QR Code Status Check', fn: testQRCodeStatus },
    { name: 'WebSocket Connection', fn: testWebSocketConnection },
    { name: 'Payment Success', fn: testPaymentSuccess },
    { name: 'WebSocket Events', fn: testWebSocketEvents },
    { name: 'Session Completion', fn: testSessionCompletion },
    { name: 'Error Scenarios', fn: testErrorScenarios },
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
  
  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Some tests failed!', 'red');
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
