export interface User {
  _id?: string
  email: string
  name: string
  password: string
  role: "employee" | "manager"
  managerId?: string
  department: string
  createdAt: Date
}

export interface Feedback {
  _id?: string
  employeeId: string
  managerId: string
  content: string
  type: "feedback" | "question"
  sentiment?: "positive" | "negative"
  sentimentScore?: number
  isAnonymous: boolean
  response?: string
  respondedAt?: Date
  createdAt: Date
}

export interface SentimentAnalysis {
  text: string
  sentiment: "positive" | "negative"
  confidence: number
}
