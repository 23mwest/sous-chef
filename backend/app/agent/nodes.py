from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage

from app.agent.prompts import (
    ALLERGEN_DISCLAIMER,
    HEALTH_CONDITION_KEYWORDS,
    RECIPE_KEYWORDS,
    SYSTEM_PROMPT_TEMPLATE,
)
from app.agent.state import AgentState
from app.agent.tools import web_search
from app.config import settings

ROUTER_SYSTEM_PROMPT = (
    "You are a classifier for a cooking assistant. "
    "Does the user's message reference food, a dish, a drink, an ingredient, cooking, a meal, "
    "or anything edible in any way? Be very inclusive: if someone names any food, drink, or dish "
    "(even casually, e.g. 'I want an omelette', 'pizza', 'something sweet'), that counts. "
    "When in doubt, answer yes. "
    "Reply with only the single word 'yes' or 'no'."
)

OFF_TOPIC_RESPONSE = (
    "That's outside what I can help with. I'm a cooking assistant, so food, "
    "recipes, kitchen gear, and meal planning are my lane. "
    "Can I help you figure out what to cook tonight instead?"
)


def router_node(state: AgentState) -> dict:
    last_user_msg = ""
    for msg in reversed(state["messages"]):
        if hasattr(msg, "type") and msg.type == "human":
            last_user_msg = msg.content
            break

    if not last_user_msg.strip():
        return {"is_food_related": False}

    api_key = state.get("api_token_override") or settings.anthropic_api_key
    llm = ChatAnthropic(
        model=settings.model_name,
        anthropic_api_key=api_key,
        max_tokens=5,
    )
    result = llm.invoke([
        SystemMessage(content=ROUTER_SYSTEM_PROMPT),
        HumanMessage(content=last_user_msg),
    ])
    is_food = result.content.strip().lower().startswith("yes")
    return {"is_food_related": is_food}


def off_topic_node(state: AgentState) -> dict:
    return {"messages": [AIMessage(content=OFF_TOPIC_RESPONSE)]}


def chef_node(state: AgentState) -> dict:
    api_key = state.get("api_token_override") or settings.anthropic_api_key

    llm = ChatAnthropic(
        model=settings.model_name,
        anthropic_api_key=api_key,
        max_tokens=1024,
    ).bind_tools([web_search])

    messages = list(state["messages"])

    if not messages or not isinstance(messages[0], SystemMessage):
        system_msg = SystemMessage(
            content=SYSTEM_PROMPT_TEMPLATE.format(
                pantry_context=state.get("pantry_context")
                or "The user hasn't added anything to their pantry yet.",
                preferences_context=state.get("preferences_context", ""),
            )
        )
        messages = [system_msg] + messages

    response = llm.invoke(messages)

    tool_names = []
    if hasattr(response, "tool_calls") and response.tool_calls:
        tool_names = [tc["name"] for tc in response.tool_calls]

    existing = state.get("tool_calls_made", [])
    return {
        "messages": [response],
        "tool_calls_made": existing + tool_names,
    }


def formatter_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1]
    if not isinstance(last_msg, AIMessage):
        return {}

    content = last_msg.content
    if not isinstance(content, str):
        return {}

    content_lower = content.lower()

    # Inject allergen disclaimer if not already present and content has recipe info
    has_recipe = any(kw in content_lower for kw in RECIPE_KEYWORDS)
    disclaimer_present = ALLERGEN_DISCLAIMER.lower() in content_lower
    if has_recipe and not disclaimer_present:
        content = content + f"\n\n_{ALLERGEN_DISCLAIMER}_"

    # Append health redirect if health conditions mentioned
    has_health = any(kw in content_lower for kw in HEALTH_CONDITION_KEYWORDS)
    if has_health:
        content = (
            content
            + "\n\nFor anything related to managing a health condition through diet, "
            "please consult a registered dietitian or your doctor."
        )

    if content == last_msg.content:
        return {}

    return {"messages": [AIMessage(content=content)]}
