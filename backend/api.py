from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

# Load NLTK resources safely
for resource in ["punkt", "stopwords", "wordnet", "omw-1.4"]:
    try:
        nltk.data.find(resource)
    except LookupError:
        nltk.download(resource)

app = FastAPI()

# ✅ CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("results/final_model.pkl")
vectorizer = joblib.load("results/vectorizer.pkl")

stop_words = set(stopwords.words("english")) - {"not"}
lemmatizer = WordNetLemmatizer()


class ReviewInput(BaseModel):
    text: str


def clean_text(text: str):
    text = text.lower()
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    tokens = nltk.word_tokenize(text)
    tokens = [lemmatizer.lemmatize(w) for w in tokens if w not in stop_words]
    return " ".join(tokens)


@app.post("/predict")
def predict(review: ReviewInput):
    cleaned = clean_text(review.text)
    vectorized = vectorizer.transform([cleaned])

    prediction = model.predict(vectorized)[0]
    probabilities = model.predict_proba(vectorized)[0]

    labels = ["Negative", "Neutral", "Positive"]

    return {
        "sentiment": labels[prediction],
        "confidence": float(max(probabilities))
    }

# Optional test route
@app.get("/")
def root():
    return {"message": "Sentiment API Running"}
