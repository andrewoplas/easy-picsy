'use client';

import { RevenueCard } from './RevenueCard';
import { WithdrawableCard } from './WithdrawableCard';
import { PendingCard } from './PendingCard';
import { TransactionHistory } from './TransactionHistory';
import { CashoutHistory } from './CashoutHistory';

const defaultTransactions = [
  {
    id: 'txn_001',
    type: 'payment',
    description: 'Photo session payment',
    amount: 1250,
    date: '2024-01-15T10:30:00Z',
    status: 'completed',
    eventName: 'Wedding Event - Manila Hotel'
  },
  {
    id: 'txn_002', 
    type: 'payment',
    description: 'Booth rental fee',
    amount: 850,
    date: '2024-01-14T14:20:00Z',
    status: 'completed',
    eventName: 'Birthday Party - BGC'
  },
  {
    id: 'txn_003',
    type: 'fee',
    description: 'Platform processing fee',
    amount: -45,
    date: '2024-01-14T14:21:00Z',
    status: 'completed',
    eventName: 'Birthday Party - BGC'
  },
  {
    id: 'txn_004',
    type: 'payment',
    description: 'Extended session charge',
    amount: 300,
    date: '2024-01-13T16:45:00Z',
    status: 'pending',
    eventName: 'Corporate Event - Makati'
  },
  {
    id: 'txn_005',
    type: 'refund',
    description: 'Cancelled booking refund',
    amount: -200,
    date: '2024-01-12T09:15:00Z',
    status: 'completed',
    eventName: 'Graduation Party - QC'
  }
];

const defaultCashouts = [
  {
    id: 'co_001',
    amount: 5000,
    date: '2024-01-10T08:00:00Z',
    status: 'completed',
    method: 'bank_transfer',
    reference: 'TXN20240110001'
  },
  {
    id: 'co_002',
    amount: 3200,
    date: '2024-01-05T15:30:00Z',
    status: 'completed',
    method: 'gcash',
    reference: 'GC20240105002'
  },
  {
    id: 'co_003',
    amount: 2800,
    date: '2024-01-03T11:20:00Z',
    status: 'processing',
    method: 'bank_transfer',
    reference: 'TXN20240103003'
  }
];

interface PayoutSummaryProps {
  totalNetRevenue?: number;
  withdrawableAmount?: number;
  pendingAmount?: number;
}

export function PayoutSummary({ 
  totalNetRevenue = 15420,
  withdrawableAmount = 8750,
  pendingAmount = 1200
}: PayoutSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Payout Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RevenueCard amount={totalNetRevenue} trend={18} />
        <WithdrawableCard amount={withdrawableAmount} />
        <PendingCard amount={pendingAmount} />
      </div>

      {/* Transaction and Cashout History */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TransactionHistory transactions={defaultTransactions} />
        <CashoutHistory cashouts={defaultCashouts} />
      </div>
    </div>
  );
}
