import { useEventAnalytics } from './useAnalytics';
import { analyticsApi } from '@/lib/api/analytics';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that combines total and event analytics for performance page with trends
 * This provides all the data needed for the performance dashboard
 */
export function usePerformanceAnalytics(dateRange?: { startDate?: string; endDate?: string }) {
  const { user } = useAuth();
  
  const trendsAnalytics = useQuery({
    queryKey: ['analytics', 'monthly-trends', user?.id],
    queryFn: () => analyticsApi.getTotalAnalyticsWithMonthlyTrends(),
    enabled: !!user,
    staleTime: 0, // No caching - always fetch fresh data
    gcTime: 0, // No garbage collection time - don't keep in cache
    retry: 2,
  });

  const eventAnalytics = useEventAnalytics(dateRange);

  const performanceData = useMemo(() => {
    if (!trendsAnalytics.data || !eventAnalytics.data) {
      return null;
    }

    // Calculate total sessions from event analytics
    // This is a rough estimate - in a real implementation, you might want to track this differently
    const totalSessions = eventAnalytics.data.reduce((total, event) => {
      // Estimate sessions based on prints (assuming average 2 prints per session)
      const estimatedSessions = Math.ceil(event.numberOfPrints / 2);
      return total + estimatedSessions;
    }, 0);

    return {
      ...trendsAnalytics.data,
      totalSessions,
      eventCount: eventAnalytics.data.length,
    };
  }, [trendsAnalytics.data, eventAnalytics.data]);

  return {
    data: performanceData,
    isLoading: trendsAnalytics.isLoading || eventAnalytics.isLoading,
    error: trendsAnalytics.error || eventAnalytics.error,
    refetch: () => {
      trendsAnalytics.refetch();
      eventAnalytics.refetch();
    },
  };
}
