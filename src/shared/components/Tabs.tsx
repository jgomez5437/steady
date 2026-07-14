export type TabKey = 'track' | 'recipes' | 'reports';

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

export function Tabs({ active, onChange }: TabsProps) {
  return (
    <nav className="tabs" role="tablist" aria-label="Sections">
      <button
        type="button"
        role="tab"
        aria-selected={active === 'track'}
        aria-controls="view-track"
        onClick={() => onChange('track')}
      >
        Track
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'recipes'}
        aria-controls="view-recipes"
        onClick={() => onChange('recipes')}
      >
        Recipes
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === 'reports'}
        aria-controls="view-reports"
        onClick={() => onChange('reports')}
      >
        Reports
      </button>
    </nav>
  );
}
