import type { ChatRequest, ChatResponse } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function postChat(request: ChatRequest): Promise<ChatResponse> {
  // TODO: switch to SSE streaming for better perceived latency
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json() as Promise<ChatResponse>;
}
