import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const { response } = await request.json()

    const db = await getDatabase()
    const feedback = db.collection("feedback")

    const result = await feedback.updateOne(
      { _id: new ObjectId(params.id), managerId: decoded.userId },
      {
        $set: {
          response,
          respondedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Response added successfully" })
  } catch (error) {
    console.error("Error responding to feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
