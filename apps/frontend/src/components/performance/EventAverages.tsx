import { BarChart, LineChart } from 'lucide-react';
import { AnalyticsCard } from '@/components/dashboard/performance/AnalyticsCard';
import { MetricsSection } from './MetricsSection';

interface EventAveragesProps {
  averagePrintsPerEvent: number;
  averageReprintsPerEvent: number;
  averagePerEventTrend?: {
    value: number;
    isPositive: boolean;
  };
  averageReprintsPerEventTrend?: {
    value: number;
    isPositive: boolean;
  };
}

export function EventAverages({ 
  averagePrintsPerEvent, 
  averageReprintsPerEvent,
  averagePerEventTrend,
  averageReprintsPerEventTrend
}: EventAveragesProps) {
  return (
    <MetricsSection title="Event Averages">
      <AnalyticsCard
        title="Average Prints per Event"
        value={averagePrintsPerEvent.toFixed(1)}
        trend={averagePerEventTrend || { value: 0, isPositive: true }}
        icon={BarChart}
        description="vs. last month"
      />
      <AnalyticsCard
        title="Average Reprints per Event"
        value={averageReprintsPerEvent.toFixed(1)}
        trend={averageReprintsPerEventTrend || { value: 0, isPositive: false }}
        icon={LineChart}
        description="vs. last month"
      />
    </MetricsSection>
  );
}
