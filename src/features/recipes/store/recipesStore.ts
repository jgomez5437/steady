import { supabase } from '../../../shared/api/supabaseClient';
import type { Recipe } from '../types';

interface RecipeRow {
  id: string;
  title: string;
  url: string;
  notes: string | null;
  created_at: string;
}

function fromRow(row: RecipeRow): Recipe {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    notes: row.notes ?? '',
    addedAt: new Date(row.created_at).getTime(),
  };
}

export async function getRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('id, title, url, notes, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function addRecipe(userId: string, recipe: Omit<Recipe, 'id' | 'addedAt'>): Promise<Recipe> {
  const { data, error } = await supabase
    .from('recipes')
    .insert({ user_id: userId, title: recipe.title, url: recipe.url, notes: recipe.notes })
    .select('id, title, url, notes, created_at')
    .single();

  if (error) throw error;
  return fromRow(data);
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('recipes').delete().eq('id', id);
  if (error) throw error;
}
