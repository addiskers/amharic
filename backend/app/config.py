from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache

ENV_FILE = Path(__file__).resolve().parent.parent.parent / ".env"


class Settings(BaseSettings):
    vertex_api_key: str = ""
    vertex_project: str = ""
    vertex_location: str = "us-central1"
    mongodb_uri: str = "mongodb://localhost:27017"
    model_name: str = "gemini-2.5-flash"
    app_name: str = "Zungumza"
    database_name: str = "swahili_chatbot"
    auth_username: str = "admin"
    auth_password: str = "tenagari2024"

    model_config = {"env_file": str(ENV_FILE), "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
