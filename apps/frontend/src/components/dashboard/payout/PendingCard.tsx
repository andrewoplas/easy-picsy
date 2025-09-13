'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, CreditCard } from 'lucide-react';

interface PendingCardProps {
  amount: number;
}

export function PendingCard({ amount }: PendingCardProps) {
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
              Pending Revenue
            </p>
            <p className="text-3xl font-bold text-dash-navy mb-3">
              {formatCurrency(amount)}
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
  );
}
