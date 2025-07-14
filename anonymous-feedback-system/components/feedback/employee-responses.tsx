"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Feedback {
  _id: string
  content: string
  type: "feedback" | "question"
  response: string
  respondedAt: string
  createdAt: string
}

interface EmployeeResponsesProps {
  token: string
}

export default function EmployeeResponses({ token }: EmployeeResponsesProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResponses()
  }, [])

  const fetchResponses = async () => {
    try {
      const response = await fetch("/api/feedback?role=employee", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setFeedbacks(data)
    } catch (error) {
      console.error("Error fetching responses:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center">Loading responses...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Manager Responses</h2>
      {feedbacks.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No responses yet.</p>
          </CardContent>
        </Card>
      ) : (
        feedbacks.map((feedback) => (
          <Card key={feedback._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={feedback.type === "feedback" ? "default" : "secondary"}>{feedback.type}</Badge>
                <p className="text-sm text-gray-500">Submitted: {new Date(feedback.createdAt).toLocaleDateString()}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Your {feedback.type}:</Label>
                  <p className="mt-1 p-3 bg-gray-50 rounded">{feedback.content}</p>
                </div>

                <div>
                  <Label>Manager's Response:</Label>
                  <p className="mt-1 p-3 bg-blue-50 rounded">{feedback.response}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Responded on {new Date(feedback.respondedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
