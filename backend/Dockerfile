FROM python:3.11-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml .
RUN uv pip install --system --no-cache -r pyproject.toml 2>/dev/null || \
    uv pip install --system --no-cache \
    fastapi \
    "uvicorn[standard]" \
    langgraph \
    langchain \
    langchain-anthropic \
    langchain-community \
    tavily-python \
    pydantic \
    pydantic-settings \
    python-dotenv \
    duckduckgo-search \
    ddgs

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
