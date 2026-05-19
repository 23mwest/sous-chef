import os

from langchain_core.tools import tool

from app.config import settings


def _get_search_tool():
    if settings.tavily_api_key:
        from langchain_community.tools.tavily_search import TavilySearchResults
        return TavilySearchResults(max_results=3, tavily_api_key=settings.tavily_api_key)

    # TODO: fallback to DuckDuckGoSearchRun if no TAVILY_API_KEY
    from langchain_community.tools import DuckDuckGoSearchRun
    return DuckDuckGoSearchRun()


web_search = _get_search_tool()
