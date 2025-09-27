'use client';

import { ActivityTimeline } from '@/components/analytics/ActivityTimeline';
import { TransactionHistory } from '@/components/analytics/TransactionHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFormattedEventAnalytics } from '@/hooks/useAnalytics';
import { eventsApi } from '@/lib/api/events';
import { ROUTES, buildRoute } from '@/lib/routes';
import { useQuery } from '@tanstack/react-query';
import { Activity, ChevronRight, Clock, Copy, DollarSign, Home, Printer, RefreshCw, TrendingUp } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Custom hook for odometer animation
const useOdometer = (targetValue: number, duration = 2000) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(startValue + (targetValue - startValue) * easeOutCubic);

      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    // Start animation after a brief delay for better visual effect
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);

    return () => clearTimeout(timer);
  }, [targetValue, duration]);

  return { currentValue, isAnimating };
};

export default function EventAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });

  // Fetch analytics data
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useFormattedEventAnalytics(eventId);

  // Loading state
  const isLoading = eventLoading || analyticsLoading;

  // Odometer animations for analytics
  const earnings = useOdometer(analytics?.runningEarnings || 0, 2500);
  const prints = useOdometer(analytics?.totalPrints || 0, 2000);
  const reprints = useOdometer(analytics?.totalReprints || 0, 1500);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleRefresh = () => {
    toast.promise(refetchAnalytics(), {
      loading: 'Refreshing analytics...',
      success: 'Analytics refreshed successfully!',
      error: 'Failed to refresh analytics',
    });
  };

  // Error state
  if (analyticsError) {
    return (
      <div className="space-y-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <div>
                <h3 className="font-medium text-red-900">Failed to load analytics</h3>
                <p className="text-sm text-red-700">
                  {analyticsError instanceof Error ? analyticsError.message : 'An error occurred'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin text-dash-navy/60" />
              <span className="ml-3 text-dash-navy/60">Loading analytics...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-dash-navy/60 mb-4">
        <button
          onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
          className="flex items-center hover:text-dash-navy transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          Dashboard
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => router.push(ROUTES.ADMIN.EVENTS.LIST)}
          className="hover:text-dash-navy transition-colors"
        >
          Events
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-dash-navy font-medium">{event?.name || 'Event Analytics'}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">{event?.name || 'Event Analytics'}</h1>
          <p className="text-dash-navy/70">Event management and analytics</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="border-dash-gray/50 hover:bg-dash-gray/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Remote Control Access */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-900">Remote Control</h3>
                <p className="text-sm text-blue-700">Access mobile-friendly booth controls</p>
              </div>
            </div>
            <Button onClick={() => router.push(buildRoute.eventRemote(eventId))} variant="gradient">
              Open Remote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics - Separate Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-normal text-dash-navy tracking-wide flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          Analytics Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Running Earnings Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 bg-emerald-500 rounded-lg transition-all duration-300 ${
                        earnings.isAnimating ? 'animate-pulse scale-110' : ''
                      }`}
                    >
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-emerald-700">Running Earnings</h3>
                  </div>
                  <p
                    className={`text-3xl font-bold text-emerald-900 transition-all duration-300 ${
                      earnings.isAnimating ? 'text-emerald-600' : ''
                    }`}
                  >
                    {analytics?.formattedEarnings || formatCurrency(0)}
                  </p>
                  <p className="text-xs text-emerald-600">Total revenue today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Average Time Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-blue-700">Avg Session Time</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{analytics?.sessionAverageTime || '0:00'}</p>
                  <p className="text-xs text-blue-600">Per session duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Prints Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 bg-purple-500 rounded-lg transition-all duration-300 ${
                        prints.isAnimating ? 'animate-pulse scale-110' : ''
                      }`}
                    >
                      <Printer className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-purple-700">Total Prints</h3>
                  </div>
                  <p
                    className={`text-3xl font-bold text-purple-900 transition-all duration-300 ${
                      prints.isAnimating ? 'text-purple-600' : ''
                    }`}
                  >
                    {prints.currentValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600">Photos printed today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Reprints Card */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 bg-orange-500 rounded-lg transition-all duration-300 ${
                        reprints.isAnimating ? 'animate-pulse scale-110' : ''
                      }`}
                    >
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-orange-700">Total Reprints</h3>
                  </div>
                  <p
                    className={`text-3xl font-bold text-orange-900 transition-all duration-300 ${
                      reprints.isAnimating ? 'text-orange-600' : ''
                    }`}
                  >
                    {reprints.currentValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600">Reprints requested</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory eventId={eventId} />

      {/* Activity Timeline */}
      <ActivityTimeline eventId={eventId} />
    </div>
  );
}
