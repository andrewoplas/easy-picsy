#!/usr/bin/env node

/**
 * Simple WebSocket Debug Test
 * This script tests the WebSocket connection step by step
 */

const WebSocket = require('ws');

const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjBtbkM4RE9CSlhBZzlFWnIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ttcmd6eWxrZ2p2Z2N0Z2xibWt4LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyYzU4NThiMC03ZDFmLTRkZDktYjVlMy04NTZjMWQyZTNlMzUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU4OTUyNjMwLCJpYXQiOjE3NTg5NDkwMzAsImVtYWlsIjoiaGVsbG8rdGVzdEBlYXN5cGljc3lib290aHMuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6ImhlbGxvK3Rlc3RAZWFzeXBpY3N5Ym9vdGhzLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJFYXN5IFBpY3N5IFRlc3QiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjJjNTg1OGIwLTdkMWYtNGRkOS1iNWUzLTg1NmMxZDJlM2UzNSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzU4MzkwODg4fV0sInNlc3Npb25faWQiOiIzY2Y2ZTE5ZS00MjllLTQyNDAtYjI4OC0wMDQ0MDFjNDJhOWMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.XFtl8czstf_QlYl8ZHKbGSg7lZIXY39dQVnT2_eB_SI';

console.log('🔍 Testing WebSocket Connection...');
console.log('📍 URL: ws://localhost:3000/events');
console.log('🔑 Token: ' + JWT_TOKEN.substring(0, 50) + '...');

// Test 1: Basic HTTP connection first
console.log('\n1️⃣ Testing HTTP endpoint first...');
const http = require('http');

const httpOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET'
};

const httpReq = http.request(httpOptions, (res) => {
  console.log(`✅ HTTP Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`📄 Response: ${chunk.toString()}`);
  });
  
  // If HTTP works, test WebSocket
  if (res.statusCode === 200) {
    testWebSocket();
  }
});

httpReq.on('error', (err) => {
  console.error('❌ HTTP Error:', err.message);
  console.log('💡 Make sure the backend server is running on port 3000');
});

httpReq.end();

function testWebSocket() {
  console.log('\n2️⃣ Testing WebSocket connection...');
  
  const ws = new WebSocket('ws://localhost:3000/events', {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`
    }
  });

  ws.on('open', function open() {
    console.log('✅ WebSocket connected successfully!');
    
    // Test joining an event room
    console.log('\n3️⃣ Testing joinEvent message...');
    const joinMessage = {
      event: 'joinEvent',
      data: { eventId: 'test-event-123' }
    };
    
    ws.send(JSON.stringify(joinMessage));
    console.log('📤 Sent joinEvent message');
  });

  ws.on('message', function message(data) {
    console.log('📨 Received message:', data.toString());
  });

  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
    console.error('🔍 Error details:', err);
  });

  ws.on('close', function close(code, reason) {
    console.log(`🔌 WebSocket closed: ${code} - ${reason}`);
  });

  // Timeout after 5 seconds
  setTimeout(() => {
    if (ws.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket test completed successfully');
      ws.close();
    } else {
      console.log('⏰ WebSocket test timed out');
    }
  }, 5000);
}
