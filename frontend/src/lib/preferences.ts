import type { Preferences } from "./types";

const PREFERENCES_KEY = "souschef_preferences";

const DEFAULT_PREFERENCES: Preferences = {
  apiToken: "",
  allergies: [],
  principles: "",
};

export function loadPreferences(): Preferences {
  const raw = localStorage.getItem(PREFERENCES_KEY);
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    return { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as Partial<Preferences>) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Preferences): void {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
}
