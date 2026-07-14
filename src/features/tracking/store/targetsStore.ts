import { supabase } from '../../../shared/api/supabaseClient';
import type { TargetRange } from '../types';

const DEFAULT_TARGETS: TargetRange = { low: 70, high: 140 };

export async function getTargets(userId: string): Promise<TargetRange> {
  const { data, error } = await supabase
    .from('targets')
    .select('low, high')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? { low: data.low, high: data.high } : DEFAULT_TARGETS;
}

export async function saveTargets(userId: string, targets: TargetRange): Promise<void> {
  const { error } = await supabase
    .from('targets')
    .upsert({ user_id: userId, low: targets.low, high: targets.high, updated_at: new Date().toISOString() });

  if (error) throw error;
}
