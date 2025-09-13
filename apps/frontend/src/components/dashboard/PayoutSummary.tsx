'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Download
} from 'lucide-react';

interface PayoutSummaryProps {
  totalNetRevenue?: number;
  withdrawableAmount?: number;
  pendingAmount?: number;
}

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'fee';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  eventName?: string;
}

interface Cashout {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  method: 'bank_transfer' | 'paypal' | 'gcash';
  reference?: string;
}

const defaultTransactions: Transaction[] = [
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

const defaultCashouts: Cashout[] = [
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'payment':
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    case 'refund':
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    case 'fee':
      return <CreditCard className="w-4 h-4 text-yellow-600" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getCashoutMethodLabel = (method: string) => {
  switch (method) {
    case 'bank_transfer':
      return 'Bank Transfer';
    case 'paypal':
      return 'PayPal';
    case 'gcash':
      return 'GCash';
    default:
      return 'Unknown';
  }
};

export function PayoutSummary({ 
  totalNetRevenue = 15420,
  withdrawableAmount = 8750,
  pendingAmount = 1200
}: PayoutSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Payout Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Net Revenue */}
        <Card className="bg-gradient-to-br from-dash-orange to-easy-yellow text-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-white/80 text-sm font-medium mb-2">
                  Total Net Revenue
                </p>
                <p className="text-3xl font-bold text-white mb-3">
                  {formatCurrency(totalNetRevenue)}
                </p>
                <div className="flex items-center text-sm font-semibold text-white">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </div>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawable Amount */}
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-dash-navy/70 text-sm font-medium mb-2">
                  Available to Withdraw
                </p>
                <p className="text-3xl font-bold text-dash-navy mb-3">
                  {formatCurrency(withdrawableAmount)}
                </p>
                <div className="flex items-center text-sm font-semibold text-easy-yellow">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Ready for cashout
                </div>
              </div>
              <div className="bg-easy-yellow/10 rounded-xl p-3">
                <Wallet className="h-6 w-6 text-easy-yellow" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Amount */}
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-dash-navy/70 text-sm font-medium mb-2">
                  Pending Revenue
                </p>
                <p className="text-3xl font-bold text-dash-navy mb-3">
                  {formatCurrency(pendingAmount)}
                </p>
                <div className="flex items-center text-sm font-semibold text-yellow-600">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  Processing...
                </div>
              </div>
              <div className="bg-yellow-100 rounded-xl p-3">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction and Cashout History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transaction History */}
        <Card className="bg-dash-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
                  Transaction History
                </CardTitle>
                <p className="text-sm text-dash-navy/70 mt-1">
                  Recent payment transactions
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-dash-navy/20 text-dash-navy hover:bg-dash-navy/5"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaultTransactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-dash-gray/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-50">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-dash-navy text-sm">
                        {transaction.description}
                      </p>
                      <span className={`font-semibold text-sm ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-dash-navy/70 truncate">
                        {transaction.eventName || 'General Transaction'}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        <span className="text-xs text-dash-navy/50">
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cashout History */}
        <Card className="bg-dash-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
                  Cashout History
                </CardTitle>
                <p className="text-sm text-dash-navy/70 mt-1">
                  Recent withdrawal requests
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90"
                size="sm"
              >
                Request Cashout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {defaultCashouts.map((cashout) => (
                <div
                  key={cashout.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-dash-gray/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-easy-yellow/10">
                    <Wallet className="w-4 h-4 text-easy-yellow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-dash-navy text-sm">
                        {getCashoutMethodLabel(cashout.method)}
                      </p>
                      <span className="font-semibold text-easy-yellow text-sm">
                        {formatCurrency(cashout.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-dash-navy/70">
                        {cashout.reference || 'Processing...'}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cashout.status)}`}>
                          {cashout.status}
                        </span>
                        <span className="text-xs text-dash-navy/50">
                          {formatDate(cashout.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
