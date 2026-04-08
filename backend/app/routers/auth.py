from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import get_settings

router = APIRouter()
settings = get_settings()


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/api/auth/login")
async def login(request: LoginRequest):
    if request.username == settings.auth_username and request.password == settings.auth_password:
        return {"success": True, "user": request.username}
    raise HTTPException(status_code=401, detail="Invalid credentials")
