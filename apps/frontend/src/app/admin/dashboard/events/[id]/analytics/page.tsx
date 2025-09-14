'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Printer,
  Copy,
  RefreshCw,
  Lock,
  Unlock,
  Activity,
  History,
  ChevronRight,
  Home,
  ChevronDown,
  Camera,
  Play,
  CreditCard,
  User,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock event data
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

// Mock data for demonstration - sorted by most recent first
const mockActivityLog = [
  {
    id: '6',
    sessionId: 'session_003',
    timestamp: '2024-01-15T12:00:00Z',
    type: 'session_start',
    description: 'Session started',
    user: 'Guest User'
  },
  {
    id: '5',
    sessionId: 'session_002',
    timestamp: '2024-01-15T11:05:00Z',
    type: 'photo_taken',
    description: 'Photo taken (1/4)',
    user: 'Guest User'
  },
  {
    id: '4',
    sessionId: 'session_002',
    timestamp: '2024-01-15T11:00:00Z',
    type: 'session_start',
    description: 'Session started',
    user: 'Guest User'
  },
  {
    id: '3',
    sessionId: 'session_001',
    timestamp: '2024-01-15T10:40:00Z',
    type: 'payment',
    description: 'Payment received: ₱250.00',
    user: 'Guest User'
  },
  {
    id: '2',
    sessionId: 'session_001',
    timestamp: '2024-01-15T10:35:00Z',
    type: 'photo_taken',
    description: 'Photo taken (1/4)',
    user: 'Guest User'
  },
  {
    id: '1',
    sessionId: 'session_001',
    timestamp: '2024-01-15T10:30:00Z',
    type: 'session_start',
    description: 'Session started',
    user: 'Guest User'
  }
];

const mockTransactions = [
  {
    id: '1',
    timestamp: '2024-01-15T10:40:00Z',
    amount: 250,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_001'
  },
  {
    id: '2',
    timestamp: '2024-01-15T09:20:00Z',
    amount: 180,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_002'
  },
  {
    id: '3',
    timestamp: '2024-01-15T08:15:00Z',
    amount: 320,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_003'
  },
  {
    id: '4',
    timestamp: '2024-01-15T07:30:00Z',
    amount: 150,
    type: 'payment',
    status: 'completed',
    sessionId: 'session_004'
  }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const mockAnalytics = {
  runningEarnings: 15420,
  sessionAverageTime: '4:32',
  totalPrints: 156,
  totalReprints: 23,
};

export default function EventAnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [boothLocked, setBoothLocked] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLockToggle = () => {
    setBoothLocked(!boothLocked);
    toast.success(`Booth ${boothLocked ? 'unlocked' : 'locked'} successfully!`);
  };

  const handleRefund = (transactionId: string) => {
    if (window.confirm('Are you sure you want to process this refund?')) {
      toast.success('Refund processed successfully!');
    }
  };

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }));
  };

  // Group activity log by session and sort by most recent first
  const groupedActivity = mockActivityLog.reduce((acc, activity) => {
    if (!acc[activity.sessionId]) {
      acc[activity.sessionId] = [];
    }
    acc[activity.sessionId].push(activity);
    return acc;
  }, {} as Record<string, typeof mockActivityLog>);

  // Sort each session's activities by most recent first
  Object.keys(groupedActivity).forEach(sessionId => {
    groupedActivity[sessionId].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-dash-navy/60 mb-4">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="flex items-center hover:text-dash-navy transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          Dashboard
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => router.push('/admin/dashboard/events')}
          className="hover:text-dash-navy transition-colors"
        >
          Events
        </button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-dash-navy font-medium">{mockEvent.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">
            {mockEvent.name}
          </h1>
          <p className="text-dash-navy/70">
            Event management and analytics
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLoading(!loading)}
          disabled={loading}
          className="border-dash-gray/50 hover:bg-dash-gray/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Manual Controls - Remote Control Style */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg font-normal text-white tracking-wide flex items-center justify-center">
            <Activity className="w-5 h-5 mr-2" />
            Remote Control
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Power/Lock Button */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 blur-sm"></div>
              <Button
                onClick={handleLockToggle}
                className={`relative w-20 h-20 rounded-full text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-105 ${
                  boothLocked
                    ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-500/50'
                    : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/50'
                }`}
              >
                {boothLocked ? (
                  <Lock className="w-8 h-8" />
                ) : (
                  <Unlock className="w-8 h-8" />
                )}
              </Button>
            </div>
            
            {/* Status Display */}
            <div className="bg-slate-700 rounded-lg px-6 py-3 border border-slate-600">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${boothLocked ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-white font-medium">
                  {boothLocked ? 'BOOTH LOCKED' : 'BOOTH ACTIVE'}
                </span>
              </div>
            </div>

            {/* Control Label */}
            <p className="text-slate-300 text-sm text-center">
              {boothLocked ? 'Press to unlock booth' : 'Press to lock booth'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics - Separate Cards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-normal text-dash-navy tracking-wide flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" />
          Analytics Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Running Earnings Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-emerald-700">Running Earnings</h3>
                  </div>
                  <p className="text-3xl font-bold text-emerald-900">
                    {formatCurrency(mockAnalytics.runningEarnings)}
                  </p>
                  <p className="text-xs text-emerald-600">Total revenue today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Average Time Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-blue-700">Avg Session Time</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">
                    {mockAnalytics.sessionAverageTime}
                  </p>
                  <p className="text-xs text-blue-600">Per session duration</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Prints Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Printer className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-purple-700">Total Prints</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-900">
                    {mockAnalytics.totalPrints}
                  </p>
                  <p className="text-xs text-purple-600">Photos printed today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Reprints Card */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Copy className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-sm font-medium text-orange-700">Total Reprints</h3>
                  </div>
                  <p className="text-3xl font-bold text-orange-900">
                    {mockAnalytics.totalReprints}
                  </p>
                  <p className="text-xs text-orange-600">Reprints requested</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-lg font-normal text-dash-navy tracking-wide flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Log Transaction History
            <div className="ml-auto flex items-center space-x-2">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {formatCurrency(mockTransactions.reduce((sum, t) => sum + t.amount, 0))} total
              </div>
              <div className="text-dash-navy/60 text-sm">
                {mockTransactions.length} payments
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group relative"
              >
                {/* Subtle Hover Background */}
                <div className="absolute inset-0 bg-green-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                
                {/* Main Transaction Card */}
                <div className="relative flex items-center justify-between p-4 rounded-lg border border-dash-gray/20 hover:border-green-200 transition-all duration-200 hover:shadow-sm">
                  
                  {/* Left Side - Payment Info */}
                  <div className="flex items-center space-x-4">
                    {/* Success Icon */}
                    <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    
                    {/* Payment Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-dash-navy">
                          Payment received
                        </span>
                        <div className="px-2 py-1 bg-green-500 text-white rounded-md text-sm font-medium">
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                      <p className="text-sm text-dash-navy/60">
                        {formatTime(transaction.timestamp)} • Session {transaction.sessionId} • Status: Completed
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefund(transaction.id)}
                    className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700 hover:border-red-300 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    REFUND
                  </Button>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="bg-dash-white">
        <CardHeader>
          <CardTitle className="text-lg font-normal text-dash-navy tracking-wide flex items-center justify-between">
            <div className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Activity Timeline
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-dash-navy/60">Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-dash-navy/60">Session</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-dash-navy/60">Photo</span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedActivity).map(([sessionId, activities]) => (
              <div key={sessionId} className="group">
                {/* Session Header - Enhanced */}
                <div className="relative">
                  <button
                    onClick={() => toggleSession(sessionId)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Session Icon */}
                      <div className="relative">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      
                      {/* Session Info */}
                      <div className="text-left">
                        <h4 className="font-semibold text-dash-navy text-lg capitalize">
                          {sessionId.replace('_', ' ')}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-dash-navy/70 flex items-center">
                            <Activity className="w-3 h-3 mr-1" />
                            {activities.length} activities
                          </span>
                          <span className="text-sm text-dash-navy/70 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(activities[0]?.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-dash-navy/70 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(activities[0]?.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expand Icon */}
                    <div className="flex items-center space-x-3">
                      <div className="text-xs text-dash-navy/50 font-medium px-3 py-1 bg-white rounded-full border border-slate-200">
                        {expandedSessions[sessionId] ? 'Collapse' : 'Expand'}
                      </div>
                      <div className={`transform transition-transform duration-200 ${expandedSessions[sessionId] ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-5 h-5 text-dash-navy/60" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Enhanced Timeline Content */}
                {expandedSessions[sessionId] && (
                  <div className="mt-4 ml-8 mr-4">
                    <div className="relative pl-8">
                      {/* Enhanced Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent"></div>
                      
                      {/* Timeline Items */}
                      <div className="space-y-6">
                        {activities.map((activity, index) => {
                          const getActivityIcon = () => {
                            switch (activity.type) {
                              case 'payment':
                                return <CreditCard className="w-4 h-4 text-white" />;
                              case 'session_start':
                                return <Play className="w-4 h-4 text-white" />;
                              case 'photo_taken':
                                return <Camera className="w-4 h-4 text-white" />;
                              default:
                                return <Activity className="w-4 h-4 text-white" />;
                            }
                          };

                          const getActivityColors = () => {
                            switch (activity.type) {
                              case 'payment':
                                return {
                                  dot: 'from-green-500 to-green-600',
                                  badge: 'bg-green-100 text-green-700 border-green-200',
                                  card: 'hover:bg-green-50/50 border-green-100/50'
                                };
                              case 'session_start':
                                return {
                                  dot: 'from-blue-500 to-blue-600',
                                  badge: 'bg-blue-100 text-blue-700 border-blue-200',
                                  card: 'hover:bg-blue-50/50 border-blue-100/50'
                                };
                              case 'photo_taken':
                                return {
                                  dot: 'from-purple-500 to-purple-600',
                                  badge: 'bg-purple-100 text-purple-700 border-purple-200',
                                  card: 'hover:bg-purple-50/50 border-purple-100/50'
                                };
                              default:
                                return {
                                  dot: 'from-gray-400 to-gray-500',
                                  badge: 'bg-gray-100 text-gray-700 border-gray-200',
                                  card: 'hover:bg-gray-50/50 border-gray-100/50'
                                };
                            }
                          };

                          const colors = getActivityColors();

                          return (
                            <div key={activity.id} className="relative group/item">
                              {/* Timeline Node */}
                              <div className="absolute -left-6 top-3">
                                <div className={`relative z-10 w-8 h-8 rounded-full bg-gradient-to-br ${colors.dot} shadow-lg border-2 border-white flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200`}>
                                  {getActivityIcon()}
                                </div>
                                
                                {/* Pulse animation for recent activities */}
                                {index === 0 && (
                                  <div className={`absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br ${colors.dot} animate-ping opacity-20`}></div>
                                )}
                              </div>
                              
                              {/* Activity Card */}
                              <div className={`relative ml-6 p-4 rounded-xl border-2 border-transparent transition-all duration-200 group-hover/item:border-slate-200 group-hover/item:shadow-sm ${colors.card}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    {/* Activity Title */}
                                    <div className="flex items-center space-x-3">
                                      <h5 className="font-semibold text-dash-navy text-base">
                                        {activity.description}
                                      </h5>
                                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}>
                                        {activity.type.replace('_', ' ').toUpperCase()}
                                      </span>
                                    </div>
                                    
                                    {/* Activity Meta */}
                                    <div className="flex items-center space-x-4 text-sm text-dash-navy/60">
                                      <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatTime(activity.timestamp)}
                                      </span>
                                      <span className="flex items-center">
                                        <User className="w-3 h-3 mr-1" />
                                        {activity.user}
                                      </span>
                                      {activity.type === 'payment' && (
                                        <span className="flex items-center font-medium text-green-600">
                                          <DollarSign className="w-3 h-3 mr-1" />
                                          Payment Received
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}