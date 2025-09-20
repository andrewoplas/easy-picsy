import { Configuration, AnalyticsApi } from '@org/api-lib';
import axiosInstance from './client';
import { PaymentMethod, PaymentStatus, Transaction } from '@org/commons';

const config = new Configuration();
const analyticsApiInstance = new AnalyticsApi(config, undefined, axiosInstance);

export interface TransactionQueryOptions {
  startDate?: string;
  endDate?: string;
}

export const transactionsApi = {
  /**
   * Get transactions for a specific event using the new event-filtered analytics endpoint
   */
  async getEventTransactions(
    eventId: string, 
    options?: TransactionQueryOptions
  ): Promise<Transaction[]> {
    try {
      // Use the new single event analytics endpoint for better performance
      const response = await analyticsApiInstance.analyticsControllerGetSingleEventAnalytics(
        eventId,
        options?.endDate,
        options?.startDate
      );

      const eventAnalytics = response.data;

      if (!eventAnalytics || eventAnalytics.runningEarnings === 0) {
        return [];
      }

      // Create a more realistic transaction structure
      // For now, we'll create a single aggregated transaction from the running earnings
      // Later we can add a proper endpoint to get detailed individual transactions
      return [{
        id: `event-${eventId}-total`,
        timestamp: new Date().toISOString(),
        amount: eventAnalytics.runningEarnings,
        status: PaymentStatus.COMPLETED,
        sessionId: 'aggregated',
        paymentMethod: PaymentMethod.GCASH,
      }];
    } catch (error: any) {
      console.error('Failed to fetch event transactions:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        throw new Error('Event not found or inactive');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Invalid date range provided');
      }
      
      throw new Error('Failed to load transaction data');
    }
  },

  /**
   * Get all events transactions (for admin dashboard)
   */
  async getAllEventsTransactions(options?: TransactionQueryOptions): Promise<Transaction[]> {
    try {
      const response = await analyticsApiInstance.analyticsControllerGetEventAnalytics(
        undefined,
        options?.startDate,
        options?.endDate
      );

      const eventAnalytics = response.data;

      if (!eventAnalytics || eventAnalytics.length === 0) {
        return [];
      }

      // Convert each event's analytics to a transaction
      return eventAnalytics
        .filter(analytics => analytics.runningEarnings > 0)
        .map(analytics => ({
          id: `event-${analytics.eventId}-total`,
          timestamp: new Date().toISOString(),
          amount: analytics.runningEarnings,
          status: PaymentStatus.COMPLETED,
          sessionId: 'aggregated',
          paymentMethod: PaymentMethod.GCASH,
        }));
    } catch (error: any) {
      console.error('Failed to fetch all events transactions:', error);
      throw new Error('Failed to load transaction data');
    }
  },

  /**
   * Refund a transaction (placeholder for future implementation)
   */
  async refundTransaction(transactionId: string): Promise<void> {
    // TODO: Implement refund functionality when backend endpoint is ready
    console.warn('Refund functionality not yet implemented for transaction:', transactionId);
    throw new Error('Refund functionality not yet implemented');
  },
};