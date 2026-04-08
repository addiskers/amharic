import uuid
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

_client: AsyncIOMotorClient | None = None
CONTEXT_WINDOW = 20


def get_db():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client[settings.database_name]


def get_collection():
    return get_db()["conversations"]


async def create_conversation(language: str = "am") -> str:
    """Create a new conversation and return its ID."""
    conversation_id = str(uuid.uuid4())
    doc = {
        "conversation_id": conversation_id,
        "messages": [],
        "language": language,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    await get_collection().insert_one(doc)
    return conversation_id


async def add_message(conversation_id: str, role: str, content: str):
    """Append a message to a conversation."""
    message = {
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow(),
    }
    await get_collection().update_one(
        {"conversation_id": conversation_id},
        {
            "$push": {"messages": message},
            "$set": {"updated_at": datetime.utcnow()},
        },
    )


async def get_history(conversation_id: str) -> list[dict]:
    """Get the last N messages for context window."""
    doc = await get_collection().find_one({"conversation_id": conversation_id})
    if not doc:
        return []
    messages = doc.get("messages", [])
    return messages[-CONTEXT_WINDOW:]


async def list_conversations(limit: int = 20) -> list[dict]:
    """List recent conversations."""
    cursor = get_collection().find(
        {},
        {"conversation_id": 1, "language": 1, "created_at": 1, "updated_at": 1, "messages": {"$slice": 1}},
    ).sort("updated_at", -1).limit(limit)
    conversations = []
    async for doc in cursor:
        first_msg = doc.get("messages", [{}])
        preview = first_msg[0].get("content", "")[:60] if first_msg else ""
        conversations.append({
            "conversation_id": doc["conversation_id"],
            "preview": preview,
            "language": doc.get("language", "sw"),
            "created_at": doc["created_at"].isoformat(),
            "updated_at": doc["updated_at"].isoformat(),
        })
    return conversations


async def delete_conversation(conversation_id: str) -> bool:
    """Delete a conversation by ID."""
    result = await get_collection().delete_one({"conversation_id": conversation_id})
    return result.deleted_count > 0
