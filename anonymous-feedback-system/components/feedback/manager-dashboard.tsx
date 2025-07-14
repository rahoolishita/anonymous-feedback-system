"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Feedback {
  _id: string
  content: string
  type: "feedback" | "question"
  sentiment?: "positive" | "negative"
  sentimentScore?: number
  isAnonymous: boolean
  response?: string
  respondedAt?: string
  createdAt: string
}

interface ManagerDashboardProps {
  token: string
}

export default function ManagerDashboard({ token }: ManagerDashboardProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [responses, setResponses] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch("/api/feedback?role=manager", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error("Error fetching feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (feedbackId: string) => {
    const response = responses[feedbackId]
    if (!response) return

    try {
      const res = await fetch(`/api/feedback/${feedbackId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response }),
      })

      if (res.ok) {
        setResponses({ ...responses, [feedbackId]: "" })
        fetchFeedbacks() // Refresh the list
      }
    } catch (error) {
      console.error("Error responding to feedback:", error)
    }
  }

  if (loading) {
    return <div className="text-center">Loading feedbacks...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manager Dashboard</h2>
      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No feedback received yet.</p>
          </CardContent>
        </Card>
      ) : (
        feedbacks.map((feedback) => (
          <Card key={feedback._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant={feedback.type === "feedback" ? "default" : "secondary"}>{feedback.type}</Badge>
                    {feedback.sentiment && (
                      <Badge variant={feedback.sentiment === "positive" ? "default" : "destructive"}>
                        {feedback.sentiment} ({Math.round((feedback.sentimentScore || 0) * 100)}%)
                      </Badge>
                    )}
                    {feedback.isAnonymous && <Badge variant="outline">Anonymous</Badge>}
                  </div>
                  <p className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Content:</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{feedback.content}</p>
                </div>

                {feedback.response ? (
                  <div>
                    <Label>Your Response:</Label>
                    <p className="mt-1 p-3 bg-blue-50 rounded">{feedback.response}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Responded on {new Date(feedback.respondedAt!).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor={`response-${feedback._id}`}>Your Response:</Label>
                    <Textarea
                      id={`response-${feedback._id}`}
                      value={responses[feedback._id] || ""}
                      onChange={(e) =>
                        setResponses({
                          ...responses,
                          [feedback._id]: e.target.value,
                        })
                      }
                      placeholder="Enter your response..."
                      rows={3}
                    />
                    <Button onClick={() => handleRespond(feedback._id)} disabled={!responses[feedback._id]}>
                      Send Response
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
