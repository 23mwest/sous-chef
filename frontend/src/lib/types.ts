export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Pantry {
  ingredients: string[];
  cookware: string[];
}

export interface ChatRequest {
  messages: Message[];
  pantry: Pantry;
}

export interface ChatResponse {
  message: string;
  used_search: boolean;
}
