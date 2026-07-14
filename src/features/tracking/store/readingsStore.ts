import { supabase } from '../../../shared/api/supabaseClient';
import type { Reading } from '../types';

interface ReadingRow {
  id: string;
  value: number;
  meal_type: Reading['mealType'];
  taken_at: string;
}

function fromRow(row: ReadingRow): Reading {
  return {
    id: row.id,
    value: row.value,
    mealType: row.meal_type,
    timestamp: new Date(row.taken_at).getTime(),
  };
}

export async function getReadings(userId: string): Promise<Reading[]> {
  const { data, error } = await supabase
    .from('readings')
    .select('id, value, meal_type, taken_at')
    .eq('user_id', userId)
    .order('taken_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function addReading(userId: string, reading: Omit<Reading, 'id'>): Promise<Reading> {
  const { data, error } = await supabase
    .from('readings')
    .insert({
      user_id: userId,
      value: reading.value,
      meal_type: reading.mealType,
      taken_at: new Date(reading.timestamp).toISOString(),
    })
    .select('id, value, meal_type, taken_at')
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteReading(id: string): Promise<void> {
  const { error } = await supabase.from('readings').delete().eq('id', id);
  if (error) throw error;
}
