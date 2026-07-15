import { parseStoredPatientProfile, type SavedPatientProfile } from './reportData';

function keyFor(userId: string): string {
  return `steady_patient_profile_${userId}`;
}

export function loadPatientProfile(userId: string): SavedPatientProfile | null {
  try {
    const raw = window.localStorage.getItem(keyFor(userId));
    return raw ? parseStoredPatientProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function savePatientProfile(userId: string, profile: SavedPatientProfile): void {
  try {
    window.localStorage.setItem(keyFor(userId), JSON.stringify(profile));
  } catch {
    // Best-effort convenience only — never block the report flow on this.
  }
}

export function clearPatientProfile(userId: string): void {
  try {
    window.localStorage.removeItem(keyFor(userId));
  } catch {
    // Nothing to clean up if storage isn't reachable.
  }
}
