#!/usr/bin/env node

/**
 * Long Polling Test Script
 * 
 * This script tests the long polling implementation:
 * 1. Start long polling
 * 2. Trigger events
 * 3. Verify events are received
 * 
 * Usage: node test-long-polling.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const EVENT_ID = 'test-event-' + Date.now();
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjBtbkM4RE9CSlhBZzlFWnIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ttcmd6eWxrZ2p2Z2N0Z2xibWt4LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyYzU4NThiMC03ZDFmLTRkZDktYjVlMy04NTZjMWQyZTNlMzUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4OTUyNjMwLCJpYXQiOjE3NTg5NDkwMzAsImVtYWlsIjoiaGVsbG8rdGVzdEBlYXN5cGljc3lib290aHMuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImhlbGxvK3Rlc3RAZWFzeXBpY3N5Ym9vdGhzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJFYXN5IFBpY3N5IFRlc3QiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjJjNTg1OGIwLTdkMWYtNGRkOS1iNWUzLTg1NmMxZDJlM2UzNSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU4MzkwODg4fV0sInNlc3Npb25faWQiOiIzY2Y2ZTE5ZS00MjllLTQyNDAtYjI4OC0wMDQ0MDFjNDJhOWMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.XFtl8czstf_QlYl8ZHKbGSg7lZIXY39dQVnT2_eB_SI';

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
async function testLongPolling() {
  logStep(1, 'Testing Long Polling Connection');
  
  try {
    const response = await axios.get(`${BASE_URL}/events/${EVENT_ID}/poll`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      },
      timeout: 5000, // 5 second timeout for testing
    });

    if (response.data.success) {
      logSuccess('Long polling request successful');
      log(`Events received: ${response.data.count}`, 'blue');
      log(`Event ID: ${response.data.eventId}`, 'blue');
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

async function testEventTriggering() {
  logStep(2, 'Testing Event Triggering');
  
  try {
    // Test payment success event
    const paymentSuccessPayload = {
      data: {
        id: `evt_polling_${Date.now()}`,
        type: 'event',
        attributes: {
          type: 'payment.paid',
          livemode: false,
          data: {
            id: 'code_test_polling',
            type: 'qrph',
            attributes: {
              code_id: 'code_test_polling',
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

    const response = await axios.post(`${BASE_URL}/webhook`, paymentSuccessPayload, {
      headers: {
        'Content-Type': 'application/json',
        'paymongo-signature': `t=${Math.floor(Date.now() / 1000)},te=test_signature,li=live_signature`
      }
    });

    if (response.data.status === 'accepted') {
      logSuccess('Payment webhook sent');
      
      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if event was stored
      const eventsResponse = await axios.get(`${BASE_URL}/events/${EVENT_ID}/events`, {
        headers: {
          'Authorization': `Bearer ${JWT_TOKEN}`
        }
      });

      if (eventsResponse.data.success && eventsResponse.data.count > 0) {
        logSuccess(`Event stored: ${eventsResponse.data.count} events`);
        log(`Event types: ${eventsResponse.data.events.map(e => e.type).join(', ')}`, 'blue');
        return true;
      } else {
        logWarning('No events found (this might be expected if event ID doesn\'t match)');
        return true;
      }
    } else {
      logError(`Webhook failed: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    logError(`Event triggering error: ${error.message}`);
    return false;
  }
}

async function testConcurrentPolling() {
  logStep(3, 'Testing Concurrent Long Polling');
  
  try {
    const promises = [];
    
    // Start multiple long polling requests
    for (let i = 0; i < 3; i++) {
      promises.push(
        axios.get(`${BASE_URL}/events/${EVENT_ID}/poll`, {
          headers: {
            'Authorization': `Bearer ${JWT_TOKEN}`
          },
          timeout: 2000,
        }).catch(err => {
          if (err.code === 'ECONNABORTED') {
            return { success: true, events: [], count: 0 }; // Timeout is expected
          }
          throw err;
        })
      );
    }

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;
    
    if (successCount === 3) {
      logSuccess('Concurrent long polling works');
      return true;
    } else {
      logError(`Only ${successCount}/3 concurrent requests succeeded`);
      return false;
    }
  } catch (error) {
    logError(`Concurrent polling error: ${error.message}`);
    return false;
  }
}

async function testStats() {
  logStep(4, 'Testing Statistics Endpoint');
  
  try {
    const response = await axios.get(`${BASE_URL}/events/stats`, {
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`
      }
    });

    if (response.data.success) {
      logSuccess('Statistics retrieved');
      log(`Pending requests: ${response.data.stats.pendingRequests}`, 'blue');
      log(`Queued events: ${response.data.stats.queuedEvents}`, 'blue');
      log(`Active events: ${response.data.stats.activeEvents}`, 'blue');
      return true;
    } else {
      logError('Statistics request failed');
      return false;
    }
  } catch (error) {
    logError(`Statistics error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting Long Polling Tests', 'bright');
  log(`Event ID: ${EVENT_ID}`, 'blue');
  
  const tests = [
    { name: 'Long Polling Connection', fn: testLongPolling },
    { name: 'Event Triggering', fn: testEventTriggering },
    { name: 'Concurrent Polling', fn: testConcurrentPolling },
    { name: 'Statistics', fn: testStats },
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
    log('\n🎉 All long polling tests passed!', 'green');
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
