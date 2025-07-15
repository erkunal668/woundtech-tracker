import { POST, GET } from "@/app/api/appointments/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock the database
jest.mock("@/lib/database", () => ({
  patientQueries: {
    getByEmail: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
  },
  appointmentQueries: {
    create: jest.fn(),
    getAll: jest.fn(),
  },
}))

describe("/api/appointments", () => {
  describe("POST", () => {
    it("creates appointment for new patient", async () => {
      const { patientQueries, appointmentQueries } = require("@/lib/database")

      patientQueries.getByEmail.mockReturnValue(null)
      patientQueries.create.mockReturnValue(1)
      patientQueries.getById.mockReturnValue({ id: 1, name: "John Doe" })
      appointmentQueries.create.mockReturnValue(1)

      const request = new NextRequest("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          dateOfBirth: "1990-01-01",
          clinicId: "1",
          appointmentDate: "2024-12-25",
          appointmentTime: "10:00",
          notes: "Test appointment",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.appointmentId).toBe(1)
    })

    it("returns error for missing required fields", async () => {
      const request = new NextRequest("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          // Missing other required fields
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Missing required fields")
    })

    it("returns error for invalid email format", async () => {
      const request = new NextRequest("http://localhost/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "invalid-email",
          phone: "555-1234",
          dateOfBirth: "1990-01-01",
          clinicId: "1",
          appointmentDate: "2024-12-25",
          appointmentTime: "10:00",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid email format")
    })
  })

  describe("GET", () => {
    it("returns all appointments", async () => {
      const { appointmentQueries } = require("@/lib/database")
      const mockAppointments = [
        { id: 1, patient_name: "John Doe", clinic_name: "Test Clinic" },
        { id: 2, patient_name: "Jane Smith", clinic_name: "Heart Clinic" },
      ]

      appointmentQueries.getAll.mockReturnValue(mockAppointments)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockAppointments)
    })
  })
})
