'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CircularProgressProps {
  percentage: number;
  title: string;
  subtitle?: string;
}

export function CircularProgress({ percentage, title, subtitle }: CircularProgressProps) {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-dash-white">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-dash-navy tracking-wide">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-dash-navy/70">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative w-40 h-40">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              stroke="#e5e5e5"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke="url(#gradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-500 ease-in-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fca311" />
                <stop offset="100%" stopColor="#F5D547" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Percentage text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-dash-navy">{percentage}%</div>
              <div className="text-sm text-dash-navy/60">Event Ended</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}