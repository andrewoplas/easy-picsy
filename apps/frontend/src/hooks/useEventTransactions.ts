import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/lib/api/transactions';
import { Transaction } from '@org/commons';

export const TRANSACTIONS_QUERY_KEYS = {
  all: ['transactions'] as const,
  event: (eventId: string) => [...TRANSACTIONS_QUERY_KEYS.all, 'event', eventId] as const,
} as const;

export function useEventTransactions(eventId: string) {
  return useQuery<Transaction[], Error>({
    queryKey: TRANSACTIONS_QUERY_KEYS.event(eventId),
    queryFn: () => transactionsApi.getEventTransactions(eventId),
    enabled: !!eventId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
  });
}