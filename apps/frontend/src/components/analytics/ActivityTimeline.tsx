'use client';

import { Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivitySessionGroup } from './ActivitySessionGroup';
import { useEventActivity } from '@/hooks/useEventActivity';
import { ListSkeleton } from '@/components/ui/list-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useState } from 'react';

interface ActivityTimelineProps {
  eventId: string;
}

export function ActivityTimeline({ eventId }: ActivityTimelineProps) {
  const { 
    data: activities, 
    isLoading,
    error,
    refetch
  } = useEventActivity(eventId);

  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Group activities by session
  const sessions = activities?.reduce((acc, activity) => {
    const { sessionId } = activity;
    if (!acc[sessionId]) {
      acc[sessionId] = [];
    }
    acc[sessionId].push(activity);
    return acc;
  }, {} as Record<string, typeof activities>) ?? {};

  // Sort sessions by most recent first
  const sortedSessions = Object.entries(sessions).sort(([, a], [, b]) => {
    const aTime = new Date(a[0]?.timestamp ?? 0).getTime();
    const bTime = new Date(b[0]?.timestamp ?? 0).getTime();
    return bTime - aTime;
  });

  if (error) {
    return (
      <Card className="bg-dash-white">
        <CardContent>
          <EmptyState
            icon={RefreshCw}
            title="Failed to load activity"
            description="There was an error loading the activity timeline. Please try again."
            action={{
              label: "Retry",
              onClick: () => refetch()
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-lg font-normal text-dash-navy tracking-wide flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Activity Timeline
          <div className="ml-auto text-dash-navy/60 text-sm">
            {activities?.length ?? 0} activities
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ListSkeleton count={5} />
        ) : sortedSessions.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="There is no booth activity recorded for this event yet."
          />
        ) : (
          <div className="space-y-6">
            {sortedSessions.map(([sessionId, activities]) => (
              <ActivitySessionGroup
                key={sessionId}
                sessionId={sessionId}
                activities={activities}
                isExpanded={sessionId === expandedSessionId}
                onToggle={(id) => setExpandedSessionId(
                  id === expandedSessionId ? null : id
                )}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}