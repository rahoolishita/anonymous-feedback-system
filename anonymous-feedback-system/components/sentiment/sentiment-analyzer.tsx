"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export default function SentimentAnalyzer() {
  const [text, setText] = useState("")
  const [result, setResult] = useState<{
    sentiment: string
    confidence: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeSentiment = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
      setResult({ sentiment: "error", confidence: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sentiment Analysis Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="text">Enter text to analyze:</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            rows={4}
          />
        </div>

        <Button onClick={analyzeSentiment} disabled={loading || !text.trim()} className="w-full">
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </Button>

        {result && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Sentiment:</span>
              <Badge
                variant={
                  result.sentiment === "positive"
                    ? "default"
                    : result.sentiment === "negative"
                      ? "destructive"
                      : "secondary"
                }
              >
                {result.sentiment}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Confidence:</span>
              <span>{Math.round(result.confidence * 100)}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
