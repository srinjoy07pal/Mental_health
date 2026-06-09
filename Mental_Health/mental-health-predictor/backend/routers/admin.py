from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas
import models
import database
import auth
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

def get_admin_user(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(
    db: Session = Depends(database.get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    return db.query(models.User).all()

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.get("/analytics")
def get_analytics(
    db: Session = Depends(database.get_db),
    admin_user: models.User = Depends(get_admin_user)
):
    total_users = db.query(models.User).count()
    total_predictions = db.query(models.PredictionResult).count()
    
    # Basic analytics grouping by severity
    severity_counts = {
        "Low": db.query(models.PredictionResult).filter(models.PredictionResult.severity_label == "Low").count(),
        "Mild": db.query(models.PredictionResult).filter(models.PredictionResult.severity_label == "Mild").count(),
        "Moderate": db.query(models.PredictionResult).filter(models.PredictionResult.severity_label == "Moderate").count(),
        "Severe": db.query(models.PredictionResult).filter(models.PredictionResult.severity_label == "Severe").count(),
    }
    
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "severity_distribution": severity_counts
    }
