#!/usr/bin/env node

/**
 * Simple WebSocket Test (No Authentication)
 * This tests the basic WebSocket connection without JWT
 */

const WebSocket = require('ws');

console.log('🔍 Testing Simple WebSocket Connection...');
console.log('📍 URL: ws://localhost:3000/events');

const ws = new WebSocket('ws://localhost:3000/events');

ws.on('open', function open() {
  console.log('✅ WebSocket connected successfully!');
  
  // Test basic message
  console.log('📤 Sending test message...');
  ws.send(JSON.stringify({
    event: 'test',
    data: { message: 'Hello from test client' }
  }));
  
  // Test join event
  console.log('📤 Sending joinEvent message...');
  ws.send(JSON.stringify({
    event: 'joinEvent',
    data: { eventId: 'test-event-123' }
  }));
});

ws.on('message', function message(data) {
  console.log('📨 Received:', data.toString());
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
    console.log('✅ Test completed successfully');
    ws.close();
  } else {
    console.log('⏰ Test timed out');
  }
}, 5000);
