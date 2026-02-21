# ==========================================
# PROFESSIONAL SENTIMENT ANALYSIS PIPELINE
# ==========================================

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import string
import re
import nltk

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from textblob import TextBlob

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import confusion_matrix, accuracy_score, classification_report, roc_curve, auc
from sklearn.linear_model import LogisticRegression

from imblearn.over_sampling import SMOTE
from collections import Counter
import joblib

# ==========================================
# CREATE RESULTS FOLDER
# ==========================================

if not os.path.exists("results"):
    os.makedirs("results")


# ==========================================
# SAFE NLTK DOWNLOAD
# ==========================================

resources = ["punkt", "punkt_tab", "stopwords", "wordnet", "omw-1.4"]
for resource in resources:
    try:
        nltk.data.find(resource)
    except LookupError:
        nltk.download(resource)


# ==========================================
# LOAD DATASET
# ==========================================

print("Loading Dataset...")
dataset = pd.read_csv("Instruments_Reviews.csv")
print("Dataset Shape:", dataset.shape)


# ==========================================
# HANDLE MISSING VALUES
# ==========================================

dataset["reviewText"] = dataset["reviewText"].fillna("")
dataset["summary"] = dataset["summary"].fillna("")


# ==========================================
# CREATE COMBINED TEXT
# ==========================================

dataset["reviews"] = dataset["reviewText"] + " " + dataset["summary"]


# ==========================================
# CREATE SENTIMENT LABEL
# ==========================================

def label_sentiment(rating):
    if rating > 3:
        return "Positive"
    elif rating < 3:
        return "Negative"
    else:
        return "Neutral"

dataset["sentiment"] = dataset["overall"].apply(label_sentiment)


# ==========================================
# TEXT CLEANING
# ==========================================

Stopwords = set(stopwords.words("english")) - {"not"}
lemmatizer = WordNetLemmatizer()

def clean_text(text):
    text = text.lower()
    text = text.translate(str.maketrans(string.punctuation, ' '*len(string.punctuation)))
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'\n', '', text)
    return text

def process_text(text):
    tokens = nltk.word_tokenize(text)
    processed = [lemmatizer.lemmatize(word) for word in tokens if word not in Stopwords]
    return " ".join(processed)

print("Cleaning Text...")
dataset["reviews"] = dataset["reviews"].apply(clean_text)
dataset["reviews"] = dataset["reviews"].apply(process_text)


# ==========================================
# ENCODE TARGET
# ==========================================

encoder = LabelEncoder()
dataset["sentiment"] = encoder.fit_transform(dataset["sentiment"])


# ==========================================
# TF-IDF
# ==========================================

tfidf = TfidfVectorizer(max_features=5000, ngram_range=(2,2))
X = tfidf.fit_transform(dataset["reviews"])
y = dataset["sentiment"]


# ==========================================
# CLASS DISTRIBUTION PLOT
# ==========================================

plt.figure(figsize=(6,6))
pd.Series(y).value_counts().plot(kind="bar")
plt.title("Class Distribution Before SMOTE")
plt.savefig("results/class_distribution.png")
plt.close()


# ==========================================
# SMOTE BALANCING
# ==========================================

smote = SMOTE(random_state=42)
X_balanced, y_balanced = smote.fit_resample(X, y)

print("Balanced Distribution:", Counter(y_balanced))


# ==========================================
# TRAIN TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X_balanced, y_balanced,
    test_size=0.25,
    random_state=42
)


# ==========================================
# MODEL TRAINING (LOGISTIC REGRESSION)
# ==========================================

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

pred = model.predict(X_test)

accuracy = accuracy_score(y_test, pred)
print("Final Test Accuracy:", accuracy)


# ==========================================
# CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(y_test, pred)

plt.figure(figsize=(6,6))
plt.imshow(cm, cmap="Blues")
plt.title("Confusion Matrix")
plt.colorbar()

labels = encoder.classes_
plt.xticks(np.arange(len(labels)), labels)
plt.yticks(np.arange(len(labels)), labels)

for i in range(len(labels)):
    for j in range(len(labels)):
        plt.text(j, i, cm[i,j], ha="center", va="center")

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.tight_layout()
plt.savefig("results/confusion_matrix.png")
plt.close()


# ==========================================
# ROC CURVE
# ==========================================

y_prob = model.predict_proba(X_test)

plt.figure(figsize=(6,6))
for i in range(len(labels)):
    fpr, tpr, _ = roc_curve(y_test == i, y_prob[:, i])
    roc_auc = auc(fpr, tpr)
    plt.plot(fpr, tpr, label=f"{labels[i]} (AUC = {roc_auc:.2f})")

plt.plot([0,1], [0,1], linestyle="--")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("ROC Curve")
plt.legend()
plt.savefig("results/roc_curve.png")
plt.close()


# ==========================================
# SAVE REPORT
# ==========================================
joblib.dump(model, "results/final_model.pkl")

# Save vectorizer
joblib.dump(tfidf, "results/vectorizer.pkl")

print("Model and Vectorizer Saved Successfully!")

report = classification_report(y_test, pred, target_names=labels)

with open("results/model_report.txt", "w") as f:
    f.write("Sentiment Analysis Report\n")
    f.write("=========================\n\n")
    f.write(f"Accuracy: {accuracy:.4f}\n\n")
    f.write(report)

print("\nAll results saved inside 'results' folder.")
print("\nSentiment Analysis Completed Successfully!")
