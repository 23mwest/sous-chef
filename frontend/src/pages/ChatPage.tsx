import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  UtensilsCrossed,
  Globe,
  Menu,
  Settings,
  BookOpen,
} from "lucide-react";
import { postChat } from "@/lib/api";
import { usePantry } from "@/hooks/usePantry";
import { usePreferences } from "@/hooks/usePreferences";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";

const WELCOME: Message = {
  role: "assistant",
  content:
    "What are we cooking? Tell me what you're in the mood for, or I can work from your pantry.",
};

export function ChatPage() {
  const { pantry } = usePantry();
  const { preferences } = usePreferences();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUsedSearch, setLastUsedSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    const userMsg: Message = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    setError("");
    setLastUsedSearch(false);

    if (!preferences.apiToken.trim()) {
      setError("Add a Claude API key in Preferences");
      setLoading(false);
      return;
    }

    try {
      const res = await postChat({
        messages: next.filter((m) => m.role !== "assistant" || m !== WELCOME),
        pantry,
        preferences,
      });
      setMessages([...next, { role: "assistant", content: res.message }]);
      setLastUsedSearch(res.used_search);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3 bg-background">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">SousChef</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-background border rounded-lg shadow-lg py-1 min-w-[140px] z-10">
              <Link
                to="/pantry"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Pantry
              </Link>
              <Link
                to="/recipes"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Recipes
              </Link>
              <Link
                to="/preferences"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4" />
                Preferences
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-muted-foreground">
                <span className="animate-pulse">thinking...</span>
              </div>
            </div>
          )}
          {lastUsedSearch && !loading && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
              <Globe className="h-3 w-3" />
              Searched the web
            </div>
          )}
          {error && <p className="text-xs text-destructive px-1">{error}</p>}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  );
}
