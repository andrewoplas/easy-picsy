import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  History,
  Activity,
  ChevronDown,
  Camera,
  Play,
  CreditCard,
  User,
  Calendar,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';

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

export function MockActivityTimeline() {
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>({});

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
  );
}
