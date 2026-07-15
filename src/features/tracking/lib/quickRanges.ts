import { toDateInputValue } from '../../../shared/lib/dateRange';

export interface QuickRangeInputs {
  start: string;
  end: string;
}

export function yesterdayRange(today: Date): QuickRangeInputs {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return { start: toDateInputValue(yesterday), end: toDateInputValue(yesterday) };
}

export function pastDaysRange(today: Date, days: number): QuickRangeInputs {
  const start = new Date(today);
  start.setDate(today.getDate() - (days - 1));
  return { start: toDateInputValue(start), end: toDateInputValue(today) };
}
