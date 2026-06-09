from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
import crud
import models
import database
import auth
from ml.predict import make_prediction
from typing import List

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

import json

@router.post("/generate", response_model=schemas.AssessmentHistoryResponse)
def generate_prediction(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Fetch latest questionnaire and game metrics for the user
    latest_q = db.query(models.QuestionnaireResponse).filter(
        models.QuestionnaireResponse.user_id == current_user.id
    ).order_by(models.QuestionnaireResponse.created_at.desc()).first()
    
    games = db.query(models.GameMetrics).filter(
        models.GameMetrics.user_id == current_user.id
    ).order_by(models.GameMetrics.created_at.desc()).limit(3).all()
    
    if not latest_q:
        raise HTTPException(status_code=400, detail="Please complete the questionnaire first.")
    
    features = {
        'q_anxiety': latest_q.q_anxiety_score,
        'q_depression': latest_q.q_depression_score,
        'q_stress': latest_q.q_stress_score,
        'q_tension': latest_q.q_tension_score
    }
    
    for game in games:
        if game.game_type == 'memory':
            features['game_score_memory'] = game.score
            features['game_rt_memory'] = game.reaction_time
        elif game.game_type == 'color':
            features['game_score_color'] = game.score
            features['game_rt_color'] = game.reaction_time
        elif game.game_type == 'focus':
            features['game_score_focus'] = game.score
            features['game_rt_focus'] = game.reaction_time
            
    try:
        pred_result = make_prediction(features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    # Save to original predictions (backward compatibility)
    crud.create_prediction(db=db, pred_data=pred_result, user_id=current_user.id)
    
    # Detailed mapping and report generation
    def get_severity(score):
        if score < 0.26: return "Low"
        if score < 0.51: return "Mild"
        if score < 0.76: return "Moderate"
        return "Severe"

    report_json = {
        "anxiety": {
            "score": pred_result["anxiety_prob"],
            "severity": get_severity(pred_result["anxiety_prob"]),
            "description": f"User shows {get_severity(pred_result['anxiety_prob']).lower()} anxiety symptoms and may benefit from relaxation and stress management techniques." if pred_result["anxiety_prob"] > 0.5 else "Anxiety levels are within a normal range."
        },
        "depression": {
            "score": pred_result["depression_prob"],
            "severity": get_severity(pred_result["depression_prob"]),
            "description": f"User shows {get_severity(pred_result['depression_prob']).lower()} depressive indicators and should consider professional support if symptoms persist." if pred_result["depression_prob"] > 0.5 else "Depression indicators are low."
        },
        "stress": {
            "score": pred_result["stress_prob"],
            "severity": get_severity(pred_result["stress_prob"]),
            "description": f"User is experiencing {get_severity(pred_result['stress_prob']).lower()} stress."
        },
        "tension": {
            "score": pred_result["tension_prob"],
            "severity": get_severity(pred_result["tension_prob"]),
            "description": f"User is experiencing {get_severity(pred_result['tension_prob']).lower()} tension."
        }
    }

    history_data = {
        "anxiety_score": pred_result["anxiety_prob"],
        "depression_score": pred_result["depression_prob"],
        "stress_score": pred_result["stress_prob"],
        "tension_score": pred_result["tension_prob"],
        "overall_score": pred_result["overall_score"],
        "overall_status": pred_result["severity_label"],
        "report_json": json.dumps(report_json)
    }

    return crud.create_assessment_history(db=db, history_data=history_data, user_id=current_user.id)

@router.get("/", response_model=List[schemas.PredictionResultResponse])
def get_predictions(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_predictions(db=db, user_id=current_user.id)

@router.get("/history", response_model=List[schemas.AssessmentHistoryResponse])
def get_assessment_history(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.get_user_assessment_history(db=db, user_id=current_user.id)

@router.post("/reset")
def reset_session(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.reset_user_session(db=db, user_id=current_user.id)
