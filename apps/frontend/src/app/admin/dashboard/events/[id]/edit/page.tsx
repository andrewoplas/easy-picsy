'use client';

import { notFound } from 'next/navigation';
import { EventWizard } from '@/components/events/event-wizard';
import { useEventById } from '@/hooks/useEvents';
import { Skeleton } from '@/components/ui/skeleton';
import { use } from 'react';

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { id } = use(params);
  const { data: event, isLoading } = useEventById(id);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 p-8">
        <div className="flex-1 max-w-7xl mx-auto flex gap-8">
          <div className="flex-1 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-48 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  return <EventWizard event={event} />;
}

