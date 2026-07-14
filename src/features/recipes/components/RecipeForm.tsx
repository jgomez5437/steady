import { useState, type FormEvent } from 'react';
import { isValidUrl } from '../lib/url';

interface RecipeFormProps {
  onSubmit: (title: string, url: string, notes: string) => void;
}

export function RecipeForm({ onSubmit }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    if (!trimmedTitle || !trimmedUrl) {
      setError('A title and a link are both needed.');
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      setError('That link does not look complete. Include https colon slash slash.');
      return;
    }
    onSubmit(trimmedTitle, trimmedUrl, notes.trim());
    setError('');
    setTitle('');
    setUrl('');
    setNotes('');
  }

  return (
    <>
      <form className="recipe-form" onSubmit={handleSubmit}>
        <div className="field grow">
          <label htmlFor="recipeTitle">Title</label>
          <input
            type="text"
            id="recipeTitle"
            required
            placeholder="Sheet pan salmon and greens"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="field grow">
          <label htmlFor="recipeUrl">Link</label>
          <input
            type="url"
            id="recipeUrl"
            required
            placeholder="https://example.com/recipe"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="field grow">
          <label htmlFor="recipeNotes">Notes, optional</label>
          <textarea
            id="recipeNotes"
            placeholder="Swap rice for cauliflower rice"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="field">
          <button type="submit" className="primary">Save recipe</button>
        </div>
      </form>
      <div className="error-msg" role="alert">{error}</div>
    </>
  );
}
