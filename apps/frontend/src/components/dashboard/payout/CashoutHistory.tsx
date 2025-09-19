'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export interface Cashout {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  method: 'bank_transfer' | 'paypal' | 'gcash';
  reference?: string;
}

interface CashoutHistoryProps {
  cashouts: Cashout[];
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'processing':
      return 'bg-blue-100 text-blue-700';
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

export function CashoutHistory({ cashouts }: CashoutHistoryProps) {
  return (
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
          {cashouts.map((cashout) => (
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
  );
}
