export type MealType = 'fasting' | 'breakfast' | 'lunch' | 'dinner';

export interface Reading {
  id: string;
  value: number;
  mealType: MealType;
  timestamp: number;
}

export interface TargetRange {
  low: number;
  high: number;
}

export interface GlucoseStatus {
  label: 'Low' | 'High' | 'In range';
  color: string;
}
