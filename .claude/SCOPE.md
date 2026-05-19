# SCOPE.md — Sous Chef v1

---

## Tech Stack

| Layer                 | Choice                                     |
| --------------------- | ------------------------------------------ |
| Backend               | Python, FastAPI                            |
| Agent / Orchestration | LangGraph                                  |
| LLM calls             | LangChain                                  |
| Frontend              | React + Vite                               |
| Language              | TypeScript (strict)                        |
| Styling               | Tailwind CSS                               |
| Components            | shadcn-ui                                  |
| Containerization      | Docker (backend + frontend, clone-and-run) |

---

## Project Requirements

### Chat Screen

- Single-page, mobile-optimized chat interface; the primary surface
- Food-only bot — responds to cooking and food-adjacent questions only; politely declines anything off-topic and always suggests a food-related alternative when it can't directly answer
- Food-adjacent topics are in scope: wine pairings, kitchen gear, dinner party planning, ingredient sourcing
- Non-food topics (technology, politics, etc.) get a polite or cheeky response, not a cold refusal
- Pantry-aware recommendations — bot checks the user's pantry before suggesting recipes; if something requires gear or ingredients the user doesn't have, it says so and offers a workaround or alternate recipe
- Allergen awareness - bot checks any saved allergies and does not recommend recipes containing those ingredients
- Response time target — 2s average with tight standard deviation; complex queries may run longer but the mean stays at or below 2s
- No medical advice — bot accommodates stated dietary preferences (vegetarian, gluten-free) but will not adapt to or advise on medical conditions; redirects those to a qualified professional
- No food safety judgments — bot will not say whether specific food is safe to eat; defers to food safety authorities (legal requirement)

### Pantry Screen

- Secondary screen where users manage their cookware and ingredients
- Cookware and ingredients are two distinct, editable lists
- No assumed baseline kit — users add what they actually own
- Pantry data is used by the bot to filter and qualify recipe recommendations

### Settings / Preferences Screen

- Users can set and update dietary preferences (e.g. vegetarian, gluten-free)
- Preferences are used by the bot to personalize responses
- Explicit health condition mentions are not stored — only stated dietary preferences

### Personality Guardrails (applies to all bot responses)

- No hedging, no filler compliments, no em dashes, no AI-speak
- Never ever be snarky or rude; always helpful, warm, and encouraging, even when declining to answer off-topic questions or answering obvious or dumb sounding questions
- Responses should read like a knowledgeable friend who cooks, not a product

---

## Out of Scope (v1)

| Cut                              | Reason                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------- |
| Auth / user accounts             | Not required; single-user session model only                                                |
| Cross-session memory persistence | No auth means no user identity to key off; preferences live in the session or local storage |
| Saved / favorited recipes        | v2                                                                                          |
| Grocery list export              | v2                                                                                          |
| Voice / hands-free mode          | v2; architecture won't block it                                                             |
| PDF / cookbook ingestion         | Edge case, not worth the surface area in v1                                                 |
| Model cost routing               | v2 optimization; single capable model for all queries                                       |

---

## Architecture Assumptions

- No auth; no login, signup, or session management
- Pantry profile and dietary preferences stored client-side (local storage) and sent with each request
- Conversation history maintained client-side per session and included in each API request
- A single LLM model handles all queries; routing is a v2 concern
- Web search is the external tool of record; the model decides when to invoke it
- Backend and frontend each run in their own Docker containers; a `docker compose up` from the repo root starts the full stack

---

## Risks Accepted

- **Personality at scale is hard to maintain** — the system prompt defines the voice but LLM outputs vary; edge cases will need prompt tuning post-launch
- **2s average is achievable but not guaranteed** — depends on model, tool invocation frequency, and infrastructure; may need streaming or caching adjustments
- **Allergen disclaimer may frustrate users** — legal says non-negotiable; accepting the UX friction
- **No persistence without auth** — preferences and pantry reset if local storage is cleared; accepted tradeoff for keeping v1 simple
