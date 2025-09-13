'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  DollarSign,
  Users,
  Camera,
  Clock,
  CreditCard,
  ArrowUpRight,
  Calendar,
  Download,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock event data - will be replaced with API call
const mockEvent = {
  id: 'evt_001',
  name: 'Sarah & John Wedding',
  description: 'Beautiful wedding celebration',
  price: 150,
  currency: 'PHP',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
};

// Mock analytics data - will be replaced with API calls
const generateMockAnalytics = (eventId: string) => {
  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sessions: Math.floor(Math.random() * 15) + 5,
    revenue: Math.floor(Math.random() * 2000) + 500,
    photos: Math.floor(Math.random() * 150) + 50,
  }));

  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    sessions: i >= 8 && i <= 20 ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 2),
  }));

  const paymentMethods = [
    { name: 'GCash', value: 45, count: 234, color: '#3b82f6' },
    { name: 'Maya', value: 32, count: 167, color: '#10b981' },
    { name: 'BPI', value: 12, count: 62, color: '#f59e0b' },
    { name: 'UnionBank', value: 8, count: 42, color: '#ef4444' },
    { name: 'Others', value: 3, count: 16, color: '#8b5cf6' },
  ];

  const sessionDurations = [
    { range: '0-2 min', count: 45, percentage: 20 },
    { range: '2-4 min', count: 101, percentage: 45 },
    { range: '4-6 min', count: 67, percentage: 30 },
    { range: '6+ min', count: 11, percentage: 5 },
  ];

  const weeklyComparison = [
    { week: 'Week 1', revenue: 12500, sessions: 85 },
    { week: 'Week 2', revenue: 15200, sessions: 96 },
    { week: 'Week 3', revenue: 18300, sessions: 112 },
    { week: 'Week 4', revenue: 22100, sessions: 134 },
  ];

  return {
    totalRevenue: dailyData.reduce((sum, day) => sum + day.revenue, 0),
    totalSessions: dailyData.reduce((sum, day) => sum + day.sessions, 0),
    totalPhotos: dailyData.reduce((sum, day) => sum + day.photos, 0),
    avgSessionValue: Math.round(dailyData.reduce((sum, day) => sum + day.revenue, 0) / dailyData.reduce((sum, day) => sum + day.sessions, 0)),
    conversionRate: 96.5,
    dailyData,
    hourlyData,
    paymentMethods,
    sessionDurations,
    weeklyComparison,
    peakHour: hourlyData.reduce((max, hour) => hour.sessions > max.sessions ? hour : max, hourlyData[0]),
    avgSessionDuration: '3.2 min',
    totalCustomers: 521,
    repeatCustomers: 89,
  };
};

export default function EventAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState(mockEvent);
  const analytics = generateMockAnalytics(params.id as string);

  const formatCurrency = (value: number) => `₱${value.toLocaleString()}`;

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/dashboard/events')}
            className="border-dash-gray/50 hover:bg-dash-gray/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
          <div>
            <h1 className="text-3xl font-normal text-dash-navy tracking-wide">
              {event.name} Analytics
            </h1>
            <p className="text-dash-navy/70">
              Detailed performance metrics and insights
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="border-dash-gray/50 hover:bg-dash-gray/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-dash-gray/50 hover:bg-dash-gray/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Total Revenue
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {formatCurrency(analytics.totalRevenue)}
                </p>
                <div className="flex items-center text-sm font-semibold text-green-600 mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +18.2%
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
                  {analytics.totalSessions}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Active sessions
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
                  Photos Taken
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {analytics.totalPhotos.toLocaleString()}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Total captures
                </p>
              </div>
              <Camera className="h-8 w-8 text-dash-navy/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dash-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dash-navy/70">
                  Avg. Value
                </p>
                <p className="text-2xl font-normal text-dash-navy tracking-wide">
                  {formatCurrency(analytics.avgSessionValue)}
                </p>
                <p className="text-xs text-dash-navy/50 mt-1">
                  Per session
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
                  {analytics.conversionRate}%
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
        {/* Daily Performance */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Daily Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b"
                    fontSize={12}
                    interval={5}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), 'Revenue']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    fill="#fed7aa" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Usage */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Hourly Usage Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="hour" 
                    stroke="#64748b"
                    fontSize={12}
                    interval={3}
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

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
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
                      data={analytics.paymentMethods}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {analytics.paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {analytics.paymentMethods.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-dash-navy">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-dash-navy">{item.count}</div>
                      <div className="text-xs text-dash-navy/50">{item.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Duration Distribution */}
        <Card className="bg-dash-white">
          <CardHeader>
            <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
              Session Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.sessionDurations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="range" 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'count' ? 'Sessions' : 'Percentage']}
                    labelStyle={{ color: '#1e293b' }}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Comparison */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
            Weekly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : value,
                    name === 'revenue' ? 'Revenue' : 'Sessions'
                  ]}
                  labelStyle={{ color: '#1e293b' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Peak Hour
                </p>
                <p className="text-2xl font-normal text-blue-900 tracking-wide">
                  {analytics.peakHour.hour}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {analytics.peakHour.sessions} sessions
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Total Customers
                </p>
                <p className="text-2xl font-normal text-green-900 tracking-wide">
                  {analytics.totalCustomers}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Unique visitors
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Repeat Customers
                </p>
                <p className="text-2xl font-normal text-purple-900 tracking-wide">
                  {analytics.repeatCustomers}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Returned guests
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  Avg. Duration
                </p>
                <p className="text-2xl font-normal text-orange-900 tracking-wide">
                  {analytics.avgSessionDuration}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Per session
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}