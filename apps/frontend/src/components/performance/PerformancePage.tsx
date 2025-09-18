'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter';
import { AnalyticsCard } from '@/components/dashboard/performance/AnalyticsCard';
import { 
  Clock, 
  Printer, 
  Camera, 
  RefreshCw,
  BarChart,
  LineChart,
} from 'lucide-react';

// Static data for performance metrics
const defaultMetrics = {
  averageSessionTime: {
    value: '25:30',
    trend: { value: 12, isPositive: true },
    description: 'vs. last month'
  },
  totalPrints: {
    value: '2,458',
    trend: { value: 8, isPositive: true },
    description: 'vs. last month'
  },
  singleSession: {
    value: '386',
    trend: { value: 5, isPositive: true },
    description: 'vs. last month'
  },
  reprints: {
    value: '124',
    trend: { value: 3, isPositive: false },
    description: 'vs. last month'
  },
  averagePrintsPerEvent: {
    value: '82',
    trend: { value: 15, isPositive: true },
    description: 'vs. last month'
  },
  averageReprintsPerEvent: {
    value: '4',
    trend: { value: 2, isPositive: false },
    description: 'vs. last month'
  }
};

export function PerformancePage() {
  const [metrics, setMetrics] = useState(defaultMetrics);
  
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      // Here you would typically fetch new data based on the date range
      console.log('Date range changed:', range);
      // For now, we'll keep using the static data
      setMetrics(defaultMetrics);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Performance Analytics</h1>
          <p className="text-dash-navy/70">
            Track your booth performance and session metrics
          </p>
        </div>
        <DateRangeFilter onDateChange={handleDateChange} />
      </div>

      {/* Performance Content */}
      <div className="space-y-6">
        {/* Session Metrics */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Session Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Average Session Time"
              value={metrics.averageSessionTime.value}
              trend={metrics.averageSessionTime.trend}
              icon={Clock}
              description={metrics.averageSessionTime.description}
            />
            <AnalyticsCard
              title="Single Session"
              value={metrics.singleSession.value}
              trend={metrics.singleSession.trend}
              icon={Camera}
              description={metrics.singleSession.description}
            />
          </div>
        </div>

        {/* Print Metrics */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Print Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Total Prints"
              value={metrics.totalPrints.value}
              trend={metrics.totalPrints.trend}
              icon={Printer}
              description={metrics.totalPrints.description}
            />
            <AnalyticsCard
              title="Reprints"
              value={metrics.reprints.value}
              trend={metrics.reprints.trend}
              icon={RefreshCw}
              description={metrics.reprints.description}
            />
          </div>
        </div>

        {/* Event Averages */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">Event Averages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Average Prints per Event"
              value={metrics.averagePrintsPerEvent.value}
              trend={metrics.averagePrintsPerEvent.trend}
              icon={BarChart}
              description={metrics.averagePrintsPerEvent.description}
            />
            <AnalyticsCard
              title="Average Reprints per Event"
              value={metrics.averageReprintsPerEvent.value}
              trend={metrics.averageReprintsPerEvent.trend}
              icon={LineChart}
              description={metrics.averageReprintsPerEvent.description}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
