/**
 * Utility functions for date calculations in analytics
 */

/**
 * Get the start and end dates for the current month
 */
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  // Use UTC to avoid timezone issues
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
  return { start, end };
}

/**
 * Get the start and end dates for the previous month
 */
export function getPreviousMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  // Use UTC to avoid timezone issues
  const start = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999));
  return { start, end };
}

/**
 * Format a date to ISO string without milliseconds
 */
export function formatDateForDb(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z';
}