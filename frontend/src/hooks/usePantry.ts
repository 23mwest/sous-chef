import { useState } from "react";
import { loadPantry, savePantry } from "@/lib/pantry";
import type { Pantry } from "@/lib/types";

export function usePantry() {
  const [pantry, setPantry] = useState<Pantry>(loadPantry);

  const update = (next: Pantry) => {
    savePantry(next);
    setPantry(next);
  };

  const addIngredient = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed || pantry.ingredients.includes(trimmed)) return;
    update({ ...pantry, ingredients: [...pantry.ingredients, trimmed] });
  };

  const removeIngredient = (item: string) => {
    update({ ...pantry, ingredients: pantry.ingredients.filter((i) => i !== item) });
  };

  const addCookware = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed || pantry.cookware.includes(trimmed)) return;
    update({ ...pantry, cookware: [...pantry.cookware, trimmed] });
  };

  const removeCookware = (item: string) => {
    update({ ...pantry, cookware: pantry.cookware.filter((i) => i !== item) });
  };

  return { pantry, addIngredient, removeIngredient, addCookware, removeCookware };
}
