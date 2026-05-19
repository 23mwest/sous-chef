# SousChef

AI-powered cooking assistant. Tell it what you want to cook; it checks your pantry and finds something real.

## Quick start

```bash
cp .env.example .env
# Fill in ANTHROPIC_API_KEY (required). TAVILY_API_KEY is optional — falls back to DuckDuckGo.
docker compose up --build
```

Open http://localhost:5173.

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | — | Anthropic API key |
| `TAVILY_API_KEY` | No | — | Tavily search key; falls back to DuckDuckGo if unset |
| `MODEL_NAME` | No | `claude-3-5-haiku-20241022` | LangChain model name |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | CORS origin(s), comma-separated |

## Local dev (without Docker)

**Backend:**
```bash
cd backend
pip install uv
uv pip install -e .
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API

### `POST /chat`

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What can I make with eggs and cheddar?"}],
    "pantry": {"ingredients": ["eggs", "cheddar", "butter"], "cookware": ["skillet"]}
  }'
```

Response:
```json
{
  "message": "...",
  "used_search": false
}
```

### `GET /health`

```bash
curl http://localhost:8000/health
# {"status": "ok"}
```

## Architecture

```
frontend (React + Vite)  →  POST /chat  →  FastAPI
                                              └─ LangGraph agent
                                                   ├─ router_node   (food vs. off-topic)
                                                   ├─ off_topic_node
                                                   ├─ chef_node     (Claude 3.5 Haiku + tools)
                                                   ├─ tool_node     (web search)
                                                   └─ formatter_node (allergen disclaimer)
```

Conversation history is owned by the client and sent with each request. The backend is stateless. Pantry state lives in localStorage.
