import { useState, type FormEvent } from 'react';
import type { MealType } from '../types';
import { defaultMealTypeFor } from '../lib/mealType';

interface ReadingFormProps {
  onSubmit: (value: number, mealType: MealType) => void;
}

export function ReadingForm({ onSubmit }: ReadingFormProps) {
  const [value, setValue] = useState('');
  const [mealType, setMealType] = useState<MealType>(() => defaultMealTypeFor(new Date()));
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numeric = Number(value);
    if (!value || Number.isNaN(numeric) || numeric < 20 || numeric > 600) {
      setError('Enter a number between 20 and 600.');
      return;
    }
    onSubmit(numeric, mealType);
    setError('');
    setValue('');
    setMealType(defaultMealTypeFor(new Date()));
  }

  return (
    <>
      <form className="reading-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="valueInput">Reading, mg/dL</label>
          <input
            type="number"
            id="valueInput"
            min={20}
            max={600}
            step={1}
            required
            placeholder="110"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="field grow">
          <label htmlFor="mealSelect">When</label>
          <select id="mealSelect" required value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
            <option value="fasting">Fasting</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <div className="field">
          <button type="submit" className="primary">Log reading</button>
        </div>
      </form>
      <div className="error-msg" role="alert">{error}</div>
    </>
  );
}
