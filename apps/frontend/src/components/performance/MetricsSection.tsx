import { ReactNode } from 'react';

interface MetricsSectionProps {
  title: string;
  children: ReactNode;
}

export function MetricsSection({ title, children }: MetricsSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}
