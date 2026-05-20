from typing import Annotated, TypedDict

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    pantry_context: str
    preferences_context: str
    api_token_override: str
    is_food_related: bool
    tool_calls_made: list[str]
