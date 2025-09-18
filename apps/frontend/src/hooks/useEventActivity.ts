import { useQuery } from '@tanstack/react-query';
import { activityApi } from '@/lib/api/activity';
import { BoothActivity } from '@org/commons';

export const ACTIVITY_QUERY_KEYS = {
  all: ['activity'] as const,
  event: (eventId: string) => [...ACTIVITY_QUERY_KEYS.all, 'event', eventId] as const,
} as const;

export function useEventActivity(eventId: string) {
  return useQuery<BoothActivity[], Error>({
    queryKey: ACTIVITY_QUERY_KEYS.event(eventId),
    queryFn: () => activityApi.getBoothLogs(eventId),
    enabled: !!eventId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
  });
}