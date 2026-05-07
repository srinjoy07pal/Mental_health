from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import auth, questionnaire, games, predictions, admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mental Health Predictor API",
    description="API for the AI-Based Mental Health Predictor System",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173", # Vite dev server
    "http://localhost:3000", # Alternative dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(questionnaire.router)
app.include_router(games.router)
app.include_router(predictions.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Welcome to Mental Health Predictor API"}
