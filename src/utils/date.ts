import { format, parseISO } from 'date-fns';

/**
 * Format ISO date string to readable date
 * "2026-05-28T10:00:00Z" → "28 May 2026"
 */
export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'd MMM yyyy');
  } catch {
    return iso;
  }
}

/**
 * Format ISO date string to date + time
 * "2026-05-28T10:00:00Z" → "28 May 2026, 10:00 AM"
 */
export function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "d MMM yyyy, h:mm a");
  } catch {
    return iso;
  }
}

/**
 * Format payroll period
 * "2026-02-01T00:00:00Z" → "February 2026"
 */
export function formatPeriod(iso: string): string {
  try {
    return format(parseISO(iso), 'MMMM yyyy');
  } catch {
    return iso;
  }
}
