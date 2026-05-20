import type { SavedRecipe } from "./types";

const RECIPES_KEY = "souschef_recipes";

export function loadRecipes(): SavedRecipe[] {
  const raw = localStorage.getItem(RECIPES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as SavedRecipe[];
  } catch {
    return [];
  }
}

export function saveRecipe(recipe: SavedRecipe): void {
  const recipes = loadRecipes();
  const idx = recipes.findIndex((r) => r.id === recipe.id);
  if (idx >= 0) {
    recipes[idx] = recipe;
  } else {
    recipes.push(recipe);
  }
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export function deleteRecipe(id: string): void {
  const recipes = loadRecipes().filter((r) => r.id !== id);
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export function extractRecipeName(content: string): string | null {
  const match = content.match(/\*\*Name:\*\*\s*(.+)/);
  return match ? match[1].trim() : null;
}

export function isRecipeMessage(content: string): boolean {
  return /\*\*Name:\*\*/.test(content) && /\*\*Ingredients:\*\*/.test(content);
}
