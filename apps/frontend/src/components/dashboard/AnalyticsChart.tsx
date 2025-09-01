'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyData {
  day: string;
  sessions: number;
  revenue: number;
}

interface AnalyticsChartProps {
  data: WeeklyData[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const maxSessions = Math.max(...data.map((d) => d.sessions));
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
          Event Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sessions Chart */}
          <div>
            <h4 className="text-sm font-normal text-dash-navy/70 mb-3 tracking-wide">Sessions This Week</h4>
            <div className="flex items-end justify-between h-32 space-x-2">
              {data.map((item) => (
                <div key={item.day} className="flex flex-col items-center space-y-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-dash-orange to-easy-yellow rounded-t-md min-h-[4px] transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${(item.sessions / maxSessions) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-dash-navy">{item.sessions}</div>
                    <div className="text-xs text-dash-navy/60">{item.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <h4 className="text-sm font-normal text-dash-navy/70 mb-3 tracking-wide">Revenue This Week</h4>
            <div className="flex items-end justify-between h-32 space-x-2">
              {data.map((item) => (
                <div key={`${item.day}-revenue`} className="flex flex-col items-center space-y-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-easy-yellow/60 to-easy-yellow rounded-t-md min-h-[4px] transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${(item.revenue / maxRevenue) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-dash-navy">${item.revenue.toLocaleString()}</div>
                    <div className="text-xs text-dash-navy/60">{item.day}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}