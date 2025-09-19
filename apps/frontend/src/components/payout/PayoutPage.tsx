'use client';

import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { PayoutSummary } from '@/components/dashboard/payout/PayoutSummary';
import { DateRange } from 'react-day-picker';

export function PayoutPage() {
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      // Here you would typically fetch new data based on the date range
      console.log('Date range changed:', range);
      // For now, we'll keep using the static data
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Payout Summary</h1>
          <p className="text-dash-navy/70">
            Monitor your earnings and manage your payouts
          </p>
        </div>
        <DateRangeFilter onDateChange={handleDateChange} />
      </div>

      {/* Payout Content */}
      <PayoutSummary />
    </div>
  );
}
