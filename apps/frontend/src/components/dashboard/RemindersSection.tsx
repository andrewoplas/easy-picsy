'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: 'meeting' | 'event' | 'maintenance' | 'delivery';
}

interface RemindersSectionProps {
  reminders?: Reminder[];
}

const defaultReminders: Reminder[] = [
  {
    id: '1',
    title: 'Meeting with Arc Wedding Planners',
    time: '02:00 pm - 04:00 pm',
    location: 'Conference Room A',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Equipment Delivery - Golden Palace',
    time: '10:00 am - 12:00 pm',
    location: 'Makati City',
    type: 'delivery',
  },
  {
    id: '3',
    title: 'Booth Maintenance Check',
    time: '08:00 am - 09:30 am',
    type: 'maintenance',
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'meeting':
      return Calendar;
    case 'event': 
      return Calendar;
    case 'maintenance':
      return Clock;
    case 'delivery':
      return MapPin;
    default:
      return Calendar;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'meeting':
      return 'bg-blue-100 text-blue-700';
    case 'event':
      return 'bg-purple-100 text-purple-700';
    case 'maintenance':
      return 'bg-orange-100 text-orange-700';
    case 'delivery':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function RemindersSection({ reminders = defaultReminders }: RemindersSectionProps) {
  const primaryReminder = reminders[0];
  const otherReminders = reminders.slice(1);

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Reminder */}
        {primaryReminder && (
          <div className="bg-gradient-to-r from-easy-yellow/10 to-dash-orange/10 rounded-lg p-4 border border-easy-yellow/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-dash-navy mb-1">
                  {primaryReminder.title}
                </h4>
                <div className="flex items-center text-sm text-dash-navy/70 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Time: {primaryReminder.time}</span>
                </div>
                {primaryReminder.location && (
                  <div className="flex items-center text-sm text-dash-navy/70">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{primaryReminder.location}</span>
                  </div>
                )}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(primaryReminder.type)}`}>
                {primaryReminder.type}
              </div>
            </div>
            <Button className="bg-gradient-to-r from-dash-orange to-easy-yellow text-white hover:from-dash-orange/90 hover:to-easy-yellow/90 w-full">
              <Calendar className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
          </div>
        )}

        {/* Other Reminders */}
        {otherReminders.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-dash-navy/70">Upcoming</h5>
            {otherReminders.map((reminder) => {
              const IconComponent = getTypeIcon(reminder.type);
              return (
                <div
                  key={reminder.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-dash-gray/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-easy-yellow/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-easy-yellow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dash-navy text-sm truncate">
                      {reminder.title}
                    </p>
                    <p className="text-xs text-dash-navy/60">
                      {reminder.time}
                    </p>
                    {reminder.location && (
                      <p className="text-xs text-dash-navy/50">
                        {reminder.location}
                      </p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                    {reminder.type}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}