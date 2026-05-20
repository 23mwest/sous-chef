import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function PreferencesPage() {
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

      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Preferences coming soon.
      </div>
    </div>
  );
}
