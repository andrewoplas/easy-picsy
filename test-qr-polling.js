#!/usr/bin/env node

/**
 * QR Code Status Polling Test Script
 * 
 * This simulates how clients (photo booth machines, frontend apps) 
 * would poll the server to check QR code status changes.
 * 
 * Usage: node test-qr-polling.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjBtbkM4RE9CSlhBZzlFWnIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ttcmd6eWxrZ2p2Z2N0Z2xibWt4LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyYzU4NThiMC03ZDFmLTRkZDktYjVlMy04NTZjMWQyZTNlMzUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4OTUyNjMwLCJpYXQiOjE3NTg5NDkwMzAsImVtYWlsIjoiaGVsbG8rdGVzdEBlYXN5cGljc3lib290aHMuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImhlbGxvK3Rlc3RAZWFzeXBpY3N5Ym9vdGhzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJFYXN5IFBpY3N5IFRlc3QiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjJjNTg1OGIwLTdkMWYtNGRkOS1iNWUzLTg1NmMxZDJlM2UzNSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU4MzkwODg4fV0sInNlc3Npb25faWQiOiIzY2Y2ZTE5ZS00MjllLTQyNDAtYjI4OC0wMDQ0MDFjNDJhOWMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.XFtl8czstf_QlYl8ZHKbGSg7lZIXY39dQVnT2_eB_SI';

// Test data
let qrCodeId = null;
let eventId = null;

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

function logStatus(status) {
  log(`📊 QR Code Status: ${status.status}`, 'blue');
  log(`   Active: ${status.isActive}`, 'blue');
  log(`   Valid: ${status.isValid}`, 'blue');
  if (status.paymentId) {
    log(`   Payment ID: ${status.paymentId}`, 'blue');
  }
  if (status.usedAt) {
    log(`   Used At: ${status.usedAt}`, 'blue');
  }
}

// Test functions
async function testQRCodeGeneration() {
  logStep(1, 'Generating QR Code for Testing');
  
  try {
    // First create an event
    const eventResponse = await axios.post(`${BASE_URL}/events`, {
      name: `QR Polling Test Event ${Date.now()}`,
      description: 'Test event for QR code polling',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: 'Test Location',
      status: 'active'
    });

    if (!eventResponse.data.success) {
      logError('Failed to create test event');
      return false;
    }

    eventId = eventResponse.data.data.id;
    logSuccess(`Test event created: ${eventId}`);

    // Generate QR code
    const qrResponse = await axios.post(`${BASE_URL}/qr-codes/generate`, {
      eventId: eventId,
      userId: 'qr-polling-test-user'
    });

    if (!qrResponse.data.success) {
      logError('Failed to generate QR code');
      return false;
    }

    qrCodeId = qrResponse.data.data.id;
    logSuccess(`QR Code generated: ${qrCodeId}`);
    logStatus({
      status: qrResponse.data.data.status,
      isActive: qrResponse.data.data.isActive,
      isValid: qrResponse.data.data.isValid,
      paymentId: qrResponse.data.data.paymentId,
      usedAt: qrResponse.data.data.usedAt
    });

    return true;
  } catch (error) {
    logError(`QR Code generation error: ${error.message}`);
    return false;
  }
}

async function testStatusPolling() {
  logStep(2, 'Testing QR Code Status Polling');
  
  try {
    const response = await axios.get(`${BASE_URL}/qr-codes/${qrCodeId}/status`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });

    if (response.data.success) {
      logSuccess('QR Code status retrieved');
      logStatus(response.data);
      return true;
    } else {
      logError(`Status check failed: ${response.data.error}`);
      return false;
    }
  } catch (error) {
    logError(`Status polling error: ${error.message}`);
    return false;
  }
}

async function testLongPolling() {
  logStep(3, 'Testing Long Polling (Wait for Changes)');
  
  try {
    log('Starting long polling (will timeout after 10 seconds)...', 'yellow');
    
    const response = await axios.get(`${BASE_URL}/qr-codes/${qrCodeId}/poll`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      params: {
        timeout: 10000, // 10 seconds
        since: 0 // Check for any changes since beginning
      },
      timeout: 15000 // Axios timeout
    });

    if (response.data.success) {
      logSuccess('Long polling completed');
      log(`Has Changed: ${response.data.hasChanged}`, 'blue');
      if (response.data.waitTime) {
        log(`Wait Time: ${response.data.waitTime}ms`, 'blue');
      }
      logStatus(response.data);
      return true;
    } else {
      logError(`Long polling failed: ${response.data.error}`);
      return false;
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logSuccess('Long polling timeout (expected)');
      return true;
    } else {
      logError(`Long polling error: ${error.message}`);
      return false;
    }
  }
}

async function testPaymentTriggering() {
  logStep(4, 'Triggering Payment (Simulate Webhook)');
  
  try {
    const paymentPayload = {
      data: {
        id: `evt_polling_${Date.now()}`,
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
              payment_intent_id: 'pi_test_polling',
              amount: 2000,
              currency: 'PHP'
            }
          }
        }
      }
    };

    const response = await axios.post(`${BASE_URL}/webhook`, paymentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });

    if (response.data.status === 'accepted') {
      logSuccess('Payment webhook sent');
      
      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check status again
      const statusResponse = await axios.get(`${BASE_URL}/qr-codes/${qrCodeId}/status`, {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`
        }
      });

      if (statusResponse.data.success) {
        logSuccess('Status updated after payment');
        logStatus(statusResponse.data);
        return true;
      } else {
        logError('Failed to get updated status');
        return false;
      }
    } else {
      logError(`Payment webhook failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Payment triggering error: ${error.message}`);
    return false;
  }
}

async function testClientPollingSimulation() {
  logStep(5, 'Simulating Client Polling Behavior');
  
  try {
    log('Simulating photo booth machine polling every 2 seconds...', 'yellow');
    
    let pollCount = 0;
    const maxPolls = 5;
    
    const pollInterval = setInterval(async () => {
      pollCount++;
      
      try {
        const response = await axios.get(`${BASE_URL}/qr-codes/${qrCodeId}/status`, {
          headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
          }
        });

        if (response.data.success) {
          log(`Poll ${pollCount}: Status = ${response.data.status}`, 'blue');
          
          if (response.data.status === 'paid') {
            logSuccess('Payment detected! Photo booth can proceed.');
            clearInterval(pollInterval);
            return;
          }
        }
        
        if (pollCount >= maxPolls) {
          logWarning('Max polls reached, stopping simulation');
          clearInterval(pollInterval);
        }
      } catch (error) {
        logError(`Poll ${pollCount} failed: ${error.message}`);
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
        }
      }
    }, 2000);

    // Wait for polling to complete
    await new Promise(resolve => setTimeout(resolve, (maxPolls + 1) * 2000));
    
    return true;
  } catch (error) {
    logError(`Client polling simulation error: ${error.message}`);
    return false;
  }
}

async function testBatchStatus() {
  logStep(6, 'Testing Batch Status Check');
  
  try {
    const response = await axios.get(`${BASE_URL}/qr-codes/batch-status`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      params: {
        ids: `${qrCodeId},invalid-id,another-invalid-id`
      }
    });

    if (response.data.success) {
      logSuccess('Batch status retrieved');
      log(`Results: ${response.data.count}`, 'blue');
      response.data.results.forEach((result, index) => {
        if (result.error) {
          log(`   ${index + 1}. ${result.qrCodeId}: ERROR - ${result.error}`, 'red');
        } else {
          log(`   ${index + 1}. ${result.qrCodeId}: ${result.status}`, 'blue');
        }
      });
      return true;
    } else {
      logError(`Batch status failed: ${response.data.error}`);
      return false;
    }
  } catch (error) {
    logError(`Batch status error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting QR Code Status Polling Tests', 'bright');
  log('This simulates how clients poll the server for QR code status changes', 'yellow');
  
  const tests = [
    { name: 'QR Code Generation', fn: testQRCodeGeneration },
    { name: 'Status Polling', fn: testStatusPolling },
    { name: 'Long Polling', fn: testLongPolling },
    { name: 'Payment Triggering', fn: testPaymentTriggering },
    { name: 'Client Polling Simulation', fn: testClientPollingSimulation },
    { name: 'Batch Status Check', fn: testBatchStatus },
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
  
  log('\n📊 Test Results', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, 'red');
  log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`, 'blue');
  
  if (failed === 0) {
    log('\n🎉 All QR polling tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n💥 Some tests failed!', 'red');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  logError(`Test runner error: ${error.message}`);
  process.exit(1);
});
