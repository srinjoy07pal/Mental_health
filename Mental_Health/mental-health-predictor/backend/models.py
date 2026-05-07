from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=False)
    
    predictions = relationship("PredictionResult", back_populates="user")
    game_metrics = relationship("GameMetrics", back_populates="user")
    questionnaire_responses = relationship("QuestionnaireResponse", back_populates="user")

class QuestionnaireResponse(Base):
    __tablename__ = "questionnaire_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Store answers as a JSON string for simplicity, or as individual columns
    # Let's use individual columns or average scores per category for the ML model
    q_anxiety_score = Column(Float, default=0.0)
    q_depression_score = Column(Float, default=0.0)
    q_stress_score = Column(Float, default=0.0)
    q_tension_score = Column(Float, default=0.0)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="questionnaire_responses")

class GameMetrics(Base):
    __tablename__ = "game_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    game_type = Column(String) # memory, color, focus
    score = Column(Float)
    reaction_time = Column(Float)
    mistakes = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="game_metrics")

class PredictionResult(Base):
    __tablename__ = "prediction_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    anxiety_prob = Column(Float)
    depression_prob = Column(Float)
    stress_prob = Column(Float)
    tension_prob = Column(Float)
    
    overall_score = Column(Float)
    severity_label = Column(String) # Low, Mild, Moderate, Severe
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="predictions")

class AssessmentHistory(Base):
    __tablename__ = "assessment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    date = Column(DateTime, default=datetime.datetime.utcnow)
    anxiety_score = Column(Float)
    depression_score = Column(Float)
    stress_score = Column(Float)
    tension_score = Column(Float)
    
    overall_score = Column(Float)
    overall_status = Column(String)
    report_json = Column(String) # JSON string to store full report
    
    user = relationship("User", foreign_keys=[user_id])

