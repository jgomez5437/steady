import { useEffect, useRef } from 'react';

/**
 * Re-runs `refetch` whenever the tab/app regains visibility (e.g. reopened from
 * a home-screen shortcut or switched back to after being backgrounded). Guards
 * against a stale initial load silently showing incomplete data until the next
 * manual reload.
 */
export function useRefetchOnVisible(refetch: () => void): void {
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        refetchRef.current();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
}
