import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'orange';
  isAnimating?: boolean;
}

export function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  isAnimating,
}: AnalyticsCardProps) {
  const colors = {
    emerald: {
      bg: 'from-emerald-50 to-emerald-100',
      border: 'border-emerald-200',
      icon: 'bg-emerald-500',
      text: {
        title: 'text-emerald-700',
        value: 'text-emerald-900',
        subtitle: 'text-emerald-600',
      },
    },
    blue: {
      bg: 'from-blue-50 to-blue-100',
      border: 'border-blue-200',
      icon: 'bg-blue-500',
      text: {
        title: 'text-blue-700',
        value: 'text-blue-900',
        subtitle: 'text-blue-600',
      },
    },
    purple: {
      bg: 'from-purple-50 to-purple-100',
      border: 'border-purple-200',
      icon: 'bg-purple-500',
      text: {
        title: 'text-purple-700',
        value: 'text-purple-900',
        subtitle: 'text-purple-600',
      },
    },
    orange: {
      bg: 'from-orange-50 to-orange-100',
      border: 'border-orange-200',
      icon: 'bg-orange-500',
      text: {
        title: 'text-orange-700',
        value: 'text-orange-900',
        subtitle: 'text-orange-600',
      },
    },
  };

  const theme = colors[color];

  return (
    <Card className={`bg-gradient-to-br ${theme.bg} ${theme.border} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className={`p-2 ${theme.icon} rounded-lg transition-all duration-300 ${
                isAnimating ? 'animate-pulse scale-110' : ''
              }`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className={`text-sm font-medium ${theme.text.title}`}>{title}</h3>
            </div>
            <p className={`text-3xl font-bold ${theme.text.value} transition-all duration-300 ${
              isAnimating ? `text-${color}-600` : ''
            }`}>
              {value}
            </p>
            <p className={`text-xs ${theme.text.subtitle}`}>{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
