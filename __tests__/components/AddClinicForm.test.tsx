import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddClinicForm from "@/app/admin/clinics/add-clinic-form"
import jest from "jest" // Import jest to declare the variable

// Mock fetch
global.fetch = jest.fn()

describe("AddClinicForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders all form fields", () => {
    render(<AddClinicForm />)

    expect(screen.getByTestId("clinic-name")).toBeInTheDocument()
    expect(screen.getByTestId("clinic-specialization")).toBeInTheDocument()
    expect(screen.getByTestId("clinic-address")).toBeInTheDocument()
    expect(screen.getByTestId("clinic-phone")).toBeInTheDocument()
    expect(screen.getByTestId("clinic-email")).toBeInTheDocument()
    expect(screen.getByTestId("submit-clinic")).toBeInTheDocument()
  })

  it("submits form with correct data", async () => {
    const user = userEvent.setup()
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    // Mock window.alert
    window.alert = jest.fn()

    render(<AddClinicForm />)

    // Fill out form
    await user.type(screen.getByTestId("clinic-name"), "New Test Clinic")
    await user.type(screen.getByTestId("clinic-address"), "789 New St")
    await user.type(screen.getByTestId("clinic-phone"), "555-9999")
    await user.type(screen.getByTestId("clinic-email"), "new@clinic.com")

    // Select specialization
    await user.click(screen.getByTestId("clinic-specialization"))
    await user.click(screen.getByText("General Medicine"))

    // Submit form
    await user.click(screen.getByTestId("submit-clinic"))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/clinics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Test Clinic",
          address: "789 New St",
          phone: "555-9999",
          email: "new@clinic.com",
          specialization: "General Medicine",
        }),
      })
    })

    expect(window.alert).toHaveBeenCalledWith("Clinic added successfully!")
  })

  it("shows error message on failed submission", async () => {
    const user = userEvent.setup()
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Clinic already exists" }),
    } as Response)

    // Mock window.alert
    window.alert = jest.fn()

    render(<AddClinicForm />)

    // Fill out form
    await user.type(screen.getByTestId("clinic-name"), "Duplicate Clinic")
    await user.type(screen.getByTestId("clinic-address"), "123 Duplicate St")
    await user.type(screen.getByTestId("clinic-phone"), "555-0000")
    await user.type(screen.getByTestId("clinic-email"), "duplicate@clinic.com")

    await user.click(screen.getByTestId("clinic-specialization"))
    await user.click(screen.getByText("Cardiology"))

    await user.click(screen.getByTestId("submit-clinic"))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Clinic already exists")
    })
  })

  it("resets form after successful submission", async () => {
    const user = userEvent.setup()
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    window.alert = jest.fn()

    render(<AddClinicForm />)

    // Fill out form
    await user.type(screen.getByTestId("clinic-name"), "Test Clinic")
    await user.type(screen.getByTestId("clinic-email"), "test@clinic.com")

    // Submit form
    await user.click(screen.getByTestId("submit-clinic"))

    await waitFor(() => {
      expect(screen.getByTestId("clinic-name")).toHaveValue("")
      expect(screen.getByTestId("clinic-email")).toHaveValue("")
    })
  })
})
