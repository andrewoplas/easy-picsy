'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';

interface RevenueCardProps {
  amount: number;
  trend: number;
}

export function RevenueCard({ amount, trend }: RevenueCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card className="bg-gradient-to-br from-dash-orange to-easy-yellow text-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-white/80 text-sm font-medium mb-2">
              Total Net Revenue
            </p>
            <p className="text-3xl font-bold text-white mb-3">
              {formatCurrency(amount)}
            </p>
            <div className="flex items-center text-sm font-semibold text-white">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}% from last month
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
