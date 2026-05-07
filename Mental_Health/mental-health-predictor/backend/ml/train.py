import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

# Create models directory if it doesn't exist
os.makedirs('../models', exist_ok=True)

def generate_synthetic_data(num_samples=1000):
    np.random.seed(42)
    
    # Features
    q_anxiety = np.random.uniform(1, 5, num_samples)
    q_depression = np.random.uniform(1, 5, num_samples)
    q_stress = np.random.uniform(1, 5, num_samples)
    q_tension = np.random.uniform(1, 5, num_samples)
    
    game_score_memory = np.random.uniform(0, 100, num_samples)
    game_rt_memory = np.random.uniform(0.5, 2.5, num_samples)
    
    game_score_color = np.random.uniform(0, 100, num_samples)
    game_rt_color = np.random.uniform(0.3, 1.5, num_samples)
    
    game_score_focus = np.random.uniform(0, 100, num_samples)
    game_rt_focus = np.random.uniform(0.2, 1.0, num_samples)
    
    # Target variables (simplified logic)
    # Higher questionnaire scores -> higher probability
    # Lower game scores & higher reaction times -> slightly higher probability
    
    base_anxiety = (q_anxiety / 5.0) * 0.7 + (game_rt_color / 1.5) * 0.15 + ((100 - game_score_memory)/100) * 0.15
    base_depression = (q_depression / 5.0) * 0.8 + ((100 - game_score_focus)/100) * 0.2
    base_stress = (q_stress / 5.0) * 0.7 + (game_rt_memory / 2.5) * 0.2 + ((100 - game_score_color)/100) * 0.1
    base_tension = (q_tension / 5.0) * 0.6 + (game_rt_focus / 1.0) * 0.4
    
    # Add some noise
    base_anxiety += np.random.normal(0, 0.05, num_samples)
    base_depression += np.random.normal(0, 0.05, num_samples)
    base_stress += np.random.normal(0, 0.05, num_samples)
    base_tension += np.random.normal(0, 0.05, num_samples)
    
    # Clip between 0 and 1
    anxiety = np.clip(base_anxiety, 0, 1)
    depression = np.clip(base_depression, 0, 1)
    stress = np.clip(base_stress, 0, 1)
    tension = np.clip(base_tension, 0, 1)
    
    df = pd.DataFrame({
        'q_anxiety': q_anxiety,
        'q_depression': q_depression,
        'q_stress': q_stress,
        'q_tension': q_tension,
        'game_score_memory': game_score_memory,
        'game_rt_memory': game_rt_memory,
        'game_score_color': game_score_color,
        'game_rt_color': game_rt_color,
        'game_score_focus': game_score_focus,
        'game_rt_focus': game_rt_focus,
        'target_anxiety': anxiety,
        'target_depression': depression,
        'target_stress': stress,
        'target_tension': tension
    })
    
    return df

def train_and_save():
    print("Generating synthetic data...")
    df = generate_synthetic_data(2000)
    os.makedirs('../datasets', exist_ok=True)
    df.to_csv('../datasets/synthetic_mental_health_data.csv', index=False)
    
    features = ['q_anxiety', 'q_depression', 'q_stress', 'q_tension',
                'game_score_memory', 'game_rt_memory', 
                'game_score_color', 'game_rt_color',
                'game_score_focus', 'game_rt_focus']
    
    targets = ['target_anxiety', 'target_depression', 'target_stress', 'target_tension']
    
    X = df[features]
    y = df[targets]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestRegressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    mse = mean_squared_error(y_test, preds)
    r2 = r2_score(y_test, preds)
    print(f"Model Evaluation - MSE: {mse:.4f}, R2: {r2:.4f}")
    
    model_path = '../models/mental_health_rf_model.joblib'
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save()
