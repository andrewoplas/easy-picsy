import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type AnalyticsDateRange } from '@/lib/api/analytics';

export const ANALYTICS_QUERY_KEYS = {
  all: ['analytics'] as const,
  events: () => [...ANALYTICS_QUERY_KEYS.all, 'events'] as const,
  eventsFiltered: (dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.events(), dateRange] as const,
  event: (eventId: string) => [...ANALYTICS_QUERY_KEYS.all, 'event', eventId] as const,
  eventFiltered: (eventId: string, dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.event(eventId), dateRange] as const,
  total: () => [...ANALYTICS_QUERY_KEYS.all, 'total'] as const,
  totalFiltered: (dateRange?: AnalyticsDateRange) => [...ANALYTICS_QUERY_KEYS.total(), dateRange] as const,
} as const;

export function useEventAnalytics(dateRange?: AnalyticsDateRange, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.eventsFiltered(dateRange),
    queryFn: () => analyticsApi.getEventAnalytics(dateRange),
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useEventAnalyticsById(eventId: string, dateRange?: AnalyticsDateRange, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.eventFiltered(eventId, dateRange),
    queryFn: () => analyticsApi.getEventAnalyticsById(eventId, dateRange),
    enabled: options?.enabled !== false && !!eventId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useTotalAnalytics(dateRange?: AnalyticsDateRange, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.totalFiltered(dateRange),
    queryFn: () => analyticsApi.getTotalAnalytics(dateRange),
    enabled: options?.enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 30000,
  });
}

export function useFormattedEventAnalytics(eventId: string, dateRange?: AnalyticsDateRange) {
  const { data: analytics, isLoading, error, refetch } = useEventAnalyticsById(eventId, dateRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formattedData = analytics ? {
    runningEarnings: analytics.runningEarnings,
    sessionAverageTime: formatTime(analytics.sessionAverageTime),
    totalPrints: analytics.numberOfPrints,
    totalReprints: analytics.numberOfReprints,
    formattedEarnings: formatCurrency(analytics.runningEarnings),
  } : null;

  return {
    data: formattedData,
    rawData: analytics,
    isLoading,
    error,
    refetch,
  };
}