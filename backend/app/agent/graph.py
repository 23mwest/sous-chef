from langchain_core.messages import AIMessage
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode

from app.agent.nodes import chef_node, formatter_node, off_topic_node, router_node
from app.agent.state import AgentState
from app.agent.tools import web_search


def _route_after_router(state: AgentState) -> str:
    return "chef" if state.get("is_food_related", False) else "off_topic"


def _route_after_chef(state: AgentState) -> str:
    last_msg = state["messages"][-1]
    if isinstance(last_msg, AIMessage) and getattr(last_msg, "tool_calls", None):
        return "tools"
    return "formatter"


graph_builder = StateGraph(AgentState)

graph_builder.add_node("router", router_node)
graph_builder.add_node("off_topic", off_topic_node)
graph_builder.add_node("chef", chef_node)
graph_builder.add_node("tools", ToolNode([web_search]))
graph_builder.add_node("formatter", formatter_node)

graph_builder.add_edge(START, "router")
graph_builder.add_conditional_edges("router", _route_after_router, {"chef": "chef", "off_topic": "off_topic"})
graph_builder.add_conditional_edges("chef", _route_after_chef, {"tools": "tools", "formatter": "formatter"})
graph_builder.add_edge("tools", "chef")
graph_builder.add_edge("off_topic", END)
graph_builder.add_edge("formatter", END)

agent = graph_builder.compile()
