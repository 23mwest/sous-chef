import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatPage } from "@/pages/ChatPage";
import { PantryPage } from "@/pages/PantryPage";
import { PreferencesPage } from "@/pages/PreferencesPage";
import { RecipesPage } from "@/pages/RecipesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
