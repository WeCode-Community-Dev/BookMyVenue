from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Dict
from pydantic import BaseModel
import json

from core.database import get_db
from models.user import User
from models.chat import ChatRoom, Message
from api.dependencies import get_current_user

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # room_id -> list of active websockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: int):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: int):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)
            if not self.active_connections[room_id]:
                del self.active_connections[room_id]

    async def broadcast_to_room(self, message: str, room_id: int):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)

manager = ConnectionManager()

class ChatRoomResponse(BaseModel):
    id: int
    customer_id: int
    partner_id: int
    venue_id: int | None
    
    class Config:
        from_attributes = True

class MessageResponse(BaseModel):
    id: int
    room_id: int
    sender_id: int
    content: str
    
    class Config:
        from_attributes = True

@router.post("/rooms", response_model=ChatRoomResponse)
async def create_or_get_room(
    partner_id: int,
    venue_id: int = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if room exists
    stmt = select(ChatRoom).where(
        ChatRoom.customer_id == current_user.id,
        ChatRoom.partner_id == partner_id,
        ChatRoom.venue_id == venue_id
    )
    result = await db.execute(stmt)
    room = result.scalar_one_or_none()
    
    if not room:
        room = ChatRoom(
            customer_id=current_user.id,
            partner_id=partner_id,
            venue_id=venue_id
        )
        db.add(room)
        await db.commit()
        await db.refresh(room)
        
    return room

@router.get("/rooms", response_model=List[ChatRoomResponse])
async def list_my_rooms(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy import or_
    stmt = select(ChatRoom).where(
        or_(
            ChatRoom.customer_id == current_user.id,
            ChatRoom.partner_id == current_user.id
        )
    ).order_by(ChatRoom.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/rooms/{room_id}/messages", response_model=List[MessageResponse])
async def get_room_messages(
    room_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stmt = select(ChatRoom).where(ChatRoom.id == room_id)
    result = await db.execute(stmt)
    room = result.scalar_one_or_none()
    
    if not room or (room.customer_id != current_user.id and room.partner_id != current_user.id):
        raise HTTPException(status_code=403, detail="Forbidden")

    msg_stmt = select(Message).where(Message.room_id == room_id).order_by(Message.created_at.asc())
    msg_result = await db.execute(msg_stmt)
    return msg_result.scalars().all()

@router.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    # Simple auth for ws could be added here, currently relying on path params for simplicity in MVP
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Save to db
            msg = Message(room_id=room_id, sender_id=user_id, content=data)
            db.add(msg)
            await db.commit()
            await db.refresh(msg)
            
            # Broadcast
            payload = {
                "id": msg.id,
                "room_id": msg.room_id,
                "sender_id": msg.sender_id,
                "content": msg.content
            }
            await manager.broadcast_to_room(json.dumps(payload), room_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)
