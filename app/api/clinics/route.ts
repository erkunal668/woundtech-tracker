import { type NextRequest, NextResponse } from "next/server"
import { clinicQueries } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, phone, email, specialization } = body

    // Validate required fields
    if (!name || !address || !phone || !email || !specialization) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create clinic
    const clinicId = clinicQueries.create({
      name,
      address,
      phone,
      email,
      specialization,
    })

    return NextResponse.json({
      success: true,
      clinicId,
      message: "Clinic added successfully",
    })
  } catch (error) {
    console.error("Error creating clinic:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const clinics = clinicQueries.getAll()
    return NextResponse.json(clinics)
  } catch (error) {
    console.error("Error fetching clinics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
