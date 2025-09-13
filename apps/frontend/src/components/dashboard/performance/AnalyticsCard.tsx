'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  description?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  description 
}: AnalyticsCardProps) {
  return (
    <Card className="bg-dash-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-dash-navy/70 text-sm font-medium mb-2">
              {title}
            </p>
            <p className="text-3xl font-bold text-dash-navy mb-3">
              {value}
            </p>
            {trend && (
              <div className="flex items-center text-sm font-semibold">
                <div className={`flex items-center ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {trend.value}%
                </div>
                {description && (
                  <span className="text-dash-navy/50 ml-2">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className="bg-easy-yellow/10 rounded-xl p-3">
            <Icon className="h-6 w-6 text-easy-yellow" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
