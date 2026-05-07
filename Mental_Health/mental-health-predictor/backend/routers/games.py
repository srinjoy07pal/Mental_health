from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud, models, database, auth
from typing import List

router = APIRouter(prefix="/api/games", tags=["games"])

@router.post("/", response_model=schemas.GameMetricsResponseModel)
def submit_game_metrics(
    game_data: schemas.GameMetricsCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_game_metrics(db=db, game_data=game_data, user_id=current_user.id)

@router.get("/", response_model=List[schemas.GameMetricsResponseModel])
def get_game_metrics(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.GameMetrics).filter(models.GameMetrics.user_id == current_user.id).all()
