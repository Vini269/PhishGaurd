
import os
import joblib
import pandas as pd

from app.Phisingdetector import PhishingDetector
from app.features import features_extract

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR, "models", "logistic_model.pkl"
)

url_model = None
Detector = None


def load_model():
    global url_model, Detector

    if not os.path.exists(MODEL_PATH):
        raise RuntimeError("Logistic model not found.")

    # Load original trained Logistic Regression model
    url_model = joblib.load(MODEL_PATH)

    # Recreate wrapper locally
    Detector = PhishingDetector(
        model=url_model,
        threshold=0.95
    )

    print("Phishing model loaded successfully!")


def predict_url(url):
    if Detector is None:
        raise RuntimeError("Model has not been loaded.")

    features = features_extract(url)
    X = pd.DataFrame([features])

    result, confidence = Detector.predict_with_confidence(X)

    return {
        "url": url,
        "classification": str(result[0]),
        "confidence": round(float(confidence[0]) * 100, 2)
    }
