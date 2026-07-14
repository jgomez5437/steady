import { useState } from 'react';
import type { TargetRange } from '../types';

interface TargetRangeEditorProps {
  targets: TargetRange;
  onSave: (targets: TargetRange) => void;
}

export function TargetRangeEditor({ targets, onSave }: TargetRangeEditorProps) {
  const [low, setLow] = useState(String(targets.low));
  const [high, setHigh] = useState(String(targets.high));
  const [error, setError] = useState('');

  function handleSave() {
    const lowNum = Number(low);
    const highNum = Number(high);
    if (Number.isNaN(lowNum) || Number.isNaN(highNum) || lowNum >= highNum) {
      setError('Low must be a smaller number than high.');
      return;
    }
    onSave({ low: lowNum, high: highNum });
    setError('');
  }

  return (
    <details className="targets">
      <summary></summary>
      <div className="targets-body">
        <div className="field">
          <label htmlFor="lowInput">Low, mg/dL</label>
          <input type="number" id="lowInput" min={20} max={400} value={low} onChange={(e) => setLow(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="highInput">High, mg/dL</label>
          <input type="number" id="highInput" min={20} max={400} value={high} onChange={(e) => setHigh(e.target.value)} />
        </div>
        <div className="field">
          <button type="button" className="primary" onClick={handleSave}>Save range</button>
        </div>
      </div>
      <p className="note">This is a general reference range, not medical advice. Use the numbers your own care team has given you.</p>
      {error && <p className="error-msg" role="alert">{error}</p>}
    </details>
  );
}
