"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import FeedbackForm from "@/components/feedback/feedback-form"
import ManagerDashboard from "@/components/feedback/manager-dashboard"
import EmployeeResponses from "@/components/feedback/employee-responses"
import SentimentAnalyzer from "@/components/sentiment/sentiment-analyzer"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState("")
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (newToken: string, newUser: any) => {
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken("")
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Anonymous Feedback System</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.name} ({user.role})
              </span>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue={user.role === "manager" ? "dashboard" : "submit"}>
          <TabsList className="grid w-full grid-cols-4">
            {user.role === "employee" && (
              <>
                <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
                <TabsTrigger value="responses">View Responses</TabsTrigger>
              </>
            )}
            {user.role === "manager" && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          </TabsList>

          {user.role === "employee" && (
            <>
              <TabsContent value="submit">
                <FeedbackForm token={token} />
              </TabsContent>
              <TabsContent value="responses">
                <EmployeeResponses token={token} />
              </TabsContent>
            </>
          )}

          {user.role === "manager" && (
            <TabsContent value="dashboard">
              <ManagerDashboard token={token} />
            </TabsContent>
          )}

          <TabsContent value="sentiment">
            <SentimentAnalyzer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
