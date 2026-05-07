from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Questionnaire Schemas
class QuestionnaireCreate(BaseModel):
    q_anxiety_score: float
    q_depression_score: float
    q_stress_score: float
    q_tension_score: float

class QuestionnaireResponseModel(QuestionnaireCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Game Metrics Schemas
class GameMetricsCreate(BaseModel):
    game_type: str
    score: float
    reaction_time: float
    mistakes: int

class GameMetricsResponseModel(GameMetricsCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Prediction Result Schemas
class PredictionResultResponse(BaseModel):
    id: int
    user_id: int
    anxiety_prob: float
    depression_prob: float
    stress_prob: float
    tension_prob: float
    overall_score: float
    severity_label: str
    created_at: datetime

    class Config:
        from_attributes = True

# Assessment History Schemas
class AssessmentHistoryResponse(BaseModel):
    id: int
    user_id: int
    date: datetime
    anxiety_score: float
    depression_score: float
    stress_score: float
    tension_score: float
    overall_score: float
    overall_status: str
    report_json: str

    class Config:
        from_attributes = True
