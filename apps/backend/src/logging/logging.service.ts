import { Injectable, Logger } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { eventLogs, NewEventLog, NewWebhookLog, webhookLogs } from '../database/schema';

export interface LogWebhookOptions {
  eventType: string;
  paymongoEventId?: string;
  paymongoSignature?: string;
  requestPayload: any;
  requestHeaders?: any;
  qrCodeId?: string;
  eventId?: string;
  paymentIntentId?: string;
  signatureVerified?: boolean;
}

export interface LogEventOptions {
  eventType: string;
  source: 'webhook' | 'api' | 'cron_job' | 'manual';
  qrCodeId?: string;
  eventId?: string;
  userId?: string;
  eventData?: any;
  metadata?: any;
  status?: 'success' | 'error' | 'warning';
  message?: string;
  errorDetails?: string;
}


@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(private databaseService: DatabaseService) {}

  /**
   * Log webhook events from PayMongo
   */
  async logWebhook(options: LogWebhookOptions): Promise<string> {
    const db = this.databaseService.getDb();
    
    try {
      const webhookLog: NewWebhookLog = {
        eventType: options.eventType,
        paymongoEventId: options.paymongoEventId,
        paymongoSignature: options.paymongoSignature,
        requestPayload: options.requestPayload,
        requestHeaders: options.requestHeaders,
        qrCodeId: options.qrCodeId,
        eventId: options.eventId,
        paymentIntentId: options.paymentIntentId,
        signatureVerified: options.signatureVerified || false,
        status: 'received',
      };

      const [created] = await db.insert(webhookLogs).values(webhookLog).returning();
      
      this.logger.log(`Webhook logged: ${options.eventType} (${created.id})`);
      return created.id;
    } catch (error) {
      this.logger.error('Failed to log webhook:', error);
      throw error;
    }
  }

  /**
   * Update webhook log status and processing details
   */
  async updateWebhookLog(
    webhookLogId: string, 
    status: 'processing' | 'completed' | 'failed',
    errorMessage?: string,
    errorStack?: string
  ): Promise<void> {
    const db = this.databaseService.getDb();
    
    try {
      await db
        .update(webhookLogs)
        .set({
          status,
          processedAt: new Date(),
          errorMessage,
          errorStack,
          updatedAt: new Date(),
        })
        .where(eq(webhookLogs.id, webhookLogId));

      this.logger.log(`Webhook log updated: ${webhookLogId} -> ${status}`);
    } catch (error) {
      this.logger.error(`Failed to update webhook log ${webhookLogId}:`, error);
    }
  }

  /**
   * Log application events (QR generation, payments, etc.)
   */
  async logEvent(options: LogEventOptions): Promise<string> {
    const db = this.databaseService.getDb();
    
    try {
      const eventLog: NewEventLog = {
        eventType: options.eventType,
        source: options.source,
        qrCodeId: options.qrCodeId,
        eventId: options.eventId,
        userId: options.userId,
        eventData: options.eventData,
        metadata: options.metadata,
        status: options.status || 'success',
        message: options.message,
        errorDetails: options.errorDetails,
      };

      const [created] = await db.insert(eventLogs).values(eventLog).returning();
      
      this.logger.log(`Event logged: ${options.eventType} (${created.id})`);
      return created.id;
    } catch (error) {
      this.logger.error('Failed to log event:', error);
      throw error;
    }
  }

  /**
   * Get webhook logs with optional filtering
   */
  async getWebhookLogs(options?: {
    eventType?: string;
    status?: string;
    qrCodeId?: string;
    eventId?: string;
    limit?: number;
    offset?: number;
  }) {
    const db = this.databaseService.getDb();
    
    const query = db.select().from(webhookLogs);
    
    // Add filters if provided
    const conditions = [];
    if (options?.eventType) conditions.push(eq(webhookLogs.eventType, options.eventType));
    if (options?.status) conditions.push(eq(webhookLogs.status, options.status));
    if (options?.qrCodeId) conditions.push(eq(webhookLogs.qrCodeId, options.qrCodeId));
    if (options?.eventId) conditions.push(eq(webhookLogs.eventId, options.eventId));
    
    if (conditions.length > 0) {
      // Apply AND conditions
       query.where(and(...conditions));
    }
    
     query.orderBy(desc(webhookLogs.createdAt));
    
    if (options?.limit)  query.limit(options.limit);
    if (options?.offset)  query.offset(options.offset);
    
    return await query;
  }

  /**
   * Get event logs with optional filtering
   */
  async getEventLogs(options?: {
    eventType?: string;
    source?: string;
    status?: string;
    qrCodeId?: string;
    eventId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) {
    const db = this.databaseService.getDb();
    
    const query = db.select().from(eventLogs);
    
    // Add filters if provided
    const conditions = [];
    if (options?.eventType) conditions.push(eq(eventLogs.eventType, options.eventType));
    if (options?.source) conditions.push(eq(eventLogs.source, options.source));
    if (options?.status) conditions.push(eq(eventLogs.status, options.status));
    if (options?.qrCodeId) conditions.push(eq(eventLogs.qrCodeId, options.qrCodeId));
    if (options?.eventId) conditions.push(eq(eventLogs.eventId, options.eventId));
    if (options?.userId) conditions.push(eq(eventLogs.userId, options.userId));
    
    if (conditions.length > 0) {
      // Apply AND conditions
       query.where(and(...conditions));
    }
    
     query.orderBy(desc(eventLogs.createdAt));
    
    if (options?.limit)  query.limit(options.limit);
    if (options?.offset)  query.offset(options.offset);
    
    return await query;
  }


  /**
   * Get logs summary/stats
   */
  async getLogsSummary() {
    const db = this.databaseService.getDb();
    
    try {
      // Get webhook stats
      const webhookStats = await db
        .select({
          status: webhookLogs.status,
          count: count(),
        })
        .from(webhookLogs)
        .groupBy(webhookLogs.status);

      // Get event stats  
      const eventStats = await db
        .select({
          eventType: eventLogs.eventType,
          status: eventLogs.status,
          count: count(),
        })
        .from(eventLogs)
        .groupBy(eventLogs.eventType, eventLogs.status);

      return {
        webhooks: webhookStats,
        events: eventStats,
      };
    } catch (error) {
      this.logger.error('Failed to get logs summary:', error);
      throw error;
    }
  }
}