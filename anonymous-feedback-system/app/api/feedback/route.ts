import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { content, type, managerId, isAnonymous } = await request.json()

    const db = await getDatabase()
    const feedback = db.collection("feedback")

    // Get sentiment analysis
    let sentiment = null
    let sentimentScore = null

    try {
      const sentimentResponse = await fetch("http://localhost:5000/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      })

      if (sentimentResponse.ok) {
        const sentimentData = await sentimentResponse.json()
        sentiment = sentimentData.sentiment
        sentimentScore = sentimentData.confidence
      }
    } catch (error) {
      console.log("Sentiment analysis service unavailable")
    }

    const newFeedback = {
      employeeId: decoded.userId,
      managerId,
      content,
      type,
      sentiment,
      sentimentScore,
      isAnonymous,
      createdAt: new Date(),
    }

    const result = await feedback.insertOne(newFeedback)

    return NextResponse.json({
      message: "Feedback submitted successfully",
      feedbackId: result.insertedId,
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    const db = await getDatabase()
    const feedback = db.collection("feedback")
    const users = db.collection("users")

    let feedbackData

    if (role === "manager") {
      // Get feedback for this manager
      feedbackData = await feedback.find({ managerId: decoded.userId }).toArray()
    } else {
      // Get responses to employee's feedback
      feedbackData = await feedback
        .find({
          employeeId: decoded.userId,
          response: { $exists: true },
        })
        .toArray()
    }

    return NextResponse.json(feedbackData)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
