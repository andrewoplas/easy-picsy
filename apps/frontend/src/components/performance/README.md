# Performance Analytics Components

This directory contains components for displaying performance analytics data in the Easy Picsy admin dashboard.

## Components

### Main Components

- **`PerformancePage`** - Main page component that orchestrates all performance metrics
- **`SessionMetrics`** - Displays session-related metrics (average time, total sessions)
- **`PrintMetrics`** - Displays print-related metrics (total prints, reprints)
- **`EventAverages`** - Displays event-level averages (prints per event, reprints per event)

### Utility Components

- **`MetricsSection`** - Reusable wrapper for metric sections with consistent styling

**Note:** Loading and error states are now handled inline within `PerformancePage` for better maintainability.

## Data Flow

1. **`PerformancePage`** uses `usePerformanceAnalytics` hook
2. **`usePerformanceAnalytics`** combines data from `useTotalAnalytics` and `useEventAnalytics`
3. Data is passed down to individual metric components
4. Each component renders specific metrics using `AnalyticsCard`

## Features

- ✅ Real-time data from backend analytics API
- ✅ Date range filtering
- ✅ Loading states with skeleton UI
- ✅ Error handling with retry functionality
- ✅ Responsive design
- ✅ Type-safe data handling

## Usage

```tsx
import { PerformancePage } from '@/components/performance';

export default function PerformancePageRoute() {
  return <PerformancePage />;
}
```

## Data Structure

The performance analytics expect data in this format:

```typescript
interface PerformanceAnalytics {
  totalNetRevenue: number;
  totalWithdrawableRevenue: number;
  averageSessionTime: number;
  totalSessions: number;
  totalPrints: {
    singleSession: number;
    reprints: number;
    averagePerEvent: number;
    averageReprintsPerEvent: number;
  };
  eventCount: number;
}
```

## Future Enhancements

- [ ] Trend calculations with historical data
- [ ] Export functionality
- [ ] Real-time updates via WebSocket
- [ ] More granular filtering options
- [ ] Chart visualizations
