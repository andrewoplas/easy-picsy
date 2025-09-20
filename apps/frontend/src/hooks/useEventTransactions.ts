import { useQuery } from '@tanstack/react-query';
import { transactionsApi, TransactionQueryOptions } from '@/lib/api/transactions';
import { Transaction } from '@org/commons';

export const TRANSACTIONS_QUERY_KEYS = {
  all: ['transactions'] as const,
  event: (eventId: string, options?: TransactionQueryOptions) => 
    [...TRANSACTIONS_QUERY_KEYS.all, 'event', eventId, options] as const,
  allEvents: (options?: TransactionQueryOptions) => 
    [...TRANSACTIONS_QUERY_KEYS.all, 'all-events', options] as const,
} as const;

export function useEventTransactions(
  eventId: string, 
  options?: TransactionQueryOptions
) {
  return useQuery<Transaction[], Error>({
    queryKey: TRANSACTIONS_QUERY_KEYS.event(eventId, options),
    queryFn: () => transactionsApi.getEventTransactions(eventId, options),
    enabled: !!eventId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on 404 (event not found) or 400 (invalid date range)
      if (error.message.includes('not found') || error.message.includes('Invalid date range')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useAllEventsTransactions(options?: TransactionQueryOptions) {
  return useQuery<Transaction[], Error>({
    queryKey: TRANSACTIONS_QUERY_KEYS.allEvents(options),
    queryFn: () => transactionsApi.getAllEventsTransactions(options),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on 400 (invalid date range)
      if (error.message.includes('Invalid date range')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}