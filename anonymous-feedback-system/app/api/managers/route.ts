import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const users = db.collection("users")

    const managers = await users.find({ role: "manager" }).toArray()

    // Ensure we return a consistent format
    const formattedManagers = managers.map((manager) => ({
      id: manager._id.toString(), // Convert ObjectId to string
      name: manager.name,
      email: manager.email,
      department: manager.department,
    }))

    return NextResponse.json(formattedManagers)
  } catch (error) {
    console.error("Error fetching managers:", error)
    return NextResponse.json({ error: "Failed to fetch managers", managers: [] }, { status: 500 })
  }
}
