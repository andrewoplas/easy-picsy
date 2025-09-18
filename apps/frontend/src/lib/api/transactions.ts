import { Configuration, AnalyticsApi } from '@org/api-lib';
import axiosInstance from './client';
import { PaymentMethod, PaymentStatus, Transaction } from '@org/commons';

const config = new Configuration();
const analyticsApiInstance = new AnalyticsApi(config, undefined, axiosInstance);

export const transactionsApi = {
  async getEventTransactions(eventId: string): Promise<Transaction[]> {
    const response = await analyticsApiInstance.analyticsControllerGetEventAnalytics(undefined, undefined);
    const eventAnalytics = response.data.find(analytics => analytics.eventId === eventId);

    if (!eventAnalytics) {
      return [];
    }

    // For now, we'll create a single transaction from the running earnings
    // Later we can add a proper endpoint to get detailed transactions
    return [{
      id: 'total',
      timestamp: new Date().toISOString(),
      amount: eventAnalytics.runningEarnings,
      status: PaymentStatus.COMPLETED,
      sessionId: 'all',
      paymentMethod: PaymentMethod.GCASH,
    }];
  },

  async refundTransaction(transactionId: string): Promise<void> {
    // TODO: Implement refund functionality when backend endpoint is ready
    console.warn('Refund functionality not yet implemented');
  },
};