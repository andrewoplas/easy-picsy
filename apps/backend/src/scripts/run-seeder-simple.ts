#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { boothLogs, eventLogs, events, payments, qrCodes, webhookLogs } from '../database/schema';
import * as schema from '../database/schema';
import { randomUUID } from 'crypto';

// Type assertions to ensure tables are defined
const tables = {
  events,
  payments,
  qrCodes,
  boothLogs,
  eventLogs,
  webhookLogs
};

async function runSeeder() {
  // Get database URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create direct database connection
  const sql = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
  });

  const db = drizzle(sql, { schema });
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
    await db.delete(tables.webhookLogs);
    await db.delete(tables.eventLogs);
    await db.delete(tables.boothLogs);
    await db.delete(tables.qrCodes);
    await db.delete(tables.payments);
    await db.delete(tables.events);
    
    // Use existing test user IDs
    const testUserIds = [
      'afb3a4a0-a21d-49e4-8921-b6846f968b79', // Account 1
      'd1ddf893-552e-411c-9d7d-7834df188154', // Account 2
    ];
    
    // Seed events
    console.log('🎉 Seeding events...');
    const eventData = [
      // Current month events (September 2025) - Account 1
      {
        name: 'Wedding Photo Booth - September 2025',
        description: 'Beautiful wedding photo booth setup with premium props',
        price: '75.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2025-09-01T10:00:00Z'),
        updatedAt: new Date('2025-09-01T10:00:00Z'),
      },
      {
        name: 'Corporate Event - September 2025',
        description: 'Company team building event with professional setup',
        price: '100.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2025-09-05T14:00:00Z'),
        updatedAt: new Date('2025-09-05T14:00:00Z'),
      },
      {
        name: 'Birthday Party - September 2025',
        description: 'Kids birthday celebration with fun props',
        price: '50.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2025-09-10T16:00:00Z'),
        updatedAt: new Date('2025-09-10T16:00:00Z'),
      },
      {
        name: 'Graduation Party - September 2025',
        description: 'Graduation celebration with elegant setup',
        price: '60.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2025-09-15T18:00:00Z'),
        updatedAt: new Date('2025-09-15T18:00:00Z'),
      },
      // Previous month events (August 2025) - Account 1
      {
        name: "Valentine's Day Event - August 2025",
        description: "Romantic photo booth for Valentine's Day",
        price: '65.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2025-08-14T12:00:00Z'),
        updatedAt: new Date('2025-08-14T12:00:00Z'),
      },
      {
        name: 'Company Launch - August 2025',
        description: 'Product launch event with professional photography',
        price: '120.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2025-08-20T09:00:00Z'),
        updatedAt: new Date('2025-08-20T09:00:00Z'),
      },
      {
        name: 'Anniversary Celebration - August 2025',
        description: '50th wedding anniversary celebration',
        price: '55.00',
        currency: 'PHP',
        isActive: false,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2025-08-25T15:00:00Z'),
        updatedAt: new Date('2025-08-25T15:00:00Z'),
      },
    ];

    const createdEvents = [];
    for (const event of eventData) {
      const newEvent = await db.insert(tables.events).values(event).returning();
      createdEvents.push(newEvent[0]);
    }

    // Seed booth sessions with payments, QR codes, and webhook logs
    console.log('🎯 Seeding booth sessions with complete payment flow...');
    
    const allCreatedPayments = [];
    const allCreatedQrCodes = [];
    const allCreatedBoothLogs = [];
    const allCreatedEventLogs = [];
    const allCreatedWebhookLogs = [];
    
       // Current month sessions - Higher numbers for positive trends
       const currentMonthEvents = createdEvents.filter((e) => e.name.includes('September 2025'));
       for (let eventIndex = 0; eventIndex < currentMonthEvents.length; eventIndex++) {
         const event = currentMonthEvents[eventIndex];
         const sessionsPerEvent = 4; // More sessions for current month
         
         for (let session = 0; session < sessionsPerEvent; session++) {
           const sessionId = randomUUID();
           const randomDay = Math.floor(Math.random() * 28) + 1;
           const now = new Date();
           const sessionDate = new Date(now.getFullYear(), now.getMonth(), randomDay); // Current month
        
        // Create payment for this session
        const paymentAmount = (parseFloat(event.price) + Math.random() * 20).toFixed(2);
        const payment = {
          eventId: event.id,
          amount: paymentAmount,
          currency: 'PHP',
          status: 'completed' as const,
          paymongoPaymentId: `paymongo_${event.id}_${session}_${Date.now()}`,
          paymongoLinkId: `link_${event.id}_${session}_${Date.now()}`,
          paymentMethod: ['gcash', 'grabpay', 'paymaya'][Math.floor(Math.random() * 3)] as 'gcash' | 'grabpay' | 'paymaya',
          paidAt: sessionDate,
          createdAt: sessionDate,
          updatedAt: sessionDate,
        };
        
        const createdPayment = await db.insert(tables.payments).values(payment).returning();
        allCreatedPayments.push(createdPayment[0]);
        
        // Create QR code for this payment
        const qrCode = {
          eventId: event.id,
          sessionId: sessionId,
          paymentId: createdPayment[0].id,
          qrData: `https://easypicsy.com/qr/${event.id}/${sessionId}`,
          paymentIntentId: `pi_${createdPayment[0].paymongoPaymentId}`,
          paymongoLinkUrl: null,
          paymongoQrphId: `qrph_${event.id}_${sessionId}_${Date.now()}`,
          status: 'active' as const,
          expiresAt: new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000), // 24 hours from session
          usageCount: 1,
          maxUsage: 1,
          isActive: true,
          createdAt: sessionDate,
          usedAt: sessionDate, // QR code is used immediately for this session
          invalidatedAt: null,
        };
        
        const createdQrCode = await db.insert(tables.qrCodes).values(qrCode).returning();
        allCreatedQrCodes.push(createdQrCode[0]);
        
        // Create booth logs for this session
        const boothLogs = [];
        
        // Session start
        boothLogs.push({
          sessionId: sessionId,
          boothEventType: 'session_start' as const,
          timestamp: '10:00:00.000',
          param1: null,
          param2: null,
          param3: null,
          param4: null,
          eventId: event.id,
          qrCodeId: createdQrCode[0].id,
          boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
          status: 'success' as const,
          message: 'Session started successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });

        // Session prints (3-5 prints per session)
        const numPrints = 3 + Math.floor(Math.random() * 3);
        for (let print = 0; print < numPrints; print++) {
          boothLogs.push({
            sessionId: sessionId,
            boothEventType: 'printing' as const,
            timestamp: `10:${(print + 1).toString().padStart(2, '0')}:00.000`,
            param1: `photo_${print + 1}.jpg`,
            param2: '1',
            param3: 'high_quality',
            param4: 'color',
            eventId: event.id,
            qrCodeId: createdQrCode[0].id,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            status: 'success' as const,
            message: 'Photo printed successfully',
            errorDetails: null,
            createdAt: new Date(sessionDate.getTime() + (print + 1) * 60000),
          });
        }

        // Reprints (1-2 reprints per session)
        const numReprints = 1 + Math.floor(Math.random() * 2);
        for (let reprint = 0; reprint < numReprints; reprint++) {
          boothLogs.push({
            sessionId: sessionId,
            boothEventType: 'printing' as const,
            timestamp: `10:${(numPrints + reprint + 1).toString().padStart(2, '0')}:00.000`,
            param1: `photo_${reprint + 1}.jpg`, // Same photo as before
            param2: '1',
            param3: 'high_quality',
            param4: 'color',
            eventId: event.id,
            qrCodeId: createdQrCode[0].id,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            status: 'success' as const,
            message: 'Photo reprinted successfully',
            errorDetails: null,
            createdAt: new Date(sessionDate.getTime() + (numPrints + reprint + 1) * 60000),
          });
        }

        // Session end
        boothLogs.push({
          sessionId: sessionId,
          boothEventType: 'session_end' as const,
          timestamp: `10:${(numPrints + numReprints + 1).toString().padStart(2, '0')}:00.000`,
          param1: null,
          param2: null,
          param3: null,
          param4: null,
          eventId: event.id,
          qrCodeId: createdQrCode[0].id,
          boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
          status: 'success' as const,
          message: 'Session ended successfully',
          errorDetails: null,
          createdAt: new Date(sessionDate.getTime() + (numPrints + numReprints + 1) * 60000),
        });
        
        // Insert booth logs for this session
        for (const boothLog of boothLogs) {
          const createdBoothLog = await db.insert(tables.boothLogs).values(boothLog).returning();
          allCreatedBoothLogs.push(createdBoothLog[0]);
        }
        
        // Create event logs for this session
        const eventLogs = [];
        
        // QR Generated event
        eventLogs.push({
          eventType: 'qr_generated' as const,
          source: 'api' as const,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          userId: event.createdBy,
          eventData: {
            qrData: createdQrCode[0].qrData,
            expiresAt: createdQrCode[0].expiresAt,
            maxUsage: createdQrCode[0].maxUsage,
          },
          metadata: {
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            sessionId: sessionId,
          },
          status: 'success' as const,
          message: 'QR code generated successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });

        // Payment Success event
        eventLogs.push({
          eventType: 'payment_success' as const,
          source: 'webhook' as const,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          userId: event.createdBy,
          eventData: {
            paymentAmount: paymentAmount,
            currency: 'PHP',
            paymentMethod: payment.paymentMethod,
          },
          metadata: {
            paymongoPaymentId: createdPayment[0].paymongoPaymentId,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            sessionId: sessionId,
          },
          status: 'success' as const,
          message: 'Payment completed successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });
        
        // Insert event logs for this session
        for (const eventLog of eventLogs) {
          const createdEventLog = await db.insert(tables.eventLogs).values(eventLog).returning();
          allCreatedEventLogs.push(createdEventLog[0]);
        }
        
        // Create webhook logs for this session
        const webhookLogs = [];
        
        // Payment webhook
        webhookLogs.push({
          eventType: 'payment.paid' as const,
          paymongoEventId: `evt_${event.id}_${sessionId}_${Date.now()}`,
          paymongoSignature: `sig_${event.id}_${sessionId}_${Date.now()}`,
          requestPayload: {
            data: {
              id: createdPayment[0].paymongoPaymentId,
              type: 'payment',
              attributes: {
                amount: Math.round(parseFloat(paymentAmount) * 100), // in centavos
                currency: 'PHP',
                status: 'paid' as const,
                created_at: sessionDate.toISOString(),
              },
            },
          },
          requestHeaders: {
            'content-type': 'application/json',
            'x-paymongo-signature': `sig_${event.id}_${sessionId}_${Date.now()}`,
          },
          status: 'completed' as const,
          processedAt: sessionDate,
          errorMessage: null,
          errorStack: null,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          paymentIntentId: createdQrCode[0].paymentIntentId,
          signatureVerified: true,
          createdAt: sessionDate,
          updatedAt: sessionDate,
        });
        
        // Insert webhook logs for this session
        for (const webhookLog of webhookLogs) {
          const createdWebhookLog = await db.insert(tables.webhookLogs).values(webhookLog).returning();
          allCreatedWebhookLogs.push(createdWebhookLog[0]);
        }
      }
    }

       // Previous month sessions - Lower numbers for trend comparison
       const previousMonthEvents = createdEvents.filter((e) => e.name.includes('August 2025'));
       for (let eventIndex = 0; eventIndex < previousMonthEvents.length; eventIndex++) {
         const event = previousMonthEvents[eventIndex];
         const sessionsPerEvent = 2; // Fewer sessions for previous month
         
         for (let session = 0; session < sessionsPerEvent; session++) {
           const sessionId = randomUUID();
           const randomDay = Math.floor(Math.random() * 28) + 1;
           const now = new Date();
           const sessionDate = new Date(now.getFullYear(), now.getMonth() - 1, randomDay); // Previous month
        
        // Create payment for this session
        const paymentAmount = (parseFloat(event.price) + Math.random() * 15).toFixed(2);
        const payment = {
          eventId: event.id,
          amount: paymentAmount,
          currency: 'PHP',
          status: 'completed' as const,
          paymongoPaymentId: `paymongo_${event.id}_${session}_${Date.now()}`,
          paymongoLinkId: `link_${event.id}_${session}_${Date.now()}`,
          paymentMethod: ['gcash', 'grabpay', 'paymaya'][Math.floor(Math.random() * 3)] as 'gcash' | 'grabpay' | 'paymaya',
          paidAt: sessionDate,
          createdAt: sessionDate,
          updatedAt: sessionDate,
        };
        
        const createdPayment = await db.insert(tables.payments).values(payment).returning();
        allCreatedPayments.push(createdPayment[0]);
        
        // Create QR code for this payment
        const qrCode = {
          eventId: event.id,
          sessionId: sessionId,
          paymentId: createdPayment[0].id,
          qrData: `https://easypicsy.com/qr/${event.id}/${sessionId}`,
          paymentIntentId: `pi_${createdPayment[0].paymongoPaymentId}`,
          paymongoLinkUrl: null,
          paymongoQrphId: `qrph_${event.id}_${sessionId}_${Date.now()}`,
          status: 'active' as const,
          expiresAt: new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000), // 24 hours from session
          usageCount: 1,
          maxUsage: 1,
          isActive: true,
          createdAt: sessionDate,
          usedAt: sessionDate, // QR code is used immediately for this session
          invalidatedAt: null,
        };
        
        const createdQrCode = await db.insert(tables.qrCodes).values(qrCode).returning();
        allCreatedQrCodes.push(createdQrCode[0]);
        
        // Create booth logs for this session
        const boothLogs = [];
        
        // Session start
        boothLogs.push({
          sessionId: sessionId,
          boothEventType: 'session_start' as const,
          timestamp: '10:00:00.000',
          param1: null,
          param2: null,
          param3: null,
          param4: null,
          eventId: event.id,
          qrCodeId: createdQrCode[0].id,
          boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
          status: 'success' as const,
          message: 'Session started successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });

        // Session prints (2-3 prints per session)
        const numPrints = 2 + Math.floor(Math.random() * 2);
        for (let print = 0; print < numPrints; print++) {
          boothLogs.push({
            sessionId: sessionId,
            boothEventType: 'printing' as const,
            timestamp: `10:${(print + 1).toString().padStart(2, '0')}:00.000`,
            param1: `photo_${print + 1}.jpg`,
            param2: '1',
            param3: 'high_quality',
            param4: 'color',
            eventId: event.id,
            qrCodeId: createdQrCode[0].id,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            status: 'success' as const,
            message: 'Photo printed successfully',
            errorDetails: null,
            createdAt: new Date(sessionDate.getTime() + (print + 1) * 60000),
          });
        }

        // Reprints (0-1 reprints per session)
        const numReprints = Math.floor(Math.random() * 2);
        for (let reprint = 0; reprint < numReprints; reprint++) {
          boothLogs.push({
            sessionId: sessionId,
            boothEventType: 'printing' as const,
            timestamp: `10:${(numPrints + reprint + 1).toString().padStart(2, '0')}:00.000`,
            param1: `photo_${reprint + 1}.jpg`,
            param2: '1',
            param3: 'high_quality',
            param4: 'color',
            eventId: event.id,
            qrCodeId: createdQrCode[0].id,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            status: 'success' as const,
            message: 'Photo reprinted successfully',
            errorDetails: null,
            createdAt: new Date(sessionDate.getTime() + (numPrints + reprint + 1) * 60000),
          });
        }

        // Session end
        boothLogs.push({
          sessionId: sessionId,
          boothEventType: 'session_end' as const,
          timestamp: `10:${(numPrints + numReprints + 1).toString().padStart(2, '0')}:00.000`,
          param1: null,
          param2: null,
          param3: null,
          param4: null,
          eventId: event.id,
          qrCodeId: createdQrCode[0].id,
          boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
          status: 'success' as const,
          message: 'Session ended successfully',
          errorDetails: null,
          createdAt: new Date(sessionDate.getTime() + (numPrints + numReprints + 1) * 60000),
        });
        
        // Insert booth logs for this session
        for (const boothLog of boothLogs) {
          const createdBoothLog = await db.insert(tables.boothLogs).values(boothLog).returning();
          allCreatedBoothLogs.push(createdBoothLog[0]);
        }
        
        // Create event logs for this session
        const eventLogs = [];
        
        // QR Generated event
        eventLogs.push({
          eventType: 'qr_generated' as const,
          source: 'api' as const,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          userId: event.createdBy,
          eventData: {
            qrData: createdQrCode[0].qrData,
            expiresAt: createdQrCode[0].expiresAt,
            maxUsage: createdQrCode[0].maxUsage,
          },
          metadata: {
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            sessionId: sessionId,
          },
          status: 'success' as const,
          message: 'QR code generated successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });

        // Payment Success event
        eventLogs.push({
          eventType: 'payment_success' as const,
          source: 'webhook' as const,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          userId: event.createdBy,
          eventData: {
            paymentAmount: paymentAmount,
            currency: 'PHP',
            paymentMethod: payment.paymentMethod,
          },
          metadata: {
            paymongoPaymentId: createdPayment[0].paymongoPaymentId,
            boothIdentifier: `Booth-${(eventIndex % 3) + 1}`,
            sessionId: sessionId,
          },
          status: 'success' as const,
          message: 'Payment completed successfully',
          errorDetails: null,
          createdAt: sessionDate,
        });
        
        // Insert event logs for this session
        for (const eventLog of eventLogs) {
          const createdEventLog = await db.insert(tables.eventLogs).values(eventLog).returning();
          allCreatedEventLogs.push(createdEventLog[0]);
        }
        
        // Create webhook logs for this session
        const webhookLogs = [];
        
        // Payment webhook
        webhookLogs.push({
          eventType: 'payment.paid' as const,
          paymongoEventId: `evt_${event.id}_${sessionId}_${Date.now()}`,
          paymongoSignature: `sig_${event.id}_${sessionId}_${Date.now()}`,
          requestPayload: {
            data: {
              id: createdPayment[0].paymongoPaymentId,
              type: 'payment',
              attributes: {
                amount: Math.round(parseFloat(paymentAmount) * 100), // in centavos
                currency: 'PHP',
                status: 'paid' as const,
                created_at: sessionDate.toISOString(),
              },
            },
          },
          requestHeaders: {
            'content-type': 'application/json',
            'x-paymongo-signature': `sig_${event.id}_${sessionId}_${Date.now()}`,
          },
          status: 'completed' as const,
          processedAt: sessionDate,
          errorMessage: null,
          errorStack: null,
          qrCodeId: createdQrCode[0].id,
          eventId: event.id,
          paymentIntentId: createdQrCode[0].paymentIntentId,
          signatureVerified: true,
          createdAt: sessionDate,
          updatedAt: sessionDate,
        });
        
        // Insert webhook logs for this session
        for (const webhookLog of webhookLogs) {
          const createdWebhookLog = await db.insert(tables.webhookLogs).values(webhookLog).returning();
          allCreatedWebhookLogs.push(createdWebhookLog[0]);
        }
      }
    }


    console.log('✅ Database seeding completed successfully!');
    console.log(`👥 Using existing users: ${testUserIds.length}`);
    console.log(`🎉 Events: ${createdEvents.length}`);
    console.log(`💳 Payments: ${allCreatedPayments.length}`);
    console.log(`📱 QR Codes: ${allCreatedQrCodes.length}`);
    console.log(`📊 Booth Logs: ${allCreatedBoothLogs.length}`);
    console.log(`📝 Event Logs: ${allCreatedEventLogs.length}`);
    console.log(`🔗 Webhook Logs: ${allCreatedWebhookLogs.length}`);
    console.log('');
    console.log('🎯 Each print/reprint now has:');
    console.log('   ✅ Associated payment record');
    console.log('   ✅ Linked QR code');
    console.log('   ✅ Corresponding webhook logs');
    console.log('   ✅ Event logs for tracking');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close database connection
    await sql.end();
    console.log('🗄️ Database connection closed');
  }
}

runSeeder().catch(console.error);
