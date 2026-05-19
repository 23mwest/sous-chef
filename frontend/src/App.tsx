import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChatPage } from "@/pages/ChatPage";
import { PantryPage } from "@/pages/PantryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
