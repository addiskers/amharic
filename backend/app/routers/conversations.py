from fastapi import APIRouter, HTTPException
from app.services import memory

router = APIRouter()


@router.get("/api/conversations")
async def list_conversations():
    """List recent conversations."""
    conversations = await memory.list_conversations()
    return {"conversations": conversations}


@router.get("/api/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get full conversation history."""
    history = await memory.get_history(conversation_id)
    if not history:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"conversation_id": conversation_id, "messages": history}


@router.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a conversation."""
    deleted = await memory.delete_conversation(conversation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"deleted": True}
