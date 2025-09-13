'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, Wallet } from 'lucide-react';

interface WithdrawableCardProps {
  amount: number;
}

export function WithdrawableCard({ amount }: WithdrawableCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="bg-dash-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-dash-navy/70 text-sm font-medium mb-2">
              Available to Withdraw
            </p>
            <p className="text-3xl font-bold text-dash-navy mb-3">
              {formatCurrency(amount)}
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
  );
}
