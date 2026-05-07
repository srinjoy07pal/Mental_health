from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, models, database, auth
from typing import List

router = APIRouter(prefix="/api/questionnaire", tags=["questionnaire"])

@router.post("/", response_model=schemas.QuestionnaireResponseModel)
def submit_questionnaire(
    q_data: schemas.QuestionnaireCreate, 
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_questionnaire(db=db, q_data=q_data, user_id=current_user.id)

@router.get("/", response_model=List[schemas.QuestionnaireResponseModel])
def get_questionnaires(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.QuestionnaireResponse).filter(models.QuestionnaireResponse.user_id == current_user.id).all()
