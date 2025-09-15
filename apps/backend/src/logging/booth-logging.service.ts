import { Injectable, Logger } from '@nestjs/common';
import { and, count, desc, eq, asc } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { boothLogs, NewBoothLog } from '../database/schema';

export interface BoothEventData {
  event_type: string;
  param1?: string;
  param2?: string;
  param3?: string;
  param4?: string;
  timestamp: string; // Format: "16:20:7.287"
}

export interface LogBoothEventOptions {
  sessionId: string; // Client-generated UUID
  boothEvent: BoothEventData;
  eventId?: string; // Reference to events table
  qrCodeId?: string;
  boothIdentifier?: string; // Physical booth ID
  status?: 'success' | 'error' | 'warning';
  message?: string;
  errorDetails?: string;
}

export interface GroupedSession {
  sessionId: string;
  startTime: string;
  endTime: string | null;
  boothMode: string | null;
  boothIdentifier: string | null;
  status: 'complete' | 'incomplete';
  eventCount: number;
  events: any[];
  qrCodeId: string | null;
  eventId: string | null;
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

  constructor(private databaseService: DatabaseService) {}

  /**
   * Log a single booth event
   */
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
        status: options.status || 'success',
        message: options.message || this.formatBoothEventMessage(options.boothEvent),
        errorDetails: options.errorDetails,
      };

      const [created] = await db.insert(boothLogs).values(boothLog).returning();
      
      this.logger.log(`Booth event logged: ${options.boothEvent.event_type} (${created.id}) for session ${options.sessionId}`);
      return created.id;
    } catch (error) {
      this.logger.error('Failed to log booth event:', error);
      throw error;
    }
  }

  /**
   * Get booth logs with optional filtering
   */
  async getBoothLogs(options?: {
    boothEventType?: string;
    sessionId?: string;
    eventId?: string;
    qrCodeId?: string;
    boothIdentifier?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const db = this.databaseService.getDb();
    
    const query = db.select().from(boothLogs);
    
    // Add filters if provided
    const conditions = [];
    if (options?.boothEventType) conditions.push(eq(boothLogs.boothEventType, options.boothEventType));
    if (options?.sessionId) conditions.push(eq(boothLogs.sessionId, options.sessionId));
    if (options?.eventId) conditions.push(eq(boothLogs.eventId, options.eventId));
    if (options?.qrCodeId) conditions.push(eq(boothLogs.qrCodeId, options.qrCodeId));
    if (options?.boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, options.boothIdentifier));
    if (options?.status) conditions.push(eq(boothLogs.status, options.status));
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    
    query.orderBy(desc(boothLogs.createdAt));
    
    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.offset(options.offset);
    
    return await query;
  }

  /**
   * Get all events for a specific session in chronological order
   */
  async getSessionEvents(sessionId: string): Promise<any[]> {
    const db = this.databaseService.getDb();
    
    const events = await db
      .select()
      .from(boothLogs)
      .where(eq(boothLogs.sessionId, sessionId))
      .orderBy(asc(boothLogs.createdAt));

    return events;
  }

  /**
   * Get paginated sessions with their events
   */
  async getBoothSessions(options: {
    eventId?: string;
    boothIdentifier?: string;
    page: number;
    pageSize: number;
  }): Promise<{
    sessions: GroupedSession[];
    pagination: PaginationInfo;
  }> {
    const db = this.databaseService.getDb();
    const { eventId, boothIdentifier, page, pageSize } = options;
    const offset = (page - 1) * pageSize;

    // Build base query for session_start events
    let sessionQuery = db
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
      .where(eq(boothLogs.boothEventType, 'session_start'));

    // Add filters
    const conditions = [eq(boothLogs.boothEventType, 'session_start')];
    if (eventId) conditions.push(eq(boothLogs.eventId, eventId));
    if (boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, boothIdentifier));

    if (conditions.length > 1) {
      sessionQuery = sessionQuery.where(and(...conditions));
    }

    // Get paginated sessions
    const sessionsStart = await sessionQuery
      .orderBy(desc(boothLogs.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get total count for pagination
    const totalSessionsResult = await db
      .select({ count: count() })
      .from(boothLogs)
      .where(and(...conditions));
    
    const totalSessions = totalSessionsResult[0]?.count || 0;

    // For each session, get all events and build grouped session
    const sessions: GroupedSession[] = await Promise.all(
      sessionsStart.map(async (sessionStart) => {
        const sessionEvents = await this.getSessionEvents(sessionStart.sessionId);
        
        // Find session end event
        const sessionEnd = sessionEvents.find(e => e.boothEventType === 'session_end');
        
        return {
          sessionId: sessionStart.sessionId,
          startTime: sessionStart.startTime,
          endTime: sessionEnd?.timestamp || null,
          boothMode: sessionStart.boothMode,
          boothIdentifier: sessionStart.boothIdentifier,
          status: sessionEnd ? 'complete' : 'incomplete',
          eventCount: sessionEvents.length,
          events: sessionEvents,
          qrCodeId: sessionStart.qrCodeId,
          eventId: sessionStart.eventId,
        };
      })
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

  /**
   * Get booth event statistics
   */
  async getBoothEventStats(options?: {
    eventId?: string;
    boothIdentifier?: string;
    sessionId?: string;
  }) {
    const db = this.databaseService.getDb();
    
    let query = db
      .select({
        boothEventType: boothLogs.boothEventType,
        status: boothLogs.status,
        count: count(),
      })
      .from(boothLogs);

    const conditions = [];
    if (options?.eventId) conditions.push(eq(boothLogs.eventId, options.eventId));
    if (options?.boothIdentifier) conditions.push(eq(boothLogs.boothIdentifier, options.boothIdentifier));
    if (options?.sessionId) conditions.push(eq(boothLogs.sessionId, options.sessionId));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.groupBy(boothLogs.boothEventType, boothLogs.status);
  }

  /**
   * Format booth event into human-readable message
   */
  private formatBoothEventMessage(boothEvent: BoothEventData): string {
    switch (boothEvent.event_type) {
      case 'session_start':
        return `Booth session started with mode: ${boothEvent.param1 || 'Unknown'}`;
      case 'countdown_start':
        return `Countdown started: ${boothEvent.param1 || '0'} seconds`;
      case 'countdown':
        return `Countdown progress: ${boothEvent.param1 || '0'}% complete`;
      case 'capture_start':
        return 'Camera capture initiated';
      case 'file_download':
        return `Photo downloaded from camera: ${boothEvent.param1 || 'Unknown file'}`;
      case 'processing_start':
        return 'Photo processing started';
      case 'sharing_screen':
        return 'Sharing screen displayed';
      case 'printing':
        return `Printing ${boothEvent.param2 || '1'} copies of ${boothEvent.param1 || 'file'} on ${boothEvent.param3 || 'printer'}`;
      case 'file_upload':
        return `File uploaded: ${boothEvent.param1 || 'file'} to ${boothEvent.param2 || 'cloud'} as ${boothEvent.param3 || 'unknown type'}`;
      case 'session_end':
        return 'Booth session completed';
      default:
        return `Booth event: ${boothEvent.event_type}`;
    }
  }
}
