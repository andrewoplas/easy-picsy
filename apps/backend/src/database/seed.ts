import { DatabaseService } from './database.service';
import { boothLogs, eventLogs, events, payments, qrCodes, webhookLogs } from './schema';
import { randomUUID } from 'crypto';

export class DatabaseSeeder {
  constructor(private readonly databaseService: DatabaseService) {}

  async seedAll() {
    const db = this.databaseService.getDb();

    try {
      console.log('🌱 Starting database seeding...');

      // Clear existing data (in reverse order of dependencies)
      await this.clearData(db);

      // Use existing test user IDs
      const testUserIds = [
        'afb3a4a0-a21d-49e4-8921-b6846f968b79', // Account 1
        'd1ddf893-552e-411c-9d7d-7834df188154', // Account 2
      ];

      // Seed events first
      const testEvents = await this.seedEvents(db, testUserIds);
      
      // Seed complete sessions with all related data
      const sessionData = await this.seedCompleteSessions(db, testEvents);

      console.log('✅ Database seeding completed successfully!');
      console.log(`👥 Using existing users: ${testUserIds.length}`);
      console.log(`🎉 Events: ${testEvents.length}`);
      console.log(`💳 Payments: ${sessionData.payments.length}`);
      console.log(`📱 QR Codes: ${sessionData.qrCodes.length}`);
      console.log(`📊 Booth Logs: ${sessionData.boothLogs.length}`);
      console.log(`📝 Event Logs: ${sessionData.eventLogs.length}`);
      console.log(`🔗 Webhook Logs: ${sessionData.webhookLogs.length}`);
      console.log('');
      console.log('🎯 Each print/reprint now has:');
      console.log('   ✅ Associated payment record');
      console.log('   ✅ Linked QR code');
      console.log('   ✅ Corresponding webhook logs');
      console.log('   ✅ Event logs for tracking');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  private async clearData(db: any) {
    console.log('🧹 Clearing existing data...');

    // Clear in reverse dependency order
    await db.delete(webhookLogs);
    await db.delete(eventLogs);
    await db.delete(boothLogs);
    await db.delete(qrCodes);
    await db.delete(payments);
    await db.delete(events);
    // Note: We don't delete users since we're using existing ones
  }

  private async seedCompleteSessions(db: any, testEvents: any[]) {
    console.log('🎯 Seeding complete sessions with payment flow...');
    
    const allPayments = [];
    const allQrCodes = [];
    const allBoothLogs = [];
    const allEventLogs = [];
    const allWebhookLogs = [];
    
           // Current month sessions - Higher numbers for positive trends
           const currentMonthEvents = testEvents.filter((e) => e.name.includes('March 2024'));
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
        
        const createdPayment = await db.insert(payments).values(payment).returning();
        allPayments.push(createdPayment[0]);
        
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
        
        const createdQrCode = await db.insert(qrCodes).values(qrCode).returning();
        allQrCodes.push(createdQrCode[0]);
        
        // Create booth logs for this session
        const sessionBoothLogs = [];
        
        // Session start
        sessionBoothLogs.push({
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
          sessionBoothLogs.push({
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
          sessionBoothLogs.push({
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
        sessionBoothLogs.push({
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
        for (const boothLog of sessionBoothLogs) {
          const createdBoothLog = await db.insert(boothLogs).values(boothLog).returning();
          allBoothLogs.push(createdBoothLog[0]);
        }
        
        // Create event logs for this session
        const sessionEventLogs = [];
        
        // QR Generated event
        sessionEventLogs.push({
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
        sessionEventLogs.push({
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
        for (const eventLog of sessionEventLogs) {
          const createdEventLog = await db.insert(eventLogs).values(eventLog).returning();
          allEventLogs.push(createdEventLog[0]);
        }
        
        // Create webhook logs for this session
        const sessionWebhookLogs = [];
        
        // Payment webhook
        sessionWebhookLogs.push({
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
        for (const webhookLog of sessionWebhookLogs) {
          const createdWebhookLog = await db.insert(webhookLogs).values(webhookLog).returning();
          allWebhookLogs.push(createdWebhookLog[0]);
        }
      }
    }

           // Previous month sessions - Lower numbers for trend comparison
           const previousMonthEvents = testEvents.filter((e) => e.name.includes('February 2024'));
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
        
        const createdPayment = await db.insert(payments).values(payment).returning();
        allPayments.push(createdPayment[0]);
        
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
        
        const createdQrCode = await db.insert(qrCodes).values(qrCode).returning();
        allQrCodes.push(createdQrCode[0]);
        
        // Create booth logs for this session
        const sessionBoothLogs = [];
        
        // Session start
        sessionBoothLogs.push({
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
          sessionBoothLogs.push({
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
          sessionBoothLogs.push({
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
        sessionBoothLogs.push({
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
        for (const boothLog of sessionBoothLogs) {
          const createdBoothLog = await db.insert(boothLogs).values(boothLog).returning();
          allBoothLogs.push(createdBoothLog[0]);
        }
        
        // Create event logs for this session
        const sessionEventLogs = [];
        
        // QR Generated event
        sessionEventLogs.push({
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
        sessionEventLogs.push({
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
        for (const eventLog of sessionEventLogs) {
          const createdEventLog = await db.insert(eventLogs).values(eventLog).returning();
          allEventLogs.push(createdEventLog[0]);
        }
        
        // Create webhook logs for this session
        const sessionWebhookLogs = [];
        
        // Payment webhook
        sessionWebhookLogs.push({
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
        for (const webhookLog of sessionWebhookLogs) {
          const createdWebhookLog = await db.insert(webhookLogs).values(webhookLog).returning();
          allWebhookLogs.push(createdWebhookLog[0]);
        }
      }
    }

    return {
      payments: allPayments,
      qrCodes: allQrCodes,
      boothLogs: allBoothLogs,
      eventLogs: allEventLogs,
      webhookLogs: allWebhookLogs,
    };
  }

  private async seedEvents(db: any, testUserIds: string[]) {
    console.log('🎉 Seeding events...');

    const eventData = [
      // Current month events (March 2024) - Account 1
      {
        name: 'Wedding Photo Booth - March 2024',
        description: 'Beautiful wedding photo booth setup with premium props',
        price: '75.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2024-03-01T10:00:00Z'),
        updatedAt: new Date('2024-03-01T10:00:00Z'),
      },
      {
        name: 'Corporate Event - March 2024',
        description: 'Company team building event with professional setup',
        price: '100.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2024-03-05T14:00:00Z'),
        updatedAt: new Date('2024-03-05T14:00:00Z'),
      },
      {
        name: 'Birthday Party - March 2024',
        description: 'Kids birthday celebration with fun props',
        price: '50.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2024-03-10T16:00:00Z'),
        updatedAt: new Date('2024-03-10T16:00:00Z'),
      },
      {
        name: 'Graduation Party - March 2024',
        description: 'Graduation celebration with elegant setup',
        price: '60.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2024-03-15T18:00:00Z'),
        updatedAt: new Date('2024-03-15T18:00:00Z'),
      },
      // Previous month events (February 2024) - Account 1
      {
        name: "Valentine's Day Event - February 2024",
        description: "Romantic photo booth for Valentine's Day",
        price: '65.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2024-02-14T12:00:00Z'),
        updatedAt: new Date('2024-02-14T12:00:00Z'),
      },
      {
        name: 'Company Launch - February 2024',
        description: 'Product launch event with professional photography',
        price: '120.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[1], // Account 2
        createdAt: new Date('2024-02-20T09:00:00Z'),
        updatedAt: new Date('2024-02-20T09:00:00Z'),
      },
      {
        name: 'Anniversary Celebration - February 2024',
        description: '50th wedding anniversary celebration',
        price: '55.00',
        currency: 'PHP',
        isActive: true,
        createdBy: testUserIds[0], // Account 1
        createdAt: new Date('2024-02-25T15:00:00Z'),
        updatedAt: new Date('2024-02-25T15:00:00Z'),
      },
    ];

    const createdEvents = [];
    for (const event of eventData) {
      const newEvent = await db.insert(events).values(event).returning();
      createdEvents.push(newEvent[0]);
    }

    return createdEvents;
  }
}

// Main execution function
async function main() {
  try {
    // This would be called from your main application
    // const databaseService = new DatabaseService();
    // const seeder = new DatabaseSeeder(databaseService);
    // await seeder.seedAll();

    console.log('🌱 Database seeder ready!');
    console.log('📖 To use: import DatabaseSeeder and call seedAll() method');
  } catch (error) {
    console.error('❌ Error in main:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}