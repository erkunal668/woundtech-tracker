import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import QuickBookingForm from "@/app/patient/quick-booking-form"
import jest from "jest" // Import jest to declare the variable

// Mock fetch
global.fetch = jest.fn()

const mockClinics = [
  {
    id: 1,
    name: "Test Clinic",
    address: "123 Test St",
    phone: "555-0123",
    email: "test@clinic.com",
    specialization: "General Medicine",
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Heart Clinic",
    address: "456 Heart Ave",
    phone: "555-0456",
    email: "heart@clinic.com",
    specialization: "Cardiology",
    created_at: "2024-01-01",
  },
]

describe("QuickBookingForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<QuickBookingForm clinics={mockClinics} />)

    expect(screen.getByTestId("patient-name")).toBeInTheDocument()
    expect(screen.getByTestId("patient-email")).toBeInTheDocument()
    expect(screen.getByTestId("patient-phone")).toBeInTheDocument()
    expect(screen.getByTestId("patient-dob")).toBeInTheDocument()
    expect(screen.getByTestId("clinic-select")).toBeInTheDocument()
    expect(screen.getByTestId("appointment-date")).toBeInTheDocument()
    expect(screen.getByTestId("appointment-time")).toBeInTheDocument()
    expect(screen.getByTestId("appointment-notes")).toBeInTheDocument()
    expect(screen.getByTestId("submit-appointment")).toBeInTheDocument()
  })

  it("displays clinic options in select dropdown", async () => {
    const user = userEvent.setup()
    render(<QuickBookingForm clinics={mockClinics} />)

    const selectTrigger = screen.getByTestId("clinic-select")
    await user.click(selectTrigger)

    expect(screen.getByText("Test Clinic")).toBeInTheDocument()
    expect(screen.getByText("Heart Clinic")).toBeInTheDocument()
  })

  it("submits form with correct data", async () => {
    const user = userEvent.setup()
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    render(<QuickBookingForm clinics={mockClinics} />)

    // Fill out form
    await user.type(screen.getByTestId("patient-name"), "John Doe")
    await user.type(screen.getByTestId("patient-email"), "john@example.com")
    await user.type(screen.getByTestId("patient-phone"), "555-1234")
    await user.type(screen.getByTestId("patient-dob"), "1990-01-01")

    // Select clinic
    await user.click(screen.getByTestId("clinic-select"))
    await user.click(screen.getByText("Test Clinic"))

    await user.type(screen.getByTestId("appointment-date"), "2024-12-25")
    await user.type(screen.getByTestId("appointment-time"), "10:00")
    await user.type(screen.getByTestId("appointment-notes"), "Test appointment")

    // Submit form
    await user.click(screen.getByTestId("submit-appointment"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    })
  })

  it("shows loading state during submission", async () => {
    const user = userEvent.setup()
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<QuickBookingForm clinics={mockClinics} />)

    // Fill required fields
    await user.type(screen.getByTestId("patient-name"), "John Doe")
    await user.type(screen.getByTestId("patient-email"), "john@example.com")
    await user.type(screen.getByTestId("patient-phone"), "555-1234")
    await user.type(screen.getByTestId("patient-dob"), "1990-01-01")
    await user.click(screen.getByTestId("clinic-select"))
    await user.click(screen.getByText("Test Clinic"))
    await user.type(screen.getByTestId("appointment-date"), "2024-12-25")
    await user.type(screen.getByTestId("appointment-time"), "10:00")

    // Submit form
    await user.click(screen.getByTestId("submit-appointment"))

    expect(screen.getByText("Booking Appointment...")).toBeInTheDocument()
    expect(screen.getByTestId("submit-appointment")).toBeDisabled()
  })

  it("validates required fields", async () => {
    const user = userEvent.setup()
    render(<QuickBookingForm clinics={mockClinics} />)

    // Try to submit empty form
    await user.click(screen.getByTestId("submit-appointment"))

    // Form should not submit (browser validation will prevent it)
    expect(fetch).not.toHaveBeenCalled()
  })
})
