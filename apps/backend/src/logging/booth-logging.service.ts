import { Injectable, Logger } from '@nestjs/common';
import { BoothEventData, BoothEventType, BoothStatus, GroupedSession } from '@org/commons';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { BoothLog, boothLogs, events, NewBoothLog } from '../database/schema';
import { QrCodesService } from '../qr-codes/qr-codes.service';

export interface EventInfo {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  isActive: boolean;
}

export interface BoothLogWithEvent extends BoothLog {
  event?: EventInfo;
}

export interface GroupedSessionWithEvent extends GroupedSession {
  event?: EventInfo;
}

export interface LogBoothEventOptions {
  sessionId: string;
  boothEvent: BoothEventData;
  eventId?: string;
  qrCodeId?: string;
  boothIdentifier?: string;
  status?: BoothStatus;
  message?: string;
  errorDetails?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalSessions: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable()
export class BoothLoggingService {
  private readonly logger = new Logger(BoothLoggingService.name);

  constructor(private databaseService: DatabaseService, private qrCodesService: QrCodesService) {}

  async logBoothEvent(options: LogBoothEventOptions): Promise<string> {
    const db = this.databaseService.getDb();

    try {
      const boothLog: NewBoothLog = {
        sessionId: options.sessionId,
        boothEventType: options.boothEvent.event_type,
        timestamp: options.boothEvent.timestamp,
        param1: options.boothEvent.param1,
        param2: options.boothEvent.param2,
        param3: options.boothEvent.param3,
        param4: options.boothEvent.param4,
        eventId: options.eventId,
        qrCodeId: options.qrCodeId,
        boothIdentifier: options.boothIdentifier,
        status: options.status || BoothStatus.SUCCESS,
        message: options.message || this.formatBoothEventMessage(options.boothEvent),
        errorDetails: options.errorDetails,
      };

      const [created] = await db.insert(boothLogs).values(boothLog).returning();

      // Handle session completion
      if (options.boothEvent.event_type === BoothEventType.SESSION_END && options.qrCodeId && options.eventId) {
        try {
          await this.qrCodesService.markQRCodeCompleted(options.qrCodeId);
          this.logger.log(`Marked QR code ${options.qrCodeId} as completed after session end`);
        } catch (error) {
          this.logger.error(`Failed to mark QR code ${options.qrCodeId} as completed:`, error);
          // Don't throw - we still want to log the booth event even if QR status update fails
        }
      }

      this.logger.log(
        `Booth event logged: ${options.boothEvent.event_type} (${created.id}) for session ${options.sessionId}`,
      );
      return created.id;
    } catch (error) {
      this.logger.error('Failed to log booth event:', error);
      throw error;
    }
  }

  async getBoothLogs(options?: {
    boothEventType?: BoothEventType;
    sessionId?: string;
    eventId?: string;
    qrCodeId?: string;
    boothIdentifier?: string;
    status?: BoothStatus;
    limit?: number;
    offset?: number;
  }): Promise<BoothLogWithEvent[]> {
    const db = this.databaseService.getDb();

    const conditions = [];
    if (options?.boothEventType) conditions.push(eq(boothLogs.boothEventType, options.boothEventType));
    if (options?.sessionId) conditions.push(eq(boothLogs.sessionId, options.sessionId));
    if (options?.eventId) conditions.push(eq(boothLogs.eventId, options.eventId));
    if (options?.qrCodeId) conditions.push(eq(boothLogs.qrCodeId, options.qrCodeId));
    if (options?.boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, options.boothIdentifier));
    if (options?.status) conditions.push(eq(boothLogs.status, options.status));

    const query = db.select().from(boothLogs);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    query.orderBy(desc(boothLogs.createdAt));

    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.offset(options.offset);

    const boothLogsResults = await query;

    // Get unique event IDs from the booth logs
    const eventIds = [...new Set(boothLogsResults.map((log) => log.eventId).filter(Boolean))];

    // Fetch events data if there are any event IDs
    const eventsData: EventInfo[] = [];
    if (eventIds.length > 0) {
      // For now, we'll fetch events one by one since we don't have IN operator
      // This could be optimized with a proper IN query if needed
      for (const eventId of eventIds) {
        const eventResult = await db
          .select({
            id: events.id,
            name: events.name,
            description: events.description,
            price: events.price,
            currency: events.currency,
            isActive: events.isActive,
          })
          .from(events)
          .where(eq(events.id, eventId!))
          .limit(1);

        if (eventResult.length > 0) {
          eventsData.push({
            id: eventResult[0].id,
            name: eventResult[0].name,
            description: eventResult[0].description,
            price: eventResult[0].price,
            currency: eventResult[0].currency,
            isActive: eventResult[0].isActive,
          });
        }
      }
    }

    // Create a map for quick event lookup
    const eventsMap = new Map(eventsData.map((event) => [event.id, event]));

    // Transform the results to match the expected format
    return boothLogsResults.map((log) => ({
      ...log,
      event: log.eventId ? eventsMap.get(log.eventId) : undefined,
    }));
  }

  async getSessionEvents(sessionId: string): Promise<BoothLogWithEvent[]> {
    const db = this.databaseService.getDb();

    const boothLogsResults = await db
      .select()
      .from(boothLogs)
      .where(eq(boothLogs.sessionId, sessionId))
      .orderBy(asc(boothLogs.createdAt));

    // Get unique event IDs from the booth logs
    const eventIds = [...new Set(boothLogsResults.map((log) => log.eventId).filter(Boolean))];

    // Fetch events data if there are any event IDs
    const eventsData: EventInfo[] = [];
    if (eventIds.length > 0) {
      for (const eventId of eventIds) {
        const eventResult = await db
          .select({
            id: events.id,
            name: events.name,
            description: events.description,
            price: events.price,
            currency: events.currency,
            isActive: events.isActive,
          })
          .from(events)
          .where(eq(events.id, eventId!))
          .limit(1);

        if (eventResult.length > 0) {
          eventsData.push({
            id: eventResult[0].id,
            name: eventResult[0].name,
            description: eventResult[0].description,
            price: eventResult[0].price,
            currency: eventResult[0].currency,
            isActive: eventResult[0].isActive,
          });
        }
      }
    }

    // Create a map for quick event lookup
    const eventsMap = new Map(eventsData.map((event) => [event.id, event]));

    // Transform the results to match the expected format
    return boothLogsResults.map((log) => ({
      ...log,
      event: log.eventId ? eventsMap.get(log.eventId) : undefined,
    }));
  }

  async getBoothSessions(options: {
    eventId?: string;
    boothIdentifier?: string;
    page: number;
    pageSize: number;
  }): Promise<{
    sessions: GroupedSessionWithEvent[];
    pagination: PaginationInfo;
  }> {
    const db = this.databaseService.getDb();
    const { eventId, boothIdentifier, page, pageSize } = options;
    const offset = (page - 1) * pageSize;

    const conditions = [eq(boothLogs.boothEventType, BoothEventType.SESSION_START)];
    if (eventId) conditions.push(eq(boothLogs.eventId, eventId));
    if (boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, boothIdentifier));

    const sessionsStart = await db
      .select({
        sessionId: boothLogs.sessionId,
        startTime: boothLogs.timestamp,
        boothMode: boothLogs.param1,
        boothIdentifier: boothLogs.boothIdentifier,
        qrCodeId: boothLogs.qrCodeId,
        eventId: boothLogs.eventId,
        createdAt: boothLogs.createdAt,
      })
      .from(boothLogs)
      .where(and(...conditions))
      .orderBy(desc(boothLogs.createdAt))
      .limit(pageSize)
      .offset(offset);

    const totalSessionsResult = await db
      .select({ count: count() })
      .from(boothLogs)
      .where(and(...conditions));

    const totalSessions = totalSessionsResult[0]?.count || 0;

    // Get unique event IDs from the sessions
    const eventIds = [...new Set(sessionsStart.map((session) => session.eventId).filter(Boolean))];

    // Fetch events data if there are any event IDs
    const eventsData: EventInfo[] = [];
    if (eventIds.length > 0) {
      for (const eventId of eventIds) {
        const eventResult = await db
          .select({
            id: events.id,
            name: events.name,
            description: events.description,
            price: events.price,
            currency: events.currency,
            isActive: events.isActive,
          })
          .from(events)
          .where(eq(events.id, eventId!))
          .limit(1);

        if (eventResult.length > 0) {
          eventsData.push({
            id: eventResult[0].id,
            name: eventResult[0].name,
            description: eventResult[0].description,
            price: eventResult[0].price,
            currency: eventResult[0].currency,
            isActive: eventResult[0].isActive,
          });
        }
      }
    }

    // Create a map for quick event lookup
    const eventsMap = new Map(eventsData.map((event) => [event.id, event]));

    const sessions: GroupedSessionWithEvent[] = await Promise.all(
      sessionsStart.map(async (sessionStart) => {
        const sessionEvents = await this.getSessionEvents(sessionStart.sessionId);

        const sessionEnd = sessionEvents.find((e) => e.boothEventType === BoothEventType.SESSION_END);

        return {
          sessionId: sessionStart.sessionId,
          startTime: sessionStart.startTime,
          endTime: sessionEnd?.timestamp || null,
          boothMode: sessionStart.boothMode,
          boothIdentifier: sessionStart.boothIdentifier,
          status: sessionEnd ? 'complete' : 'incomplete',
          eventCount: sessionEvents.length,
          events: sessionEvents.map((event) => ({
            ...event,
            boothEventType: event.boothEventType as BoothEventType,
            status: event.status as BoothStatus,
            createdAt: event.createdAt.toISOString(),
          })),
          qrCodeId: sessionStart.qrCodeId,
          eventId: sessionStart.eventId,
          event: sessionStart.eventId ? eventsMap.get(sessionStart.eventId) : undefined,
        };
      }),
    );

    const totalPages = Math.ceil(totalSessions / pageSize);

    return {
      sessions,
      pagination: {
        currentPage: page,
        pageSize,
        totalSessions,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }

  async getBoothEventStats(options?: { eventId?: string; boothIdentifier?: string; sessionId?: string }) {
    const db = this.databaseService.getDb();

    const conditions = [];
    if (options?.eventId) conditions.push(eq(boothLogs.eventId, options.eventId));
    if (options?.boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, options.boothIdentifier));
    if (options?.sessionId) conditions.push(eq(boothLogs.sessionId, options.sessionId));

    const query = db
      .select({
        boothEventType: boothLogs.boothEventType,
        status: boothLogs.status,
        count: count(),
      })
      .from(boothLogs)
      .groupBy(boothLogs.boothEventType, boothLogs.status);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return await query;
  }

  private formatBoothEventMessage(boothEvent: BoothEventData): string {
    switch (boothEvent.event_type) {
      case BoothEventType.SESSION_START:
        return `Booth session started with mode: ${boothEvent.param1 || 'Unknown'}`;
      case BoothEventType.COUNTDOWN_START:
        return `Countdown started: ${boothEvent.param1 || '0'} seconds`;
      case BoothEventType.COUNTDOWN:
        return `Countdown progress: ${boothEvent.param1 || '0'}% complete`;
      case BoothEventType.CAPTURE_START:
        return 'Camera capture initiated';
      case BoothEventType.FILE_DOWNLOAD:
        return `Photo downloaded from camera: ${boothEvent.param1 || 'Unknown file'}`;
      case BoothEventType.PROCESSING_START:
        return 'Photo processing started';
      case BoothEventType.SHARING_SCREEN:
        return 'Sharing screen displayed';
      case BoothEventType.PRINTING:
        return `Printing ${boothEvent.param2 || '1'} copies of ${boothEvent.param1 || 'file'} on ${
          boothEvent.param3 || 'printer'
        }`;
      case BoothEventType.FILE_UPLOAD:
        return `File uploaded: ${boothEvent.param1 || 'file'} to ${boothEvent.param2 || 'cloud'} as ${
          boothEvent.param3 || 'unknown type'
        }`;
      case BoothEventType.SESSION_END:
        return 'Booth session completed';
      default:
        return `Booth event: ${boothEvent.event_type}`;
    }
  }
}
