'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Download } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'fee';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  eventName?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

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
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
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
          {transactions.map((transaction) => (
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
  );
}
