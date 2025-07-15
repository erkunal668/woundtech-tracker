import { type NextRequest, NextResponse } from "next/server"
import { patientQueries, appointmentQueries, clinicQueries } from "@/lib/database"

// This log will tell us if the route file itself is being loaded
console.log("Loading /api/appointments/route.ts")

export async function POST(request: NextRequest) {
  // This log will tell us if the POST function is being executed
  console.log("--- POST /api/appointments endpoint hit ---")

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully.")
    } catch (parseError) {
      console.error("Failed to parse request body (likely not JSON or empty):", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body", success: false }, { status: 400 })
    }

    const { name, email, phone, dateOfBirth, appointmentDate, appointmentTime, notes, clinicId } = body

    console.log("Received appointment data:", {
      name,
      email,
      phone,
      dateOfBirth,
      clinicId,
      appointmentDate,
      appointmentTime,
      notes: notes ? "provided" : "empty",
    })

    // Validate required fields
    const missingFields = []
    if (!name) missingFields.push("name")
    if (!email) missingFields.push("email")
    if (!phone) missingFields.push("phone")
    if (!dateOfBirth) missingFields.push("dateOfBirth")
    if (!appointmentDate) missingFields.push("appointmentDate")
    if (!appointmentTime) missingFields.push("appointmentTime")
    if (!clinicId) missingFields.push("clinicId")

    if (missingFields.length > 0) {
      console.warn("Missing required fields:", missingFields.join(", "))
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(", ")}`,
          success: false,
          missingFields,
        },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.warn("Invalid email format:", email)
      return NextResponse.json({ error: "Invalid email format", success: false }, { status: 400 })
    }

    // Validate clinic ID and check if clinic exists
    const clinicIdNum = Number.parseInt(clinicId)
    if (isNaN(clinicIdNum)) {
      console.warn("Invalid clinic ID format:", clinicId)
      return NextResponse.json({ error: "Invalid clinic ID format", success: false }, { status: 400 })
    }

    // Check if clinic exists
    const clinic = clinicQueries.getById(clinicIdNum)
    if (!clinic) {
      console.warn("Selected clinic does not exist for ID:", clinicIdNum)
      return NextResponse.json({ error: "Selected clinic does not exist", success: false }, { status: 400 })
    }

    // Validate date format (should be YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(appointmentDate)) {
      console.warn("Invalid date format:", appointmentDate)
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD", success: false }, { status: 400 })
    }

    // Validate time format (should be HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(appointmentTime)) {
      console.warn("Invalid time format:", appointmentTime)
      return NextResponse.json({ error: "Invalid time format. Use HH:MM", success: false }, { status: 400 })
    }

    // Check if patient exists, if not create new patient
    let patient
    try {
      patient = patientQueries.getByEmail(email)
      console.log("Patient check: Existing patient found:", patient ? "Yes" : "No")
    } catch (error) {
      console.error("Database error while checking existing patient:", error)
      return NextResponse.json({ error: "Database error while checking patient", success: false }, { status: 500 })
    }

    if (!patient) {
      try {
        console.log("Creating new patient record...")
        const patientId = patientQueries.create({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          date_of_birth: dateOfBirth,
        })

        patient = patientQueries.getById(patientId)
        console.log("New patient created with ID:", patientId)
      } catch (error) {
        console.error("Error creating patient:", error)
        return NextResponse.json(
          { error: "Failed to create patient record. Email might already exist.", success: false },
          { status: 500 },
        )
      }
    }

    if (!patient) {
      console.error("Failed to retrieve patient after creation/lookup.")
      return NextResponse.json({ error: "Failed to create or find patient", success: false }, { status: 500 })
    }

    // Create appointment
    try {
      console.log("Attempting to create appointment in database...")
      const appointmentId = appointmentQueries.create({
        patient_id: patient.id,
        clinic_id: clinicIdNum,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "scheduled",
        notes: notes ? notes.trim() : null,
      })

      console.log("Appointment created successfully with ID:", appointmentId)

      return NextResponse.json(
        {
          success: true,
          appointmentId,
          message: "Appointment booked successfully",
          data: {
            patientName: patient.name,
            clinicName: clinic.name,
            appointmentDate,
            appointmentTime,
          },
        },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } catch (error) {
      console.error("Error creating appointment in database:", error)
      return NextResponse.json(
        { error: "Failed to create appointment. Please try again.", success: false },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unexpected top-level error in POST /api/appointments:", error)
    return NextResponse.json(
      {
        error: "Internal server error. Please try again later.",
        success: false,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  console.log("--- GET /api/appointments endpoint hit ---")

  try {
    const appointments = appointmentQueries.getAll()
    return NextResponse.json(
      { success: true, data: appointments },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments", success: false }, { status: 500 })
  }
}

export async function OPTIONS() {
  console.log("--- OPTIONS /api/appointments endpoint hit ---")

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
