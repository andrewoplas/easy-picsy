'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface EventsSkeletonProps {
  eventCount?: number;
}

export function EventsSkeleton({ eventCount = 3 }: EventsSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal text-dash-navy tracking-wide">Events</h1>
          <p className="text-dash-navy/70">Manage your photobooth events</p>
        </div>
        <Skeleton className="w-32 h-10 rounded-lg" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Skeleton className="h-10 w-80 rounded-lg" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Events List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: eventCount }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {/* Left side - Event info */}
              <div className="flex-1">
                <div className="space-y-2 mb-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              {/* Right side - Action buttons */}
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-8 w-8" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}