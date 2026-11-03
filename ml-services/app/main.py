
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager

from app.model import load_model, predict_url


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield


app = FastAPI(
    title="MailGuard URL Detection API",
    version="1.0.0",
    lifespan=lifespan
)


class URLRequest(BaseModel):
    urls: list[str] = Field(min_length=1, max_length=50)


@app.get("/")
def home():
    return {
        "message": "MailGuard URL Detection API is running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/predict")
def predict(request: URLRequest):

    results = []

    for url in request.urls:

        if not url.strip():
            continue

        try:
            result = predict_url(url)
            results.append(result)

        except Exception:
            results.append({
                "url": url,
                "error": "Unable to analyze URL"
            })

    if not results:
        raise HTTPException(
            status_code=400,
            detail="No valid URLs provided"
        )

    phishing_results = [
        item for item in results
        if item.get("classification") == "phishing"
    ]

    spam_results = [
        item for item in results
        if item.get("classification") == "spam"
    ]

    if phishing_results:
        overall = "phishing"
    elif spam_results:
        overall = "spam"
    elif any("error" in item for item in results):
        overall = "unknown"
    else:
        overall = "likely_safe"

    return {
        "classification": overall,
        "total_urls": len(results),
        "results": results
    }
