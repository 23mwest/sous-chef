export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Pantry {
  ingredients: string[];
  cookware: string[];
}

export interface Preferences {
  apiToken: string;
  allergies: string[];
  principles: string;
}

export interface ChatRequest {
  messages: Message[];
  pantry: Pantry;
  preferences: Preferences;
}

export interface ChatResponse {
  message: string;
  used_search: boolean;
}
