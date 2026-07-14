export interface DateRange {
  start: Date;
  end: Date;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isWithinRange(timestamp: number, range: DateRange): boolean {
  return timestamp >= startOfDay(range.start).getTime() && timestamp <= endOfDay(range.end).getTime();
}

export function filterByRange<T extends { timestamp: number }>(items: T[], range: DateRange): T[] {
  return items.filter((item) => isWithinRange(item.timestamp, range)).sort((a, b) => a.timestamp - b.timestamp);
}

export function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isValidRange(start: Date | null, end: Date | null): boolean {
  return start !== null && end !== null && start.getTime() <= end.getTime();
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
