// Formats an ISO date string as "Month Year" (e.g. "May 2024") for display,
// falling back to null when the date is missing or unparseable so callers can
// choose their own fallback copy instead of showing "Invalid Date".
export function formatMonthYear(dateStr?: string): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// Formats a whole number of seconds as "M:SS" (e.g. 65 -> "1:05").
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
