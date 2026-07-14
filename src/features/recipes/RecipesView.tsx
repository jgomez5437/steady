import { useEffect, useState } from 'react';
import { RecipeForm } from './components/RecipeForm';
import { RecipeGrid } from './components/RecipeGrid';
import { getRecipes, addRecipe, deleteRecipe } from './store/recipesStore';
import type { Recipe } from './types';
import { useAuth } from '../auth/AuthProvider';

export function RecipesView() {
  const { session } = useAuth();
  const userId = session!.user.id;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecipes(userId)
      .then((r) => {
        if (!cancelled) {
          setRecipes(r);
          setError('');
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load your recipes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleAdd(title: string, url: string, notes: string) {
    try {
      const created = await addRecipe(userId, { title, url, notes });
      setRecipes((prev) => [created, ...prev]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save that recipe.');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete that recipe.');
    }
  }

  const sorted = [...recipes].sort((a, b) => b.addedAt - a.addedAt);

  if (loading) {
    return (
      <div className="card">
        <p className="sub">Loading your recipes...</p>
      </div>
    );
  }

  return (
    <>
      {error && <div className="banner" role="status">{error}</div>}

      <div className="card">
        <h2>Save a recipe</h2>
        <p className="sub">Keep a running list of meals you like coming back to.</p>
        <RecipeForm onSubmit={handleAdd} />
      </div>

      <div className="card">
        <h2>Saved recipes</h2>
        <RecipeGrid recipes={sorted} onDelete={handleDelete} />
      </div>
    </>
  );
}
