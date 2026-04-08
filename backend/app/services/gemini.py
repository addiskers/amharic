from google import genai
from google.genai import types
from app.config import get_settings
from app.prompts.swahili_system import SYSTEM_PROMPT

settings = get_settings()

client = genai.Client(api_key=settings.vertex_api_key)


def _build_contents(history: list[dict], message: str) -> list[types.Content]:
    """Convert conversation history + new message into Gemini multi-turn format."""
    contents = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg["content"])]))
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))
    return contents


async def chat(message: str, history: list[dict]) -> str:
    """Send a message to Gemini and return the full response."""
    contents = _build_contents(history, message)
    response = await client.aio.models.generate_content(
        model=settings.model_name,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
            max_output_tokens=2048,
        ),
    )
    return response.text


async def chat_stream(message: str, history: list[dict]):
    """Stream response chunks from Gemini as an async generator."""
    contents = _build_contents(history, message)
    stream = await client.aio.models.generate_content_stream(
        model=settings.model_name,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
            max_output_tokens=2048,
        ),
    )
    async for chunk in stream:
        if chunk.text:
            yield chunk.text
