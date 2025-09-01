'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface TimeTrackerProps {
  initialSeconds?: number;
  eventName?: string;
}

export function TimeTracker({ initialSeconds = 5048, eventName = "Wedding Event" }: TimeTrackerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <Card className="bg-gradient-to-br from-dash-navy to-dash-navy/90 text-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-white tracking-wide">Time Tracker</CardTitle>
        <p className="text-white/70 text-sm">Active event: {eventName}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Digital Clock Display */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-white mb-2">
            {formatTime(seconds)}
          </div>
          <div className="text-white/60 text-sm">
            Total session time
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white border-none"
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              size="sm" 
              className="bg-easy-yellow hover:bg-easy-yellow/90 text-dash-navy border-none font-semibold"
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={handleStop}
            size="sm"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 bg-transparent"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>

        {/* Session Info */}
        <div className="bg-white/10 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Started:</span>
            <span className="text-white">
              {new Date(Date.now() - seconds * 1000).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Status:</span>
            <span className={`font-semibold ${isRunning ? 'text-green-400' : 'text-easy-yellow'}`}>
              {isRunning ? 'Active' : 'Paused'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}