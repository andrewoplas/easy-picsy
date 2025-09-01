'use client';

import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { ProjectTasks } from '@/components/dashboard/ProjectTasks';
import { RemindersSection } from '@/components/dashboard/RemindersSection';
import { TeamCollaboration } from '@/components/dashboard/TeamCollaboration';
import { TimeTracker } from '@/components/dashboard/TimeTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Camera,
  Clock,
  CreditCard,
  Monitor
} from 'lucide-react';

const stats = [
  {
    name: 'Total Events',
    value: '24',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
    description: 'Increased from last month',
    isPrimary: true,
  },
  {
    name: 'Ended Events',
    value: '10',
    change: '+8%',
    trend: 'up',
    icon: Calendar,
    description: 'Increased from last month',
    isPrimary: false,
  },
  {
    name: 'Running Events',
    value: '12',
    change: '+4%',
    trend: 'up',
    icon: Monitor,
    description: 'Increased from last month',
    isPrimary: false,
  },
  {
    name: 'Pending Events',
    value: '2',
    change: '0%',
    trend: 'up',
    icon: Clock,
    description: 'On Discuss',
    isPrimary: false,
  },
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
    status: 'completed',
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Received',
    description: 'Birthday Party - Booth #1',
    time: '15 minutes ago',
    amount: '+$120',
    icon: CreditCard,
    status: 'completed',
  },
  {
    id: 3,
    type: 'booth',
    title: 'Booth Connected',
    description: 'Booth #5 came online',
    time: '1 hour ago',
    amount: null,
    icon: Monitor,
    status: 'active',
  },
  {
    id: 4,
    type: 'event',
    title: 'New Event Created',
    description: 'Corporate Event - Downtown',
    time: '2 hours ago',
    amount: null,
    icon: Calendar,
    status: 'pending',
  },
];

const weeklyData = [
  { day: 'Mon', sessions: 45, revenue: 1250 },
  { day: 'Tue', sessions: 52, revenue: 1450 },
  { day: 'Wed', sessions: 38, revenue: 1050 },
  { day: 'Thu', sessions: 65, revenue: 1800 },
  { day: 'Fri', sessions: 78, revenue: 2150 },
  { day: 'Sat', sessions: 95, revenue: 2650 },
  { day: 'Sun', sessions: 88, revenue: 2400 },
];

export default function DashboardPage() {


  return (
    <div className="space-y-8">
      {/* Dashboard Title Section */}
      <div className="mb-8">
        <div>
          <h1 className="text-4xl font-normal text-dash-navy mb-2 tracking-wide">Dashboard</h1>
          <p className="text-dash-navy/60 text-lg">
            Plan, prioritize, and accomplish your photobooth business with ease.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className={`hover:bg-gray-50/50 transition-all duration-200 group ${stat.isPrimary
              ? 'bg-gradient-to-br from-dash-orange to-easy-yellow text-white'
              : 'bg-dash-white'
              }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`text-sm font-medium mb-2 ${stat.isPrimary ? 'text-white/80' : 'text-dash-navy/70'
                    }`}>
                    {stat.name}
                  </p>
                  <p className={`text-3xl font-bold mb-3 ${stat.isPrimary ? 'text-white' : 'text-dash-navy'
                    }`}>
                    {stat.value}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center text-sm font-semibold ${stat.isPrimary
                      ? 'text-white'
                      : stat.trend === 'up'
                        ? 'text-easy-yellow'
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
                  <p className={`text-xs mt-1 ${stat.isPrimary ? 'text-white/70' : 'text-dash-navy/50'
                    }`}>
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.isPrimary
                  ? 'bg-white/20'
                  : 'bg-easy-yellow/10'
                  }`}>
                  <stat.icon className={`h-6 w-6 ${stat.isPrimary
                    ? 'text-white'
                    : 'text-easy-yellow'
                    }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Analytics */}
        <div className="lg:col-span-4">
          <AnalyticsChart data={weeklyData} />
        </div>

        {/* Center Column - Team & Reminders */}
        <div className="lg:col-span-4 space-y-8">
          <TeamCollaboration />
          <RemindersSection />
        </div>

        {/* Right Column - Progress & Tasks */}
        <div className="lg:col-span-4 space-y-8">
          <CircularProgress
            percentage={41}
            title="Event Progress"
            subtitle="Overall completion status"
          />
          <ProjectTasks />
        </div>
      </div>

      {/* Bottom Row - Time Tracker */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <TimeTracker />
        </div>
        <div className="lg:col-span-8">
          {/* Keep the recent activity section */}
          <Card className="bg-dash-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">
                    Recent Activity
                  </CardTitle>
                  <p className="text-sm text-dash-navy/70 mt-1">
                    Latest updates from your photobooth network
                  </p>
                </div>
                <button className="text-sm text-dash-navy/70 hover:text-easy-yellow font-medium flex items-center space-x-1 transition-colors">
                  <span>View all</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-dash-gray/20 transition-colors group"
                  >
                    <div
                      className={`p-2 rounded-lg ${activity.status === 'completed'
                        ? 'bg-easy-yellow/10'
                        : activity.status === 'active'
                          ? 'bg-dash-gray/30'
                          : 'bg-dash-gray/30'
                        }`}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${activity.status === 'completed'
                          ? 'text-easy-yellow'
                          : activity.status === 'active'
                            ? 'text-dash-navy'
                            : 'text-dash-navy'
                          }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-dash-navy group-hover:text-dash-navy/80">
                          {activity.title}
                        </p>
                        {activity.amount && (
                          <span className="text-easy-yellow font-semibold">
                            {activity.amount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-dash-navy/70">
                          {activity.description}
                        </p>
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
      </div>
    </div>
  );
}