'use client';

import { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { usePerformanceAnalytics } from '@/hooks/usePerformanceAnalytics';
import { SessionMetrics } from './SessionMetrics';
import { PrintMetrics } from './PrintMetrics';
import { EventAverages } from './EventAverages';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function PerformancePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
    to: new Date(),
  });
  
  const analyticsDateRange = useMemo(() => {
    if (dateRange?.from && dateRange?.to) {
      return {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      };
    }
    return undefined;
  }, [dateRange]);

  const { data: analytics, isLoading, error, refetch } = usePerformanceAnalytics(analyticsDateRange);
  
  const handleDateUpdate = (values: { range: DateRange; rangeCompare?: DateRange }) => {
    setDateRange(values.range);
  };

  const handleRetry = () => {
    refetch();
  };

  const PageHeader = () => (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Performance Analytics</h1>
        <p className="text-dash-navy/70">
          Track your booth performance and session metrics
        </p>
      </div>
      <DateRangePicker
        onUpdate={handleDateUpdate}
        initialDateFrom={dateRange?.from}
        initialDateTo={dateRange?.to}
        align="end"
        locale="en-US"
        showCompare={false}
      />
    </div>
  );

  const LoadingState = () => (
    <div className="space-y-6">
      <PageHeader />
      <div className="space-y-6">
        {/* Session Activity Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Average Session Time Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
            {/* Total Sessions Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-12" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Print Activity Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Total Prints Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
            {/* Reprints Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-12" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Event Averages Section */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {/* Average Prints per Event Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-8 w-12" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
            {/* Average Reprints per Event Card Skeleton */}
            <div className="bg-dash-white border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-12" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="space-y-6">
      <PageHeader />
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Performance Data</AlertTitle>
        <AlertDescription className="mt-2">
          {error?.message || 'No analytics data available'}
        </AlertDescription>
        <div className="mt-4">
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Alert>
    </div>
  );

  if (isLoading) return <LoadingState />;
  if (error || !analytics) return <ErrorState />;

  const totalSessions = analytics.totalSessions || 0;

  return (
    <div className="space-y-6">
      <PageHeader />
      <div className="space-y-6">
        <SessionMetrics
          averageSessionTime={analytics.averageSessionTime}
          totalSessions={totalSessions}
          averageSessionTimeTrend={analytics.averageSessionTimeTrend}
        />
        <PrintMetrics
          totalPrints={analytics.totalPrints.singleSession}
          reprints={analytics.totalPrints.reprints}
          singleSessionTrend={analytics.totalPrints.singleSessionTrend}
          reprintsTrend={analytics.totalPrints.reprintsTrend}
        />
        <EventAverages
          averagePrintsPerEvent={analytics.totalPrints.averagePerEvent}
          averageReprintsPerEvent={analytics.totalPrints.averageReprintsPerEvent}
          averagePerEventTrend={analytics.totalPrints.averagePerEventTrend}
          averageReprintsPerEventTrend={analytics.totalPrints.averageReprintsPerEventTrend}
        />
      </div>
    </div>
  );
}
