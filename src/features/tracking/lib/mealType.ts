import type { MealType } from '../types';

export function defaultMealTypeFor(date: Date): MealType {
  const hour = date.getHours() + date.getMinutes() / 60;
  if (hour >= 5 && hour < 8) return 'fasting';
  if (hour >= 8 && hour < 10) return 'breakfast';
  if (hour >= 10 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 22) return 'dinner';
  return 'fasting';
}
