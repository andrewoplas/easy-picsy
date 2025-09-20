'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, RefreshCw } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { useEventTransactions } from '@/hooks/useEventTransactions';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { transactionsApi } from '@/lib/api/transactions';
import { useCallback } from 'react';

interface TransactionHistoryProps {
  eventId: string;
}

export function TransactionHistory({ eventId }: TransactionHistoryProps) {
  const { data: transactions, isLoading, error, refetch } = useEventTransactions(eventId);

  console.log('transactions', transactions);

  const handleRefund = useCallback(
    async (transactionId: string) => {
      try {
        await transactionsApi.refundTransaction(transactionId);
        refetch();
      } catch (error) {
        // Handle error (could show a toast notification)
        console.error('Failed to refund transaction:', error);
      }
    },
    [refetch],
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const totalAmount = transactions?.reduce((sum, t) => sum + t.amount, 0) ?? 0;

  if (error) {
    const isEventNotFound = error.message.includes('not found');
    const isInvalidDateRange = error.message.includes('Invalid date range');
    
    return (
      <Card className="bg-dash-white">
        <CardContent>
          <EmptyState
            icon={RefreshCw}
            title={isEventNotFound ? "Event not found" : "Failed to load transactions"}
            description={
              isEventNotFound 
                ? "This event could not be found or may be inactive."
                : isInvalidDateRange
                ? "The selected date range is invalid. Please check your date selection."
                : "There was an error loading the transaction history. Please try again."
            }
            action={
              !isEventNotFound && !isInvalidDateRange ? {
                label: 'Retry',
                onClick: () => refetch(),
              } : undefined
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-lg font-normal text-dash-navy tracking-wide flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Transaction History
          <div className="ml-auto flex items-center space-x-2">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {formatCurrency(totalAmount)} total
            </div>
            <div className="text-dash-navy/60 text-sm">{transactions?.length ?? 0} payments</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ListSkeleton count={5} />
        ) : transactions?.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title="No transactions yet"
            description="There are no transactions recorded for this event yet."
          />
        ) : (
          <div className="space-y-3">
            {transactions?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} onRefund={handleRefund} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
