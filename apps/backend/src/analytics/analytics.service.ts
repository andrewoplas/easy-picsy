import { Injectable, Logger } from '@nestjs/common';
import { and, desc, eq, gte, isNotNull, lte, sql, sum } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { boothLogs, events, payments } from '../database/schema';
import { EventAnalyticsDto, TotalAnalyticsDto, TotalPrintAnalyticsDto } from './dto';

import { DateRangeDto } from './dto';

interface PrintStats {
  prints: number;
  reprints: number;
}

interface SessionEvent {
  sessionId: string;
  boothEventType: string;
  timestamp: string;
  createdAt: Date;
}

interface PrintEvent {
  sessionId: string;
  eventId: string | null;
  param1: string | null;
  param2: string | null;
  createdAt: Date;
}

interface EventData {
  eventId: string;
  eventName: string;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get total analytics across all events
   */
  async getTotalAnalytics(dateRange?: DateRangeDto): Promise<TotalAnalyticsDto> {
    try {
      // Use Promise.all for parallel execution
      const [revenueResult, sessionDurations, printStats] = await Promise.all([
        this.calculateTotalRevenue(dateRange),
        this.calculateAllSessionDurations(dateRange),
        this.calculateTotalPrintStats(dateRange),
      ]);

      const averageSessionTime =
        sessionDurations.length > 0
          ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
          : 0;

      return {
        totalNetRevenue: revenueResult,
        totalWithdrawableRevenue: revenueResult, // Same as net revenue for now
        averageSessionTime: Math.round(averageSessionTime),
        totalPrints: {
          singleSession: printStats.singleSession,
          reprints: printStats.reprints,
          averagePerEvent: printStats.averagePerEvent,
          averageReprintsPerEvent: printStats.averageReprintsPerEvent,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get total analytics:', error);
      throw error;
    }
  }

  /**
   * Get analytics for all events
   */
  async getEventAnalytics(dateRange?: DateRangeDto): Promise<EventAnalyticsDto[]> {
    const db = this.databaseService.getDb();

    try {
      // Get all active events
      const eventsData = await db
        .select({
          eventId: events.id,
          eventName: events.name,
        })
        .from(events)
        .where(eq(events.isActive, true))
        .orderBy(desc(events.createdAt));

      // Calculate analytics for each event in parallel
      const eventAnalytics = await Promise.all(
        eventsData.map(async (event: EventData) => {
          const [earnings, sessionDurations, printData] = await Promise.all([
            this.calculateEventRevenue(event.eventId, dateRange),
            this.calculateEventSessionDurations(event.eventId, dateRange),
            this.calculateEventPrintStats(event.eventId, dateRange),
          ]);

          const avgSessionTime =
            sessionDurations.length > 0
              ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
              : 0;

          return {
            eventId: event.eventId,
            eventName: event.eventName,
            runningEarnings: earnings,
            sessionAverageTime: Math.round(avgSessionTime),
            numberOfPrints: printData.prints,
            numberOfReprints: printData.reprints,
          };
        }),
      );

      return eventAnalytics;
    } catch (error) {
      this.logger.error('Failed to get event analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate total revenue - DRY helper method
   */
  private async calculateTotalRevenue(dateRange?: DateRangeDto): Promise<number> {
    const db = this.databaseService.getDb();

    const result = await db
      .select({
        totalRevenue: sum(payments.amount),
      })
      .from(payments)
      .where(this.buildPaymentWhereClause(undefined, dateRange));

    return Number(result[0]?.totalRevenue || 0);
  }

  /**
   * Calculate event revenue - DRY helper method
   */
  private async calculateEventRevenue(eventId: string, dateRange?: DateRangeDto): Promise<number> {
    const db = this.databaseService.getDb();

    const result = await db
      .select({
        totalRevenue: sum(payments.amount),
      })
      .from(payments)
      .where(this.buildPaymentWhereClause(eventId, dateRange));

    return Number(result[0]?.totalRevenue || 0);
  }

  /**
   * Build payment where clause - DRY helper method
   */
  private buildPaymentWhereClause(eventId?: string, dateRange?: DateRangeDto) {
    const conditions = [eq(payments.status, 'completed')];

    if (eventId) {
      conditions.push(eq(payments.eventId, eventId));
    }

    if (dateRange) {
      conditions.push(gte(payments.paidAt, dateRange.start));
      conditions.push(lte(payments.paidAt, dateRange.end));
    }

    return and(...conditions);
  }

  /**
   * Calculate session durations for all events
   */
  private async calculateAllSessionDurations(dateRange?: DateRangeDto): Promise<number[]> {
    const sessionEvents = await this.getSessionEvents(undefined, dateRange);
    return this.calculateDurationsFromEvents(sessionEvents);
  }

  /**
   * Calculate session durations for specific event
   */
  private async calculateEventSessionDurations(eventId: string, dateRange?: DateRangeDto): Promise<number[]> {
    const sessionEvents = await this.getSessionEvents(eventId, dateRange);
    return this.calculateDurationsFromEvents(sessionEvents);
  }

  /**
   * Get session start/end events - DRY helper method
   */
  private async getSessionEvents(eventId?: string, dateRange?: DateRangeDto): Promise<SessionEvent[]> {
    const db = this.databaseService.getDb();

    const conditions = [
      sql`${boothLogs.boothEventType} IN ('session_start', 'session_end')`,
      isNotNull(boothLogs.sessionId),
    ];

    if (eventId) {
      conditions.push(eq(boothLogs.eventId, eventId));
    }

    if (dateRange) {
      conditions.push(gte(boothLogs.createdAt, dateRange.start));
      conditions.push(lte(boothLogs.createdAt, dateRange.end));
    }

    return await db
      .select({
        sessionId: boothLogs.sessionId,
        boothEventType: boothLogs.boothEventType,
        timestamp: boothLogs.timestamp,
        createdAt: boothLogs.createdAt,
      })
      .from(boothLogs)
      .where(and(...conditions))
      .orderBy(boothLogs.sessionId, boothLogs.createdAt);
  }

  /**
   * Calculate durations from session events - DRY helper method
   */
  private calculateDurationsFromEvents(sessionEvents: SessionEvent[]): number[] {
    const sessionGroups = this.groupBySessionId(sessionEvents);
    const durations: number[] = [];

    for (const [, events] of sessionGroups.entries()) {
      const startEvent = events.find((e) => e.boothEventType === 'session_start');
      const endEvent = events.find((e) => e.boothEventType === 'session_end');

      if (startEvent && endEvent) {
        const startTime = this.parseBoothTimestamp(startEvent.timestamp, startEvent.createdAt);
        const endTime = this.parseBoothTimestamp(endEvent.timestamp, endEvent.createdAt);

        if (startTime && endTime) {
          const duration = Math.abs(endTime.getTime() - startTime.getTime()) / 1000;
          if (this.isValidSessionDuration(duration)) {
            durations.push(duration);
          }
        }
      }
    }

    return durations;
  }

  /**
   * Calculate total print statistics
   */
  private async calculateTotalPrintStats(dateRange?: DateRangeDto): Promise<TotalPrintAnalyticsDto> {
    const printEvents = await this.getPrintEvents(undefined, dateRange);
    const stats = this.analyzePrintEvents(printEvents);

    const eventIds = new Set(printEvents.map((e) => e.eventId).filter(Boolean));
    const eventCount = eventIds.size;

    return {
      singleSession: stats.prints,
      reprints: stats.reprints,
      averagePerEvent: eventCount > 0 ? Math.round((stats.prints / eventCount) * 100) / 100 : 0,
      averageReprintsPerEvent: eventCount > 0 ? Math.round((stats.reprints / eventCount) * 100) / 100 : 0,
    };
  }

  /**
   * Calculate print statistics for specific event
   */
  private async calculateEventPrintStats(eventId: string, dateRange?: DateRangeDto): Promise<PrintStats> {
    const printEvents = await this.getPrintEvents(eventId, dateRange);
    return this.analyzePrintEvents(printEvents);
  }

  /**
   * Get print events - DRY helper method
   */
  private async getPrintEvents(eventId?: string, dateRange?: DateRangeDto): Promise<PrintEvent[]> {
    const db = this.databaseService.getDb();

    const conditions = [eq(boothLogs.boothEventType, 'printing'), isNotNull(boothLogs.sessionId)];

    if (eventId) {
      conditions.push(eq(boothLogs.eventId, eventId));
    }

    if (dateRange) {
      conditions.push(gte(boothLogs.createdAt, dateRange.start));
      conditions.push(lte(boothLogs.createdAt, dateRange.end));
    }

    return await db
      .select({
        sessionId: boothLogs.sessionId,
        eventId: boothLogs.eventId,
        param1: boothLogs.param1, // file name
        param2: boothLogs.param2, // number of copies
        createdAt: boothLogs.createdAt,
      })
      .from(boothLogs)
      .where(and(...conditions))
      .orderBy(boothLogs.sessionId, boothLogs.createdAt);
  }

  /**
   * Analyze print events to categorize prints vs reprints - DRY helper method
   */
  private analyzePrintEvents(printEvents: PrintEvent[]): PrintStats {
    let prints = 0;
    let reprints = 0;
    const sessionFileTracker = new Map<string, Set<string>>();

    for (const printEvent of printEvents) {
      const copies = this.parseCopies(printEvent.param2);
      const fileName = printEvent.param1 || '';
      const sessionId = printEvent.sessionId;

      if (!sessionFileTracker.has(sessionId)) {
        sessionFileTracker.set(sessionId, new Set());
      }

      const sessionFiles = sessionFileTracker.get(sessionId);
      if (!sessionFiles) continue;

      if (sessionFiles.has(fileName)) {
        reprints += copies;
      } else {
        prints += copies;
        sessionFiles.add(fileName);
      }
    }

    return { prints, reprints };
  }

  /**
   * Parse number of copies - DRY helper method
   */
  private parseCopies(param2: string | null): number {
    return parseInt(param2 || '1') || 1;
  }

  /**
   * Group events by session ID - DRY helper method
   */
  private groupBySessionId(events: SessionEvent[]): Map<string, SessionEvent[]> {
    const groups = new Map<string, SessionEvent[]>();

    for (const event of events) {
      if (!groups.has(event.sessionId)) {
        groups.set(event.sessionId, []);
      }
      const sessionEvents = groups.get(event.sessionId);
      if (sessionEvents) {
        sessionEvents.push(event);
      }
    }

    return groups;
  }

  /**
   * Parse booth timestamp - DRY helper method
   */
  private parseBoothTimestamp(timestamp: string, fallbackDate: Date): Date | null {
    try {
      const [hours, minutes, secondsStr] = timestamp.split(':');
      const seconds = parseFloat(secondsStr);

      const date = new Date(fallbackDate);
      date.setHours(parseInt(hours), parseInt(minutes), Math.floor(seconds), (seconds % 1) * 1000);

      return date;
    } catch (error) {
      this.logger.warn(`Failed to parse booth timestamp: ${timestamp}`, error);
      return null;
    }
  }

  /**
   * Validate session duration - DRY helper method
   */
  private isValidSessionDuration(duration: number): boolean {
    return duration > 0 && duration < 3600; // Between 0 and 1 hour
  }
}
