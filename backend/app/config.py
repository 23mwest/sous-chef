from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str
    tavily_api_key: str = ""
    model_name: str = "claude-haiku-4-5-20251001"
    allowed_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
