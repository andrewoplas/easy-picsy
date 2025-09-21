import { Clock, Camera } from 'lucide-react';
import { AnalyticsCard } from '@/components/dashboard/performance/AnalyticsCard';
import { MetricsSection } from './MetricsSection';

interface SessionMetricsProps {
  averageSessionTime: number;
  totalSessions: number;
  averageSessionTimeTrend?: {
    value: number;
    isPositive: boolean;
  };
}

export function SessionMetrics({ 
  averageSessionTime, 
  totalSessions,
  averageSessionTimeTrend
}: SessionMetricsProps) {
  const formatSessionTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <MetricsSection title="Session Activity">
      <AnalyticsCard
        title="Average Session Time"
        value={formatSessionTime(averageSessionTime)}
        trend={averageSessionTimeTrend || { value: 0, isPositive: true }}
        icon={Clock}
        description="vs. last month"
      />
      <AnalyticsCard
        title="Total Sessions"
        value={totalSessions.toString()}
        trend={{ value: 0, isPositive: true }} // TODO: Calculate actual trend for sessions
        icon={Camera}
        description="vs. last month"
      />
    </MetricsSection>
  );
}
