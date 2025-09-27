import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

interface QueuedEvent {
  eventId: string;
  type: string;
  data: any;
  timestamp: number;
}

interface PendingRequest {
  eventId: string;
  resolve: (events: QueuedEvent[]) => void;
  reject: (error: any) => void;
  timestamp: number;
}

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);
  private eventQueues = new Map<string, QueuedEvent[]>();
  private pendingRequests = new Map<string, PendingRequest[]>();

  /**
   * Store event for long polling clients
   */
  private storeEvent(eventId: string, type: string, data: any) {
    if (!this.eventQueues.has(eventId)) {
      this.eventQueues.set(eventId, []);
    }

    const event: QueuedEvent = {
      eventId,
      type,
      data,
      timestamp: Date.now(),
    };

    this.eventQueues.get(eventId)!.push(event);
    this.logger.log(`Stored event for ${eventId}: ${type}`);

    // Resolve any waiting requests
    const pending = this.pendingRequests.get(eventId) || [];
    if (pending.length > 0) {
      const events = this.eventQueues.get(eventId) || [];
      pending.forEach(request => {
        request.resolve([...events]); // Send copy of all events
      });
      this.pendingRequests.set(eventId, []);
    }
  }

  /**
   * Notify about successful payment
   */
  notifyPaymentSuccess(eventId: string, payment: any) {
    this.logger.log(`Notifying payment success for event ${eventId}`);
    this.storeEvent(eventId, 'paymentSuccess', payment);
  }

  /**
   * Notify about failed payment
   */
  notifyPaymentFailed(eventId: string, payment: any) {
    this.logger.log(`Notifying payment failed for event ${eventId}`);
    this.storeEvent(eventId, 'paymentFailed', payment);
  }

  /**
   * Notify about upcoming QR code expiry
   */
  notifyQRExpiryWarning(eventId: string, warning: any) {
    this.logger.log(`Notifying QR expiry warning for event ${eventId}: ${warning.minutesRemaining}min`);
    this.storeEvent(eventId, 'qrExpiryWarning', warning);
  }

  /**
   * Long polling - wait for events
   */
  async waitForEvents(eventId: string, timeout: number = 30000): Promise<QueuedEvent[]> {
    return new Promise((resolve, reject) => {
      // Check for existing events first
      const events = this.eventQueues.get(eventId) || [];
      if (events.length > 0) {
        this.logger.log(`Returning ${events.length} existing events for ${eventId}`);
        resolve([...events]);
        return;
      }

      // Wait for new events
      const request: PendingRequest = {
        eventId,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      if (!this.pendingRequests.has(eventId)) {
        this.pendingRequests.set(eventId, []);
      }
      this.pendingRequests.get(eventId)!.push(request);

      // Set timeout
      setTimeout(() => {
        this.removePendingRequest(eventId, request);
        resolve([]); // Return empty array on timeout
      }, timeout);

      this.logger.log(`Long polling request registered for event ${eventId}`);
    });
  }

  /**
   * Get events since a specific timestamp
   */
  getEventsSince(eventId: string, since: number): QueuedEvent[] {
    const events = this.eventQueues.get(eventId) || [];
    return events.filter(event => event.timestamp > since);
  }

  /**
   * Clear events for an event ID
   */
  clearEvents(eventId: string) {
    this.eventQueues.set(eventId, []);
    this.logger.log(`Cleared events for ${eventId}`);
  }

  /**
   * Clean up old requests and events
   */
  @Cron(CronExpression.EVERY_MINUTE)
  cleanup() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes

    // Clean up old pending requests
    for (const [eventId, requests] of this.pendingRequests.entries()) {
      const validRequests = requests.filter(
        request => now - request.timestamp < maxAge
      );
      this.pendingRequests.set(eventId, validRequests);
    }

    // Clean up old events
    for (const [eventId, events] of this.eventQueues.entries()) {
      const validEvents = events.filter(
        event => now - event.timestamp < maxAge
      );
      this.eventQueues.set(eventId, validEvents);
    }

    this.logger.log('Cleaned up old long polling data');
  }

  private removePendingRequest(eventId: string, request: PendingRequest) {
    const requests = this.pendingRequests.get(eventId) || [];
    const index = requests.indexOf(request);
    if (index > -1) {
      requests.splice(index, 1);
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const totalPending = Array.from(this.pendingRequests.values())
      .reduce((sum, requests) => sum + requests.length, 0);
    const totalQueued = Array.from(this.eventQueues.values())
      .reduce((sum, events) => sum + events.length, 0);

    return {
      pendingRequests: totalPending,
      queuedEvents: totalQueued,
      activeEvents: this.pendingRequests.size,
    };
  }
}
