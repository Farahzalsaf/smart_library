import json
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from services import langgraph
from common.database.database import get_db
from schemas.user import UserSchema, TokenSchema, UserActivitySchema
from middleware.auth import create_access_token, get_current_user, admin_required
from common.CRUD.user_crud import get_user_by_username, create_user, authenticate_user, update_like_preference
from middleware.logger import log_user_activity
from common.database.models import UserActivity
router = APIRouter()


# class ChatRequest(BaseModel):
#     session_id: str
#     query: str

# class ChatResponse(BaseModel):
#     response: str

class LikeUpdateRequest(BaseModel):
    username: str
    item_id: int
    liked: bool

# @router.post("/chat", response_model=ChatResponse)
# async def chat(request: ChatRequest):
#     response = langgraph.handle_query(request.session_id, request.query)
#     return ChatResponse(response=response)

    
@router.post("/users/register", response_model=UserSchema, tags=["Users"])
def register_user(user: UserSchema, db: Session = Depends(get_db)):
    try:
        new_user = create_user(db, user)
        log_user_activity(db, user.username, "User registration")
        return UserSchema(username=new_user.username, password="", role=new_user.role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/login", response_model=TokenSchema, tags=["Users"])
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    log_user_activity(db, user.username, "User login")
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserSchema, tags=["Users"])
def read_users_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = get_user_by_username(db, current_user['username'])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    log_user_activity(db, current_user['username'], "User profile view")
    return UserSchema(username=user.username, password="", role=user.role)

@router.post("/likes/update", tags=["Likes"])
async def update_like_status(request: LikeUpdateRequest, db: Session = Depends(get_db)):
    try:
        result = update_like_preference(db, request.username, request.item_id, request.liked)
        if result:
            return {"status": "success", "message": "Like status updated"}
        else:
            raise HTTPException(status_code=404, detail="Update failed, item not found or no change needed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/admin/activities", response_model=List[UserActivitySchema], tags=["Admin"])
def get_user_activities(db: Session = Depends(get_db), current_user: dict = Depends(admin_required)):
    activities = db.query(UserActivity).all()
    return activities
