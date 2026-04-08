from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    language: str = "am"


class ChatResponse(BaseModel):
    message: str
    conversation_id: str
