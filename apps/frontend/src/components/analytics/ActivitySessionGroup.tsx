import { Activity, Calendar, ChevronDown, Clock, User } from 'lucide-react';
import { ActivityTimelineItem } from './ActivityTimelineItem';
import { CreditCard, Play, Camera } from 'lucide-react';
import { BoothActivity, BoothEventType } from '@org/commons';

interface ActivitySessionGroupProps {
  sessionId: string;
  activities: BoothActivity[];
  isExpanded: boolean;
  onToggle: (sessionId: string) => void;
}

export function ActivitySessionGroup({
  sessionId,
  activities,
  isExpanded,
  onToggle,
}: ActivitySessionGroupProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: BoothEventType) => {
    switch (type) {
      case BoothEventType.PRINTING:
        return <CreditCard className="w-4 h-4 text-white" />;
      case BoothEventType.SESSION_START:
        return <Play className="w-4 h-4 text-white" />;
      case BoothEventType.CAPTURE_START:
      case BoothEventType.FILE_DOWNLOAD:
        return <Camera className="w-4 h-4 text-white" />;
      default:
        return <Activity className="w-4 h-4 text-white" />;
    }
  };

  const getActivityColors = (type: BoothEventType) => {
    switch (type) {
      case BoothEventType.PRINTING:
        return {
          dot: 'from-green-500 to-green-600',
          badge: 'bg-green-100 text-green-700 border-green-200',
          card: 'hover:bg-green-50/50 border-green-100/50'
        };
      case BoothEventType.SESSION_START:
        return {
          dot: 'from-blue-500 to-blue-600',
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          card: 'hover:bg-blue-50/50 border-blue-100/50'
        };
      case BoothEventType.CAPTURE_START:
      case BoothEventType.FILE_DOWNLOAD:
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

  return (
    <div className="group">
      <div className="relative">
        <button
          onClick={() => onToggle(sessionId)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            
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
          
          <div className="flex items-center space-x-3">
            <div className="text-xs text-dash-navy/50 font-medium px-3 py-1 bg-white rounded-full border border-slate-200">
              {isExpanded ? 'Collapse' : 'Expand'}
            </div>
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5 text-dash-navy/60" />
            </div>
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 ml-8 mr-4">
          <div className="relative pl-8">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent"></div>
            
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <ActivityTimelineItem
                  key={activity.id}
                  activity={activity}
                  icon={getActivityIcon(activity.type)}
                  colors={getActivityColors(activity.type)}
                  isFirst={index === 0}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}