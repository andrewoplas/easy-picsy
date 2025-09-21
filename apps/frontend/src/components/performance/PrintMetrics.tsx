import { Printer, RefreshCw } from 'lucide-react';
import { AnalyticsCard } from '@/components/dashboard/performance/AnalyticsCard';
import { MetricsSection } from './MetricsSection';

interface PrintMetricsProps {
  totalPrints: number;
  reprints: number;
  singleSessionTrend?: {
    value: number;
    isPositive: boolean;
  };
  reprintsTrend?: {
    value: number;
    isPositive: boolean;
  };
}

export function PrintMetrics({ 
  totalPrints, 
  reprints,
  singleSessionTrend,
  reprintsTrend
}: PrintMetricsProps) {
  return (
    <MetricsSection title="Print Activity">
      <AnalyticsCard
        title="Total Prints"
        value={totalPrints.toLocaleString()}
        trend={singleSessionTrend || { value: 0, isPositive: true }}
        icon={Printer}
        description="vs. last month"
      />
      <AnalyticsCard
        title="Reprints"
        value={reprints.toLocaleString()}
        trend={reprintsTrend || { value: 0, isPositive: false }}
        icon={RefreshCw}
        description="vs. last month"
      />
    </MetricsSection>
  );
}
