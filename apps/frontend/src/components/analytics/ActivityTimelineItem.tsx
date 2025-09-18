import { Clock, DollarSign, User } from 'lucide-react';
import { BoothActivity, BoothEventType } from '@org/commons';

interface ActivityTimelineItemProps {
  activity: BoothActivity;
  icon: React.ReactNode;
  colors: {
    dot: string;
    badge: string;
    card: string;
  };
  isFirst?: boolean;
}

export function ActivityTimelineItem({ activity, icon, colors, isFirst }: ActivityTimelineItemProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventType = (type: BoothEventType): string => {
    switch (type) {
      case BoothEventType.SESSION_START:
        return 'Session Start';
      case BoothEventType.SESSION_END:
        return 'Session End';
      case BoothEventType.COUNTDOWN_START:
        return 'Countdown Start';
      case BoothEventType.CAPTURE_START:
        return 'Capture Start';
      case BoothEventType.FILE_DOWNLOAD:
        return 'Photo Taken';
      case BoothEventType.PROCESSING_START:
        return 'Processing';
      case BoothEventType.SHARING_SCREEN:
        return 'Sharing';
      case BoothEventType.PRINTING:
        return 'Printing';
      case BoothEventType.FILE_UPLOAD:
        return 'Upload';
      default:
        return type.replace('_', ' ').toLowerCase();
    }
  };

  return (
    <div className="relative group/item">
      <div className="absolute -left-6 top-3">
        <div className={`relative z-10 w-8 h-8 rounded-full bg-gradient-to-br ${colors.dot} shadow-lg border-2 border-white flex items-center justify-center group-hover/item:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        
        {isFirst && (
          <div className={`absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br ${colors.dot} animate-ping opacity-20`}></div>
        )}
      </div>
      
      <div className={`relative ml-6 p-4 rounded-xl border-2 border-transparent transition-all duration-200 group-hover/item:border-slate-200 group-hover/item:shadow-sm ${colors.card}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <h5 className="font-semibold text-dash-navy text-base">
                {activity.description}
              </h5>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}>
                {formatEventType(activity.type)}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-dash-navy/60">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(activity.timestamp)}
              </span>
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                Booth User
              </span>
              {activity.type === BoothEventType.PRINTING && (
                <span className="flex items-center font-medium text-green-600">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Print Completed
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}