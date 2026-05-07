from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas
import datetime

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_questionnaire(db: Session, q_data: schemas.QuestionnaireCreate, user_id: int):
    db_q = models.QuestionnaireResponse(**q_data.model_dump(), user_id=user_id)
    db.add(db_q)
    db.commit()
    db.refresh(db_q)
    return db_q

def create_game_metrics(db: Session, game_data: schemas.GameMetricsCreate, user_id: int):
    db_game = models.GameMetrics(**game_data.model_dump(), user_id=user_id)
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

def create_prediction(db: Session, pred_data: dict, user_id: int):
    db_pred = models.PredictionResult(**pred_data, user_id=user_id)
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred

def get_user_predictions(db: Session, user_id: int):
    return db.query(models.PredictionResult).filter(models.PredictionResult.user_id == user_id).all()

def create_assessment_history(db: Session, history_data: dict, user_id: int):
    db_history = models.AssessmentHistory(**history_data, user_id=user_id)
    db.add(db_history)
    db.commit()
    db.refresh(db_history)
    return db_history

def get_user_assessment_history(db: Session, user_id: int):
    return db.query(models.AssessmentHistory).filter(models.AssessmentHistory.user_id == user_id).order_by(models.AssessmentHistory.date.desc()).all()

def reset_user_session(db: Session, user_id: int):
    # To reset the session, we could either delete recent unsaved questionnaire/games or mark them.
    # The prompt says "Reset Responses functionality: Requirements: Clear previous answers, Reset game scores, Reset temporary session data".
    # Since these are currently saved in db for history, we might just delete them or allow generating new ones.
    # Deleting them so a fresh start is enforced:
    db.query(models.QuestionnaireResponse).filter(models.QuestionnaireResponse.user_id == user_id).delete()
    db.query(models.GameMetrics).filter(models.GameMetrics.user_id == user_id).delete()
    db.commit()
    return {"message": "Session reset successful"}
