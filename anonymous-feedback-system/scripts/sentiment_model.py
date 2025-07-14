import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import pickle
import random

# Generate synthetic training data
def generate_training_data():
    positive_samples = [
        "Great job on the project! Really impressed with your work.",
        "Thank you for your excellent leadership during the meeting.",
        "I appreciate your quick response to my questions.",
        "The team collaboration has been fantastic lately.",
        "Your presentation was very well prepared and informative.",
        "I'm grateful for your support on this initiative.",
        "The new process you implemented is working great.",
        "Your attention to detail is outstanding.",
        "Thanks for going above and beyond on this task.",
        "The feedback you provided was very helpful.",
        "I love the creative approach you took to solve this problem.",
        "Your communication skills have really improved.",
        "The training session you conducted was excellent.",
        "I appreciate your flexibility with the schedule changes.",
        "Your positive attitude makes a big difference to the team.",
        "The quality of your work consistently exceeds expectations.",
        "Thank you for mentoring the new team members.",
        "Your technical expertise has been invaluable.",
        "I'm impressed by your problem-solving abilities.",
        "The project was completed ahead of schedule thanks to your efforts."
    ]
    
    negative_samples = [
        "I'm concerned about the delays in the project timeline.",
        "The communication could be improved in our team meetings.",
        "I feel like my concerns are not being addressed properly.",
        "The workload distribution seems unfair lately.",
        "I'm frustrated with the lack of clear direction on this project.",
        "The feedback process needs to be more structured.",
        "I'm having difficulty accessing the resources I need.",
        "The meeting ran too long and wasn't very productive.",
        "I feel overwhelmed with the current workload.",
        "The decision-making process is taking too long.",
        "I'm not satisfied with the current work environment.",
        "The expectations are unclear and constantly changing.",
        "I feel like my input is not valued in team discussions.",
        "The tools we're using are outdated and inefficient.",
        "I'm concerned about the lack of professional development opportunities.",
        "The work-life balance has been challenging recently.",
        "I'm frustrated with the frequent interruptions during focused work time.",
        "The project requirements keep changing without proper communication.",
        "I feel like there's a lack of recognition for good work.",
        "The current process is inefficient and needs improvement."
    ]
    
    # Create more variations
    data = []
    labels = []
    
    # Add positive samples with variations
    for sample in positive_samples:
        data.append(sample)
        labels.append('positive')
        # Add variations
        variations = [
            f"I think {sample.lower()}",
            f"In my opinion, {sample.lower()}",
            f"I believe {sample.lower()}",
            f"I feel that {sample.lower()}",
            f"It seems like {sample.lower()}"
        ]
        for var in variations[:2]:  # Add 2 variations per sample
            data.append(var)
            labels.append('positive')
    
    # Add negative samples with variations
    for sample in negative_samples:
        data.append(sample)
        labels.append('negative')
        # Add variations
        variations = [
            f"I think {sample.lower()}",
            f"In my opinion, {sample.lower()}",
            f"I believe {sample.lower()}",
            f"I feel that {sample.lower()}",
            f"It seems like {sample.lower()}"
        ]
        for var in variations[:2]:  # Add 2 variations per sample
            data.append(var)
            labels.append('negative')
    
    return pd.DataFrame({'text': data, 'sentiment': labels})

# Train the model
def train_sentiment_model():
    print("Generating training data...")
    df = generate_training_data()
    print(f"Generated {len(df)} training samples")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['sentiment'], test_size=0.2, random_state=42
    )
    
    # Create pipeline with TF-IDF and Naive Bayes
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000, stop_words='english')),
        ('classifier', MultinomialNB())
    ])
    
    print("Training the model...")
    pipeline.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model accuracy: {accuracy:.2f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model
    with open('sentiment_model.pkl', 'wb') as f:
        pickle.dump(pipeline, f)
    
    print("Model saved as 'sentiment_model.pkl'")
    return pipeline

# Load the model
def load_sentiment_model():
    try:
        with open('sentiment_model.pkl', 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("Model not found. Training new model...")
        return train_sentiment_model()

# Predict sentiment
def predict_sentiment(text, model=None):
    if model is None:
        model = load_sentiment_model()
    
    prediction = model.predict([text])[0]
    probabilities = model.predict_proba([text])[0]
    confidence = max(probabilities)
    
    return {
        'sentiment': prediction,
        'confidence': confidence
    }

if __name__ == "__main__":
    # Train the model
    model = train_sentiment_model()
    
    # Test the model
    test_texts = [
        "I really appreciate your help with this project!",
        "I'm not happy with the current situation.",
        "The meeting was productive and well organized.",
        "I'm frustrated with the lack of communication."
    ]
    
    print("\nTesting the model:")
    for text in test_texts:
        result = predict_sentiment(text, model)
        print(f"Text: {text}")
        print(f"Sentiment: {result['sentiment']} (confidence: {result['confidence']:.2f})")
        print()
