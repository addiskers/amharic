import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services import gemini, memory

router = APIRouter()


@router.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat endpoint with SSE streaming."""
    # Create or fetch conversation
    if request.conversation_id:
        conversation_id = request.conversation_id
    else:
        conversation_id = await memory.create_conversation(request.language)

    # Get history for context
    history = await memory.get_history(conversation_id)

    # Save user message
    await memory.add_message(conversation_id, "user", request.message)

    async def event_stream():
        full_response = ""
        try:
            async for chunk in gemini.chat_stream(request.message, history):
                full_response += chunk
                data = json.dumps({"chunk": chunk, "conversation_id": conversation_id})
                yield f"data: {data}\n\n"

            # Save assistant response after streaming completes
            await memory.add_message(conversation_id, "assistant", full_response)

            # Send done event
            done_data = json.dumps({"done": True, "conversation_id": conversation_id})
            yield f"data: {done_data}\n\n"
        except Exception as e:
            error_data = json.dumps({"error": str(e), "conversation_id": conversation_id})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
