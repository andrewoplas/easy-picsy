/**
 * Utility functions for calculating trends and comparisons
 */

export interface TrendData {
  value: number;
  isPositive: boolean;
}

/**
 * Calculate trend percentage between current and previous values
 */
export function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return {
      value: current > 0 ? 100 : 0,
      isPositive: current > 0,
    };
  }

  const percentage = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(percentage)),
    isPositive: percentage >= 0,
  };
}

/**
 * Format trend for display
 */
export function formatTrend(trend: TrendData): string {
  const sign = trend.isPositive ? '+' : '-';
  return `${sign}${trend.value}%`;
}

/**
 * Get trend description based on context
 */
export function getTrendDescription(trend: TrendData, context: string): string {
  const direction = trend.isPositive ? 'increase' : 'decrease';
  return `${direction} vs. ${context}`;
}
