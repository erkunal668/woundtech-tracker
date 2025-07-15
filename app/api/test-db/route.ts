import { NextResponse } from "next/server"
import { clinicQueries, patientQueries, appointmentQueries } from "@/lib/database"

export async function GET() {
  try {
    // Test database connectivity
    const clinics = clinicQueries.getAll()
    const patients = patientQueries.getAll()
    const appointments = appointmentQueries.getAll()

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        clinicsCount: clinics.length,
        patientsCount: patients.length,
        appointmentsCount: appointments.length,
        sampleClinic: clinics[0] || null,
      },
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
