import { Injectable, Logger } from '@nestjs/common';
import { and, desc, eq, gte, isNotNull, lte, sql, sum } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { boothLogs, events, payments } from '../database/schema';
import { EventAnalyticsDto, TotalAnalyticsDto, TotalPrintAnalyticsDto } from './dto';
import { TrendTotalAnalyticsDto, TrendDataDto } from './dto/trend-analytics.dto';
import { getCurrentMonthRange, getPreviousMonthRange } from './utils/date-utils';

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
   * Get total analytics with monthly trends for a user
   */
  async getTotalAnalyticsWithMonthlyTrends(userId: string, eventId?: string): Promise<TrendTotalAnalyticsDto> {
    try {
      // Get current month range
      const currentMonth = getCurrentMonthRange();
      const previousMonth = getPreviousMonthRange();

      console.log(`🔍 Current month range: ${currentMonth.start.toISOString()} to ${currentMonth.end.toISOString()}`);
      console.log(`🔍 Previous month range: ${previousMonth.start.toISOString()} to ${previousMonth.end.toISOString()}`);

      // Get analytics for both months in parallel
      const [currentAnalytics, previousAnalytics] = await Promise.all([
        this.getTotalAnalytics(userId, eventId, { start: currentMonth.start, end: currentMonth.end }),
        this.getTotalAnalytics(userId, eventId, { start: previousMonth.start, end: previousMonth.end })
      ]);

      console.log(`🔍 Current month analytics: revenue=${currentAnalytics.totalNetRevenue}, prints=${currentAnalytics.totalPrints.singleSession}, sessions=${currentAnalytics.averageSessionTime}`);
      console.log(`🔍 Previous month analytics: revenue=${previousAnalytics.totalNetRevenue}, prints=${previousAnalytics.totalPrints.singleSession}, sessions=${previousAnalytics.averageSessionTime}`);

      // Calculate trends
      const totalNetRevenueTrend = this.calculateTrend(
        currentAnalytics.totalNetRevenue,
        previousAnalytics.totalNetRevenue
      );

      const averageSessionTimeTrend = this.calculateTrend(
        currentAnalytics.averageSessionTime,
        previousAnalytics.averageSessionTime
      );

      const totalPrintsTrend = {
        singleSession: this.calculateTrend(
          currentAnalytics.totalPrints.singleSession,
          previousAnalytics.totalPrints.singleSession
        ),
        reprints: this.calculateTrend(
          currentAnalytics.totalPrints.reprints,
          previousAnalytics.totalPrints.reprints
        ),
        averagePerEvent: this.calculateTrend(
          currentAnalytics.totalPrints.averagePerEvent,
          previousAnalytics.totalPrints.averagePerEvent
        ),
        averageReprintsPerEvent: this.calculateTrend(
          currentAnalytics.totalPrints.averageReprintsPerEvent,
          previousAnalytics.totalPrints.averageReprintsPerEvent
        ),
      };

      return {
        totalNetRevenue: currentAnalytics.totalNetRevenue,
        totalWithdrawableRevenue: currentAnalytics.totalWithdrawableRevenue,
        averageSessionTime: currentAnalytics.averageSessionTime,
        totalPrints: {
          singleSession: currentAnalytics.totalPrints.singleSession,
          reprints: currentAnalytics.totalPrints.reprints,
          averagePerEvent: currentAnalytics.totalPrints.averagePerEvent,
          averageReprintsPerEvent: currentAnalytics.totalPrints.averageReprintsPerEvent,
          singleSessionTrend: totalPrintsTrend.singleSession,
          reprintsTrend: totalPrintsTrend.reprints,
          averagePerEventTrend: totalPrintsTrend.averagePerEvent,
          averageReprintsPerEventTrend: totalPrintsTrend.averageReprintsPerEvent,
        },
        totalNetRevenueTrend,
        averageSessionTimeTrend,
      };
    } catch (error) {
      this.logger.error('Failed to get total analytics with monthly trends:', error);
      throw error;
    }
  }

  /**
   * Get total analytics across all events or a specific event for a user
   */
  async getTotalAnalytics(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<TotalAnalyticsDto> {
    try {
      // Use Promise.all for parallel execution
      const [revenueResult, sessionDurations, printStats] = await Promise.all([
        this.calculateTotalRevenue(userId, eventId, dateRange),
        this.calculateAllSessionDurations(userId, eventId, dateRange),
        this.calculateTotalPrintStats(userId, eventId, dateRange),
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
   * Get analytics for all events or a specific event for a user
   */
  async getEventAnalytics(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<EventAnalyticsDto[]> {
    const db = this.databaseService.getDb();

    try {
      // If eventId is provided, get analytics for that specific event (owned by user)
      if (eventId) {
        const eventData = await db
          .select({
            eventId: events.id,
            eventName: events.name,
          })
          .from(events)
          .where(and(
            eq(events.id, eventId), 
            eq(events.isActive, true),
            eq(events.createdBy, userId)
          ))
          .limit(1);

        if (eventData.length === 0) {
          throw new Error(`Event with ID ${eventId} not found or inactive`);
        }

        const event = eventData[0];
        const [earnings, sessionDurations, printData] = await Promise.all([
          this.calculateEventRevenue(userId, event.eventId, dateRange),
          this.calculateEventSessionDurations(userId, event.eventId, dateRange),
          this.calculateEventPrintStats(userId, event.eventId, dateRange),
        ]);

        const avgSessionTime =
          sessionDurations.length > 0
            ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
            : 0;

        return [{
          eventId: event.eventId,
          eventName: event.eventName,
          runningEarnings: earnings,
          sessionAverageTime: Math.round(avgSessionTime),
          numberOfPrints: printData.prints,
          numberOfReprints: printData.reprints,
        }];
      }

      // Get all active events for the user
      const eventsData = await db
        .select({
          eventId: events.id,
          eventName: events.name,
        })
        .from(events)
        .where(and(eq(events.isActive, true), eq(events.createdBy, userId)))
        .orderBy(desc(events.createdAt));

      // Calculate analytics for each event in parallel
      const eventAnalytics = await Promise.all(
        eventsData.map(async (event: EventData) => {
          const [earnings, sessionDurations, printData] = await Promise.all([
            this.calculateEventRevenue(userId, event.eventId, dateRange),
            this.calculateEventSessionDurations(userId, event.eventId, dateRange),
            this.calculateEventPrintStats(userId, event.eventId, dateRange),
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
  private async calculateTotalRevenue(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<number> {
    const db = this.databaseService.getDb();

    const result = await db
      .select({
        totalRevenue: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(events, eq(payments.eventId, events.id))
      .where(this.buildPaymentWhereClause(userId, eventId, dateRange));

    return Number(result[0]?.totalRevenue || 0);
  }

  /**
   * Calculate event revenue - DRY helper method
   */
  private async calculateEventRevenue(userId: string, eventId: string, dateRange?: DateRangeDto): Promise<number> {
    const db = this.databaseService.getDb();

    const result = await db
      .select({
        totalRevenue: sum(payments.amount),
      })
      .from(payments)
      .innerJoin(events, eq(payments.eventId, events.id))
      .where(this.buildPaymentWhereClause(userId, eventId, dateRange));

    return Number(result[0]?.totalRevenue || 0);
  }

  /**
   * Build payment where clause - DRY helper method
   */
  private buildPaymentWhereClause(userId: string, eventId?: string, dateRange?: DateRangeDto) {
    const conditions = [eq(payments.status, 'completed')];

    if (eventId) {
      conditions.push(eq(payments.eventId, eventId));
    } else {
      // If no specific event, filter by user's events
      conditions.push(eq(events.createdBy, userId));
    }

    if (dateRange) {
      conditions.push(gte(payments.paidAt, dateRange.start));
      conditions.push(lte(payments.paidAt, dateRange.end));
    }

    return and(...conditions);
  }

  /**
   * Calculate session durations for all events or a specific event
   */
  private async calculateAllSessionDurations(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<number[]> {
    const sessionEvents = await this.getSessionEvents(userId, eventId, dateRange);
    return this.calculateDurationsFromEvents(sessionEvents);
  }

  /**
   * Calculate session durations for specific event
   */
  private async calculateEventSessionDurations(userId: string, eventId: string, dateRange?: DateRangeDto): Promise<number[]> {
    const sessionEvents = await this.getSessionEvents(userId, eventId, dateRange);
    return this.calculateDurationsFromEvents(sessionEvents);
  }

  /**
   * Get session start/end events - DRY helper method
   */
  private async getSessionEvents(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<SessionEvent[]> {
    const db = this.databaseService.getDb();

    const conditions = [
      sql`${boothLogs.boothEventType} IN ('session_start', 'session_end')`,
      isNotNull(boothLogs.sessionId),
    ];

    if (eventId) {
      conditions.push(eq(boothLogs.eventId, eventId));
    } else {
      // If no specific event, filter by user's events
      conditions.push(eq(events.createdBy, userId));
    }

    if (dateRange) {
      conditions.push(gte(boothLogs.createdAt, dateRange.start));
      conditions.push(lte(boothLogs.createdAt, dateRange.end));
    }

    const result = await db
      .select({
        sessionId: boothLogs.sessionId,
        boothEventType: boothLogs.boothEventType,
        timestamp: boothLogs.timestamp,
        createdAt: boothLogs.createdAt,
      })
      .from(boothLogs)
      .innerJoin(events, eq(boothLogs.eventId, events.id))
      .where(and(...conditions))
      .orderBy(boothLogs.sessionId, boothLogs.createdAt);

    return result;
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
   * Calculate total print statistics for all events or a specific event
   */
  private async calculateTotalPrintStats(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<TotalPrintAnalyticsDto> {
    const printEvents = await this.getPrintEvents(userId, eventId, dateRange);
    const stats = this.analyzePrintEvents(printEvents);

    // If filtering by specific event, set averages to the actual values
    if (eventId) {
      return {
        singleSession: stats.prints,
        reprints: stats.reprints,
        averagePerEvent: stats.prints,
        averageReprintsPerEvent: stats.reprints,
      };
    }

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
  private async calculateEventPrintStats(userId: string, eventId: string, dateRange?: DateRangeDto): Promise<PrintStats> {
    const printEvents = await this.getPrintEvents(userId, eventId, dateRange);
    return this.analyzePrintEvents(printEvents);
  }

  /**
   * Get print events - DRY helper method
   */
  private async getPrintEvents(userId: string, eventId?: string, dateRange?: DateRangeDto): Promise<PrintEvent[]> {
    const db = this.databaseService.getDb();

    const conditions = [eq(boothLogs.boothEventType, 'printing'), isNotNull(boothLogs.sessionId)];

    if (eventId) {
      conditions.push(eq(boothLogs.eventId, eventId));
    } else {
      // If no specific event, filter by user's events
      conditions.push(eq(events.createdBy, userId));
    }

    if (dateRange) {
      conditions.push(gte(boothLogs.createdAt, dateRange.start));
      conditions.push(lte(boothLogs.createdAt, dateRange.end));
    }

    const result = await db
      .select({
        sessionId: boothLogs.sessionId,
        eventId: boothLogs.eventId,
        param1: boothLogs.param1, // file name
        param2: boothLogs.param2, // number of copies
        createdAt: boothLogs.createdAt,
      })
      .from(boothLogs)
      .innerJoin(events, eq(boothLogs.eventId, events.id))
      .where(and(...conditions))
      .orderBy(boothLogs.sessionId, boothLogs.createdAt);

    return result;
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

  /**
   * Calculate trend between current and previous values
   */
  private calculateTrend(current: number, previous: number): TrendDataDto {
    if (previous === 0) {
      return {
        value: current > 0 ? 100 : 0,
        isPositive: current > 0,
        previousValue: previous,
        currentValue: current,
      };
    }

    const percentage = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(percentage * 10) / 10), // Round to 1 decimal place
      isPositive: percentage >= 0,
      previousValue: previous,
      currentValue: current,
    };
  }

}
