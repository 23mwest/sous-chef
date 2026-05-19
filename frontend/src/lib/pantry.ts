import type { Pantry } from "./types";

const PANTRY_KEY = "souschef_pantry";

const DEFAULT_PANTRY: Pantry = { ingredients: [], cookware: [] };

export function loadPantry(): Pantry {
  const raw = localStorage.getItem(PANTRY_KEY);
  if (!raw) return DEFAULT_PANTRY;
  try {
    return JSON.parse(raw) as Pantry;
  } catch {
    return DEFAULT_PANTRY;
  }
}

export function savePantry(pantry: Pantry): void {
  localStorage.setItem(PANTRY_KEY, JSON.stringify(pantry));
}
