'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  CreditCard, 
  Monitor, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Camera,
  Star
} from 'lucide-react';

const stats = [
  { 
    name: 'Total Events', 
    value: '24', 
    change: '+12%', 
    trend: 'up',
    icon: Calendar, 
    description: 'Increased from last month',
    bgColor: 'bg-dash-gray/30',
    iconColor: 'text-dash-navy'
  },
  {
    name: 'Revenue Today',
    value: '$2,847',
    change: '+18%',
    trend: 'up',
    icon: DollarSign,
    description: 'From 12 sessions',
    bgColor: 'bg-dash-orange/10',
    iconColor: 'text-dash-orange'
  },
  { 
    name: 'Active Booths', 
    value: '8', 
    change: '+2',
    trend: 'up',
    icon: Monitor, 
    description: 'Currently online',
    bgColor: 'bg-dash-gray/30',
    iconColor: 'text-dash-navy'
  },
  { 
    name: 'Sessions Today', 
    value: '142', 
    change: '-4%',
    trend: 'down',
    icon: Users, 
    description: 'Total sessions',
    bgColor: 'bg-dash-gray/30',
    iconColor: 'text-dash-navy'
  },
];

const quickActions = [
  {
    title: 'Create New Event',
    description: 'Set up a new photobooth event',
    icon: Calendar,
    color: 'bg-dash-orange',
    hoverColor: 'hover:bg-dash-orange/90'
  },
  {
    title: 'View Analytics',
    description: 'Check your business insights',
    icon: TrendingUp,
    color: 'bg-dash-navy',
    hoverColor: 'hover:bg-dash-navy/90'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'session',
    title: 'Photo Session Completed',
    description: 'Wedding Event - Booth #3',
    time: '2 minutes ago',
    amount: '+$85',
    icon: Camera,
    status: 'completed'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    description: 'Birthday Party - Booth #1',
    time: '15 minutes ago',
    amount: '+$120',
    icon: CreditCard,
    status: 'completed'
  },
  {
    id: 3,
    type: 'booth',
    title: 'Booth Connected',
    description: 'Booth #5 came online',
    time: '1 hour ago',
    amount: null,
    icon: Monitor,
    status: 'active'
  },
  {
    id: 4,
    type: 'event',
    title: 'New Event Created',
    description: 'Corporate Event - Downtown',
    time: '2 hours ago',
    amount: null,
    icon: Calendar,
    status: 'pending'
  }
];

const weeklyData = [
  { day: 'Mon', sessions: 45, revenue: 1250 },
  { day: 'Tue', sessions: 52, revenue: 1450 },
  { day: 'Wed', sessions: 38, revenue: 1050 },
  { day: 'Thu', sessions: 65, revenue: 1800 },
  { day: 'Fri', sessions: 78, revenue: 2150 },
  { day: 'Sat', sessions: 95, revenue: 2650 },
  { day: 'Sun', sessions: 88, revenue: 2400 }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'there';

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue));
  const maxSessions = Math.max(...weeklyData.map(d => d.sessions));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dash-navy mb-2">
              Good morning, {firstName}! 👋
            </h1>
            <p className="text-dash-navy/70 text-lg">
              Here&apos;s what&apos;s happening with your photobooth business today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm text-dash-navy/60">Today&apos;s Performance</p>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-dash-orange fill-current" />
                <span className="text-lg font-semibold text-dash-navy">Excellent</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-dash-white border border-dash-gray/50 shadow-sm hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-dash-navy/70 mb-2">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-dash-navy mb-3">
                    {stat.value}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-sm font-semibold ${
                      stat.trend === 'up' 
                        ? 'text-dash-orange' 
                        : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-dash-navy/50 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.bgColor} rounded-xl p-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Weekly Performance Chart */}
        <div className="lg:col-span-8">
          <Card className="bg-dash-white border border-dash-gray/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-dash-navy">Weekly Performance</CardTitle>
                  <p className="text-sm text-dash-navy/70 mt-1">Sessions and revenue for the past 7 days</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-dash-navy rounded-full"></div>
                    <span className="text-sm text-dash-navy/70">Sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-dash-orange rounded-full"></div>
                    <span className="text-sm text-dash-navy/70">Revenue</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-dash-navy">{day.day}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 bg-dash-gray/30 rounded-full h-2 mr-4">
                          <div 
                            className="bg-dash-navy h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(day.sessions / maxSessions) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-dash-navy w-12">{day.sessions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 bg-dash-gray/30 rounded-full h-2 mr-4">
                          <div 
                            className="bg-dash-orange h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-dash-navy w-12">${day.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4">
          <Card className="bg-dash-white border border-dash-gray/50 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-dash-navy">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  className="w-full text-left group rounded-xl p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className={`${action.color} ${action.hoverColor} rounded-xl p-4 transition-all duration-200`}>
                    <div className="flex items-center space-x-3">
                      <div className="bg-white/20 rounded-lg p-2">
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {action.title}
                        </h3>
                        <p className="text-sm text-white/90">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-dash-white border border-dash-gray/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-dash-navy">Recent Activity</CardTitle>
              <p className="text-sm text-dash-navy/70 mt-1">Latest updates from your photobooth network</p>
            </div>
            <button className="text-sm text-dash-navy/70 hover:text-dash-orange font-medium flex items-center space-x-1 transition-colors">
              <span>View all</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-dash-gray/20 transition-colors group">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'completed' ? 'bg-dash-orange/10' :
                  activity.status === 'active' ? 'bg-dash-gray/30' : 'bg-dash-gray/30'
                }`}>
                  <activity.icon className={`w-5 h-5 ${
                    activity.status === 'completed' ? 'text-dash-orange' :
                    activity.status === 'active' ? 'text-dash-navy' : 'text-dash-navy'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-dash-navy group-hover:text-dash-navy/80">
                      {activity.title}
                    </p>
                    {activity.amount && (
                      <span className="text-dash-orange font-semibold">{activity.amount}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-dash-navy/70">{activity.description}</p>
                    <div className="flex items-center space-x-1 text-xs text-dash-navy/50">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
