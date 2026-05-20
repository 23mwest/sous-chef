import { useState } from "react";
import { loadPreferences, savePreferences } from "@/lib/preferences";
import type { Preferences } from "@/lib/types";

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  const update = (next: Preferences) => {
    savePreferences(next);
    setPreferences(next);
  };

  const setApiToken = (apiToken: string) => {
    update({ ...preferences, apiToken });
  };

  const addAllergy = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    const exists = preferences.allergies.some(
      (a) => a.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) return;
    update({ ...preferences, allergies: [...preferences.allergies, trimmed] });
  };

  const removeAllergy = (item: string) => {
    update({
      ...preferences,
      allergies: preferences.allergies.filter((a) => a !== item),
    });
  };

  const setPrinciples = (principles: string) => {
    update({ ...preferences, principles });
  };

  return {
    preferences,
    setApiToken,
    addAllergy,
    removeAllergy,
    setPrinciples,
  };
}
