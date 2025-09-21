import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type AnalyticsDateRange } from '@/lib/api/analytics';

export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,
  total: (dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.all, 'total', dateRange] as const,
  events: (dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.all, 'events', dateRange] as const,
  event: (eventId: string, dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.all, 'event', eventId, dateRange] as const,
} as const;

/**
 * Hook for fetching total analytics data
 */
export function useTotalAnalytics(dateRange?: AnalyticsDateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.total(dateRange),
    queryFn: () => analyticsApi.getTotalAnalytics(dateRange),
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time - don't keep in cache
    retry: 2,
  });
}

/**
 * Hook for fetching event analytics data
 */
export function useEventAnalytics(dateRange?: AnalyticsDateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.events(dateRange),
    queryFn: () => analyticsApi.getEventAnalytics(dateRange, undefined), // Pass undefined for eventId to get all events
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time - don't keep in cache
    retry: 2,
  });
}

/**
 * Hook for fetching analytics for a specific event
 */
export function useEventAnalyticsById(eventId: string, dateRange?: AnalyticsDateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.event(eventId, dateRange),
    queryFn: () => analyticsApi.getEventAnalytics(dateRange, eventId), // Pass eventId as second parameter
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time - don't keep in cache
    retry: 2,
    enabled: !!eventId,
  });
}

/**
 * Hook for fetching and formatting event analytics data for display
 */
export function useFormattedEventAnalytics(eventId: string, dateRange?: AnalyticsDateRange) {
  const { data, isLoading, error, refetch } = useEventAnalyticsById(eventId, dateRange);

  // Get the first (and only) event analytics object from the array
  const eventAnalytics = Array.isArray(data) ? data[0] : data;

  return {
    data: eventAnalytics ? {
      runningEarnings: eventAnalytics.runningEarnings || 0,
      formattedEarnings: new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
      }).format(eventAnalytics.runningEarnings || 0),
      totalPrints: eventAnalytics.numberOfPrints || 0,
      totalReprints: eventAnalytics.numberOfReprints || 0,
      sessionAverageTime: eventAnalytics.sessionAverageTime ? `${Math.floor(eventAnalytics.sessionAverageTime / 60)}:${Math.floor(eventAnalytics.sessionAverageTime % 60).toString().padStart(2, '0')}` : '0:00',
    } : null,
    isLoading,
    error,
    refetch,
  };
}