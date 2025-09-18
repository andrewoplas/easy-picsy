'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Unlock,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events';

export default function RemoteControlPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [boothLocked, setBoothLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getById(eventId),
    enabled: !!eventId,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLockToggle = () => {
    const newStatus = !boothLocked;
    setBoothLocked(newStatus);
    
    if (newStatus) {
      toast('Booth locked successfully!', {
        icon: <Lock className="w-6 h-6" />,
        className: '!border-dash-orange !bg-dash-orange !text-white',
        duration: 2000,
      });
    } else {
      toast('Booth unlocked successfully!', {
        icon: <Unlock className="w-6 h-6" />,
        className: '!border-green-500 !bg-green-500 !text-white',
        duration: 2000,
      });
    }
  };

  const handleBack = () => {
    router.push(`/admin/dashboard/events/${eventId}/analytics`);
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading remote control...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-white">
      {/* Back Button - Top Left */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="absolute top-6 left-6 rounded-full w-10 h-10 hover:bg-gray-100"
      >
        <ChevronRightIcon className="w-6 h-6 rotate-180" />
      </Button>

      {/* Main Control Area - Full Screen Centered */}
      <div className="h-full flex flex-col items-center justify-center px-6">
        {/* Event Details */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-800">
            {event?.name || 'Booth Control'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(currentTime)} • {formatTime(currentTime)}
          </p>
        </div>

        {/* Lock/Unlock Control */}
        <div className="flex flex-col items-center">
          <Button
            onClick={handleLockToggle}
            className={`w-48 h-48 rounded-full text-white shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 ${
              boothLocked
                ? 'bg-gradient-to-br from-dash-orange to-easy-yellow hover:from-dash-orange/90 hover:to-easy-yellow/90'
                : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}
          >
            {boothLocked ? (
              <Lock className="!w-[50px] !h-[50px]" />
            ) : (
              <Unlock className="!w-[50px] !h-[50px]" />
            )}
          </Button>
          
          {/* Status Text */}
          <div className="text-center mt-12">
            <p className="text-2xl font-medium text-gray-800">
              {boothLocked ? 'Booth Locked' : 'Booth Active'}
            </p>
            <p className="text-base text-gray-500 mt-2">
              {boothLocked ? 'Tap to unlock' : 'Tap to lock'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
