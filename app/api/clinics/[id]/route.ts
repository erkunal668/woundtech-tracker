import { type NextRequest, NextResponse } from "next/server"
import { clinicQueries } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clinicId = Number.parseInt(params.id)

    if (isNaN(clinicId)) {
      return NextResponse.json({ error: "Invalid clinic ID" }, { status: 400 })
    }

    // Check if clinic exists
    const clinic = clinicQueries.getById(clinicId)
    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 })
    }

    // Delete clinic
    const deleted = clinicQueries.delete(clinicId)

    if (deleted) {
      return NextResponse.json({
        success: true,
        message: "Clinic deleted successfully",
      })
    } else {
      return NextResponse.json({ error: "Failed to delete clinic" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting clinic:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
