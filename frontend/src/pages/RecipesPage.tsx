import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";
import type { SavedRecipe } from "@/lib/types";
import { loadRecipes, deleteRecipe } from "@/lib/recipes";

export function RecipesPage() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setRecipes(loadRecipes());
  }, []);

  function handleDelete(id: string) {
    deleteRecipe(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

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
        <h1 className="font-semibold text-sm">Recipes</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {recipes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No saved recipes yet. Ask SousChef for a recipe and hit Save.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recipes.map((recipe) => {
              const isOpen = expandedId === recipe.id;
              return (
                <div key={recipe.id} className="border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleExpand(recipe.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted transition-colors text-left"
                  >
                    <span>{recipe.name}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 text-sm border-t">
                      {renderMarkdown(recipe.content)}
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove recipe
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
