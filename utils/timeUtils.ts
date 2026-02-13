/**
 * Returns the time remaining until next Sunday 23:59:59 (end of day) in the local timezone.
 */
export function getTimeUntilNextSunday(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + daysUntilSunday);
  nextSunday.setHours(23, 59, 59, 999);

  const diff = nextSunday.getTime() - now.getTime();
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}
