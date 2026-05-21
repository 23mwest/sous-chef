from fastapi import APIRouter, HTTPException
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel

from app.agent.graph import agent
from app.agent.prompts import build_pantry_context, build_preferences_context
from app.agent.state import AgentState
from app.config import settings

router = APIRouter()


class PantryPayload(BaseModel):
    ingredients: list[str] = []
    cookware: list[str] = []


class PreferencesPayload(BaseModel):
    api_token: str = ""
    allergies: list[str] = []
    principles: str = ""


class MessagePayload(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[MessagePayload]
    pantry: PantryPayload
    preferences: PreferencesPayload = PreferencesPayload()


class ChatResponse(BaseModel):
    message: str
    used_search: bool


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    lc_messages = []
    for msg in request.messages:
        if msg.role == "user":
            lc_messages.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            lc_messages.append(AIMessage(content=msg.content))

    pantry_context = build_pantry_context(
        request.pantry.ingredients,
        request.pantry.cookware,
    )

    preferences_context = build_preferences_context(
        request.preferences.allergies,
        request.preferences.principles,
    )

    initial_state: AgentState = {
        "messages": lc_messages,
        "pantry_context": pantry_context,
        "preferences_context": preferences_context,
        "api_token_override": request.preferences.api_token.strip(),
        "is_food_related": False,
        "tool_calls_made": [],
    }

    api_key = request.preferences.api_token.strip() or settings.anthropic_api_key
    if not api_key:
        raise HTTPException(status_code=400, detail="Add a Claude API key in Preferences")

    try:
        result = await agent.ainvoke(initial_state, config={"recursion_limit": 10})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    last_ai = None
    for msg in reversed(result["messages"]):
        if isinstance(msg, AIMessage) and not getattr(msg, "tool_calls", None):
            last_ai = msg
            break

    if last_ai is None:
        raise HTTPException(status_code=500, detail="Agent produced no response")

    content = last_ai.content
    if not isinstance(content, str):
        content = str(content)

    return ChatResponse(
        message=content,
        used_search=bool(result.get("tool_calls_made")),
    )
