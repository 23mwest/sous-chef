import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";
import type { Message } from "@/lib/types";
import { isRecipeMessage, extractRecipeName, saveRecipe } from "@/lib/recipes";

interface Props {
  message: Message;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";
  const showSave = !isUser && isRecipeMessage(message.content);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const name = extractRecipeName(message.content) ?? "Untitled Recipe";
    saveRecipe({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      content: message.content,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
  }

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div className="relative max-w-[80%]">
        {showSave && (
          <button
            onClick={handleSave}
            disabled={saved}
            title={saved ? "Saved to Recipes" : "Save Recipe"}
            className={cn(
              "absolute -top-2 -right-2 z-10 rounded-full p-1 border bg-background shadow-sm transition-colors",
              saved
                ? "text-primary border-primary/30 cursor-default"
                : "text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            {saved ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </button>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-sm whitespace-pre-wrap"
              : "bg-muted text-foreground rounded-bl-sm"
          )}
        >
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>
      </div>
    </div>
  );
}
