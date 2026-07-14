import { useState } from 'react';
import type { Recipe } from '../types';
import { hostnameOf } from '../lib/url';

interface RecipeGridProps {
  recipes: Recipe[];
  onDelete: (id: string) => void;
}

export function RecipeGrid({ recipes, onDelete }: RecipeGridProps) {
  if (!recipes.length) {
    return <p className="sub">No recipes saved yet. Add a link above to start your list.</p>;
  }

  return (
    <div className="recipe-grid">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} onDelete={onDelete} />
      ))}
    </div>
  );
}

function RecipeCard({ recipe, onDelete }: { recipe: Recipe; onDelete: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);

  function handleDeleteClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    onDelete(recipe.id);
  }

  return (
    <div className="recipe-card">
      <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.title}</a>
      <div className="host">{hostnameOf(recipe.url)}</div>
      {recipe.notes && <p>{recipe.notes}</p>}
      <div className="row-actions">
        <button className="delete" type="button" onClick={handleDeleteClick}>
          {confirming ? 'Click again to confirm' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
