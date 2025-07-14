# Employee-Manager Feedback System

A comprehensive React-based web application for anonymous employee feedback with sentiment analysis.

## Features

- **User Authentication**: Employee and manager registration/login
- **Anonymous Feedback**: Employees can submit feedback anonymously to managers
- **Manager Dashboard**: Managers can view and respond to feedback
- **Sentiment Analysis**: AI-powered sentiment analysis using Python ML model
- **Real-time Updates**: Live feedback and response system
- **Database Seeding**: Automated generation of 1000+ dummy records

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB
- **ML/AI**: Python, scikit-learn, Flask
- **Authentication**: JWT tokens

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ 
- Python 3.8+
- MongoDB (local or cloud)

### 2. Installation

\`\`\`bash
# Clone and install dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
\`\`\`

### 3. Environment Setup

Create `.env.local` file with your MongoDB connection string and JWT secret.

### 4. Database Setup

\`\`\`bash
# Seed the database with dummy data
python  seed_database.py
\`\`\`

### 5. Train Sentiment Model

\`\`\`bash
# Train the ML model for sentiment analysis
python sentiment_model.py
\`\`\`

### 6. Start Services

\`\`\`bash
# Terminal 1: Start Next.js app
npm run dev

# Terminal 2: Start Python sentiment service
<!-- cd C:\Users\Admin\Downloads\anonymous-feedback-system\scripts  first need to go to the scripts folder -->
python flask_sentiment_service.py
\`\`\`

## Usage

1. **Registration**: Create manager and employee accounts
2. **Submit Feedback**: Employees can submit anonymous feedback/questions
3. **Manager Response**: Managers view feedback and provide responses
4. **Sentiment Analysis**: Test the ML model with custom text
5. **View Responses**: Employees see manager responses to their feedback

## Sample Credentials

After seeding the database, you can login with:
- **Manager**: sarah.johnson@company.com / password123
- **Employee**: alex.thompson@company.com / password123

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/managers` - Get all managers
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback (role-based)
- `POST /api/feedback/[id]/respond` - Respond to feedback
- `POST /api/sentiment` - Analyze sentiment

## Database Schema

### Users Collection
\`\`\`javascript
{
  email: String,
  name: String,
  password: String (hashed),
  role: 'employee' | 'manager',
  managerId: String (for employees),
  department: String,
  createdAt: Date
}
\`\`\`

### Feedback Collection
\`\`\`javascript
{
  employeeId: String,
  managerId: String,
  content: String,
  type: 'feedback' | 'question',
  sentiment: 'positive' | 'negative',
  sentimentScore: Number,
  isAnonymous: Boolean,
  response: String (optional),
  respondedAt: Date (optional),
  createdAt: Date
}
\`\`\`

## Machine Learning Model

The sentiment analysis uses a Naive Bayes classifier trained on synthetic feedback data:

- **Algorithm**: MultinomialNB from scikit-learn
- **Features**: TF-IDF vectorization
- **Training Data**: 180+ synthetic feedback samples
- **Accuracy**: ~85-90% on test data
- **Output**: Sentiment (positive/negative) + confidence score

## Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Next.js API    │    │    MongoDB      │
│                 │◄──►│                 │◄──►│                 │
│ - Auth Forms    │    │ - User Auth     │    │ - Users         │
│ - Feedback UI   │    │ - Feedback CRUD │    │ - Feedback      │
│ - Dashboard     │    │ - JWT Handling  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Python Flask   │
                       │                 │
                       │ - ML Model      │
                       │ - Sentiment API │
                       └─────────────────┘
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes as part of a capstone project.
