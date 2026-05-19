import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  title: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
  suggestions?: string[];
}

export function PantryList({ title, items, onAdd, onRemove, placeholder, suggestions = [] }: Props) {
  const [draft, setDraft] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = draft.length > 0
    ? suggestions
        .filter(s => s.toLowerCase().includes(draft.toLowerCase()) && !items.includes(s))
        .slice(0, 6)
    : [];

  const quickSuggestions = suggestions.filter(s => !items.includes(s)).slice(0, 6);

  const addItem = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
    setShowDropdown(false);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>

      <div ref={containerRef} className="relative">
        <Input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem(draft);
            if (e.key === "Escape") setShowDropdown(false);
          }}
          placeholder={placeholder ?? `Add ${title.toLowerCase()}...`}
          className="w-full"
        />

        {showDropdown && filteredSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-background border rounded-lg shadow-lg z-10 overflow-hidden">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addItem(s);
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {quickSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {quickSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => addItem(s)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground hover:bg-muted/80 transition-colors border border-border"
            >
              <Plus className="h-3 w-3" />
              {s}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Nothing added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="hover:opacity-70 transition-opacity"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
