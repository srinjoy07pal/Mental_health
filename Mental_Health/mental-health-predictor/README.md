# AI-Based Mental Health Predictor System

A comprehensive mental health assessment platform that uses machine learning to predict and analyze anxiety, depression, stress, and tension levels based on psychological questionnaires and interactive cognitive games.

## Features
- **Authentication**: JWT-based secure signup and login.
- **Cognitive Games**: Memory Challenge, Color Reaction, Focus Tracking.
- **ML Analysis**: RandomForest based predictive modeling.
- **Dashboard**: Interactive charts and visualization using Chart.js.
- **Admin Panel**: Manage users and view overall system analytics.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Chart.js
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Machine Learning**: Scikit-Learn, Pandas, NumPy

## Project Structure
```
mental-health-predictor/
├── backend/
│   ├── ml/           # Machine Learning logic and data generation
│   ├── routers/      # API Endpoints
│   ├── main.py       # FastAPI Entrypoint
│   └── ...
├── frontend/
│   ├── src/          # React Source Code
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── ...
├── models/           # Generated ML Models
├── datasets/         # Generated synthetic datasets
└── README.md
```

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd mental-health-predictor/backend
   ```
2. Create a virtual environment (optional but recommended).
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies.
   ```bash
   pip install -r requirements.txt
   ```
4. Generate the ML model.
   ```bash
   python ml/train.py
   ```
5. Start the FastAPI server.
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd mental-health-predictor/frontend
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Screenshots
*To be added: Dashboard overview, Game interfaces, Questionnaire process.*
