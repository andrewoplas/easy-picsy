#!/usr/bin/env node

/**
 * Socket.IO Client Test
 * This tests using the proper Socket.IO client instead of raw WebSocket
 */

const { io } = require('socket.io-client');

console.log('🔍 Testing Socket.IO Connection...');
console.log('📍 URL: http://localhost:3000/events');

// Connect using Socket.IO client
const socket = io('http://localhost:3000/events', {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: false,
  timeout: 5000,
});

socket.on('connect', () => {
  console.log('✅ Socket.IO connected successfully!');
  console.log('🆔 Socket ID:', socket.id);
  
  // Test basic message
  console.log('📤 Sending test message...');
  socket.emit('test', { message: 'Hello from Socket.IO client' });
  
  // Test join event
  console.log('📤 Sending joinEvent message...');
  socket.emit('joinEvent', { eventId: 'test-event-123' });
});

socket.on('welcome', (data) => {
  console.log('📨 Received welcome:', data);
});

socket.on('testResponse', (data) => {
  console.log('📨 Received test response:', data);
});

socket.on('joinedEvent', (data) => {
  console.log('📨 Joined event:', data);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.IO connection error:', error.message);
  console.error('🔍 Error details:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Socket.IO disconnected:', reason);
});

// Timeout after 5 seconds
setTimeout(() => {
  if (socket.connected) {
    console.log('✅ Test completed successfully');
    socket.disconnect();
  } else {
    console.log('⏰ Test timed out');
    socket.disconnect();
  }
}, 5000);
