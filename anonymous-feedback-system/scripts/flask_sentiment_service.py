from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load the sentiment model
def load_model():
    try:
        with open('sentiment_model.pkl', 'rb') as f:
            return pickle.load(f)
    except FileNotFoundError:
        print("Model not found. Please run sentiment_model.py first to train the model.")
        return None

model = load_model()

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        if model is None:
            return jsonify({'error': 'Model not available'}), 500
        
        prediction = model.predict([text])[0]
        probabilities = model.predict_proba([text])[0]
        confidence = max(probabilities)
        
        return jsonify({
            'sentiment': prediction,
            'confidence': float(confidence)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None})

if __name__ == '__main__':
    if model is None:
        print("Warning: Sentiment model not loaded. Please train the model first.")
    else:
        print("Sentiment analysis service starting...")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
