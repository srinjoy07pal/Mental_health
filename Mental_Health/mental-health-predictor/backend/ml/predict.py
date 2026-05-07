import joblib
import os
import numpy as np

# Adjust path based on where the app runs from
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'mental_health_rf_model.joblib')

try:
    model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    model = None

def get_severity_label(score):
    if score < 0.25:
        return "Low"
    elif score < 0.5:
        return "Mild"
    elif score < 0.75:
        return "Moderate"
    else:
        return "Severe"

def make_prediction(features: dict):
    if model is None:
        raise Exception("Model not trained yet. Run train.py first.")
    
    # Extract features in the correct order
    # ['q_anxiety', 'q_depression', 'q_stress', 'q_tension',
    #  'game_score_memory', 'game_rt_memory', 
    #  'game_score_color', 'game_rt_color',
    #  'game_score_focus', 'game_rt_focus']
    
    input_data = np.array([[
        features.get('q_anxiety', 1.0),
        features.get('q_depression', 1.0),
        features.get('q_stress', 1.0),
        features.get('q_tension', 1.0),
        features.get('game_score_memory', 50.0),
        features.get('game_rt_memory', 1.5),
        features.get('game_score_color', 50.0),
        features.get('game_rt_color', 1.0),
        features.get('game_score_focus', 50.0),
        features.get('game_rt_focus', 0.5)
    ]])
    
    preds = model.predict(input_data)[0] # Returns array of 4 values
    
    anxiety_prob = float(preds[0])
    depression_prob = float(preds[1])
    stress_prob = float(preds[2])
    tension_prob = float(preds[3])
    
    overall_score = (anxiety_prob + depression_prob + stress_prob + tension_prob) / 4.0
    severity_label = get_severity_label(overall_score)
    
    return {
        "anxiety_prob": anxiety_prob,
        "depression_prob": depression_prob,
        "stress_prob": stress_prob,
        "tension_prob": tension_prob,
        "overall_score": overall_score,
        "severity_label": severity_label
    }
