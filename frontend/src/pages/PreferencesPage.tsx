import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { PantryList } from "@/components/PantryList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BIG_9_ALLERGENS = [
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Tree Nuts",
  "Peanuts",
  "Wheat",
  "Soybeans",
  "Sesame",
];

const UNCOMMON_ALLERGENS = [
  "Apples",
  "Avocados",
  "Bananas",
  "Beets",
  "Broccoli",
  "Carrots",
  "Cinnamon",
  "Citrus Fruits",
  "Cocoa Beans",
  "Coconut",
  "Coffee",
  "Corn",
  "Cucumbers",
  "Flaxseed",
  "Garlic",
  "Gelatin",
  "Grapes",
  "Honey",
  "Kiwi",
  "Lamb",
  "Legumes",
  "Lettuce",
  "Malt",
  "Mango",
  "Melons",
  "Mint",
  "Mushrooms",
  "Nightshades",
  "Nitrates/Nitrites",
  "Pork",
  "Pineapple",
  "Pumpkin",
  "Red Meat",
  "Rice",
  "Strawberries",
  "Sugar",
  "Sunflower",
  "Turkey",
  "Vanilla",
  "Xanthan Gum",
];

export function PreferencesPage() {
  const { preferences, setApiToken, addAllergy, removeAllergy, setPrinciples } =
    usePreferences();
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="flex items-center gap-3 border-b px-4 py-3 bg-background">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to chat"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-semibold text-sm">Preferences</h1>
      </header>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Claude API Token
            </h3>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                value={preferences.apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="sk-ant-..."
                autoComplete="off"
                spellCheck={false}
                className="pr-9 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowToken((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stored in your browser only.
            </p>
          </div>

          <PantryList
            title="Allergies"
            items={preferences.allergies}
            onAdd={addAllergy}
            onRemove={removeAllergy}
            placeholder="apples, sesame, gelatin..."
            quickAdds={BIG_9_ALLERGENS}
            suggestions={UNCOMMON_ALLERGENS}
            emptyText="No allergies added."
          />

          <div className="flex flex-col gap-3">
            <Label
              htmlFor="principles"
              className="font-semibold text-sm text-muted-foreground uppercase tracking-wide"
            >
              Guiding Principles
            </Label>
            <textarea
              id="principles"
              value={preferences.principles}
              onChange={(e) => setPrinciples(e.target.value)}
              placeholder={
                "Cooking for 4 (two kids who hate spice, one vegetarian).\nWe prefer one-pot meals on weeknights.\nTrying to eat less red meat."
              }
              rows={6}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            />
            <p className="text-xs text-muted-foreground">
              Anything else the chef should keep in mind. Recipes will reflect
              these, but not strictly, and the chef will call out anything not
              satisfied.
            </p>
          </div>
        </div>
      </ScrollArea>

      <footer className="border-t px-4 py-3 text-xs text-muted-foreground text-center">
        Changes save automatically to this browser.
      </footer>
    </div>
  );
}
