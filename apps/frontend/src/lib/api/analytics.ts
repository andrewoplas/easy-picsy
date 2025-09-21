import {
  AnalyticsApi,
  Configuration,
  EventAnalyticsDto,
  TotalAnalyticsDto,
  TrendTotalAnalyticsDto,
} from '@org/api-lib';
import axiosInstance from './client';

const config = new Configuration();
const analyticsApiInstance = new AnalyticsApi(config, undefined, axiosInstance);

export type EventAnalytics = EventAnalyticsDto;
export type TotalAnalytics = TotalAnalyticsDto;

export interface AnalyticsDateRange {
  startDate?: string;
  endDate?: string;
}

export const analyticsApi = {
  async getEventAnalytics(dateRange?: AnalyticsDateRange, eventId?: string): Promise<EventAnalytics[]> {
    const response = await analyticsApiInstance.analyticsControllerGetEventAnalytics(
      eventId,
      dateRange?.startDate,
      dateRange?.endDate
    );
    return response.data;
  },

  async getTotalAnalytics(dateRange?: AnalyticsDateRange): Promise<TotalAnalytics> {
    const response = await analyticsApiInstance.analyticsControllerGetTotalAnalytics(
      dateRange?.startDate,
      dateRange?.endDate
    );
    return response.data;
  },

  async getTotalAnalyticsWithMonthlyTrends(eventId?: string): Promise<TrendTotalAnalyticsDto> {
    const response = await analyticsApiInstance.analyticsControllerGetTotalAnalyticsWithMonthlyTrends(eventId);
    return response.data;
  },

  async getEventAnalyticsById(eventId: string, dateRange?: AnalyticsDateRange): Promise<EventAnalytics | null> {
    const allEventAnalytics = await this.getEventAnalytics(dateRange);
    return allEventAnalytics.find(analytics => analytics.eventId === eventId) || null;
  },
};