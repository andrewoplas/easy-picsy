'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Camera,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 12500, sessions: 85, payments: 82 },
  { month: 'Feb', revenue: 15200, sessions: 96, payments: 94 },
  { month: 'Mar', revenue: 18300, sessions: 112, payments: 108 },
  { month: 'Apr', revenue: 22100, sessions: 134, payments: 130 },
  { month: 'May', revenue: 19800, sessions: 127, payments: 125 },
  { month: 'Jun', revenue: 25600, sessions: 156, payments: 152 },
];

const eventPerformanceData = [
  { name: 'Sarah & John Wedding', revenue: 4500, sessions: 30, avgSessionValue: 150 },
  { name: 'Birthday Celebration', revenue: 2400, sessions: 24, avgSessionValue: 100 },
  { name: 'Corporate Event', revenue: 6000, sessions: 30, avgSessionValue: 200 },
  { name: 'Anniversary Party', revenue: 1800, sessions: 12, avgSessionValue: 150 },
  { name: 'Graduation Party', revenue: 1200, sessions: 12, avgSessionValue: 100 },
];

const paymentMethodData = [
  { name: 'GCash', value: 45, color: '#3b82f6' },
  { name: 'Maya', value: 32, color: '#10b981' },
  { name: 'BPI', value: 12, color: '#f59e0b' },
  { name: 'UnionBank', value: 6, color: '#ef4444' },
  { name: 'Others', value: 5, color: '#8b5cf6' },
];

const hourlyUsageData = [
  { hour: '08:00', sessions: 2 },
  { hour: '09:00', sessions: 5 },
  { hour: '10:00', sessions: 8 },
  { hour: '11:00', sessions: 12 },
  { hour: '12:00', sessions: 15 },
  { hour: '13:00', sessions: 18 },
  { hour: '14:00', sessions: 22 },
  { hour: '15:00', sessions: 25 },
  { hour: '16:00', sessions: 20 },
  { hour: '17:00', sessions: 16 },
  { hour: '18:00', sessions: 10 },
  { hour: '19:00', sessions: 6 },
  { hour: '20:00', sessions: 3 },
  { hour: '21:00', sessions: 1 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Calculate summary stats
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSessions = revenueData.reduce((sum, item) => sum + item.sessions, 0);
  const avgSessionValue = totalRevenue / totalSessions;
  const revenueGrowth = ((revenueData[revenueData.length - 1]?.revenue || 0) - (revenueData[revenueData.length - 2]?.revenue || 0)) / (revenueData[revenueData.length - 2]?.revenue || 1) * 100;

  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Analytics</h1>
          <p className="text-dash-navy/70">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-dash-gray/50 hover:bg-dash-gray/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Total Revenue
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {formatCurrency(totalRevenue)}
                </p>
                <div className={`flex items-center text-sm font-semibold mt-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueGrowth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {formatPercentage(revenueGrowth)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Total Sessions
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {totalSessions.toLocaleString()}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Across all events
                </p>
              </div>
              <Users className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Avg. Session Value
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {formatCurrency(Math.round(avgSessionValue))}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Per session revenue
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Conversion Rate
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  94.2%
                </p>
                <div className="flex items-center text-sm font-semibold text-green-600 mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2.1%
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-dash-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
                Revenue Trend
              </CardTitle>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => 
                      selectedMetric === 'revenue' ? `₱${(value / 1000).toFixed(0)}k` : value.toString()
                    }
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      selectedMetric === 'revenue' ? formatCurrency(Number(value)) : value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke="#f97316" 
                    fill="#fed7aa" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {paymentMethodData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-dash-navy">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-dash-navy">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Event Performance */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Event Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    type="number" 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#64748b"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Usage */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Peak Usage Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#64748b"
                    fontSize={12}
                    interval={1}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Sessions']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sessions" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
            Event Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dash-gray/30">
                  <th className="text-left py-3 px-2 font-medium text-dash-navy/70">Event</th>
                  <th className="text-right py-3 px-2 font-medium text-dash-navy/70">Revenue</th>
                  <th className="text-right py-3 px-2 font-medium text-dash-navy/70">Sessions</th>
                  <th className="text-right py-3 px-2 font-medium text-dash-navy/70">Avg. Value</th>
                  <th className="text-right py-3 px-2 font-medium text-dash-navy/70">Growth</th>
                </tr>
              </thead>
              <tbody>
                {eventPerformanceData.map((event, index) => (
                  <tr key={index} className="border-b border-dash-gray/10 hover:bg-gray-50/50">
                    <td className="py-3 px-2 font-medium text-dash-navy">{event.name}</td>
                    <td className="py-3 px-2 text-right text-dash-navy">{formatCurrency(event.revenue)}</td>
                    <td className="py-3 px-2 text-right text-dash-navy">{event.sessions}</td>
                    <td className="py-3 px-2 text-right text-dash-navy">{formatCurrency(event.avgSessionValue)}</td>
                    <td className="py-3 px-2 text-right">
                      <span className="flex items-center justify-end text-green-600 text-sm font-semibold">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {formatPercentage(Math.random() * 20 + 5)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}