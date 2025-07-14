import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Call Python sentiment analysis service
    const response = await fetch("http://localhost:5000/analyze-sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Sentiment analysis service unavailable")
    }

    const sentimentData = await response.json()

    return NextResponse.json(sentimentData)
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return NextResponse.json(
      {
        error: "Sentiment analysis unavailable",
        sentiment: "neutral",
        confidence: 0,
      },
      { status: 500 },
    )
  }
}
