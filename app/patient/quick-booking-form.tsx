"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Clock, AlertCircle } from "lucide-react"
import type { Clinic } from "@/lib/database"

interface QuickBookingFormProps {
  clinics: Clinic[]
}

export default function QuickBookingForm({ clinics }: QuickBookingFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    clinicId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  })

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection to /api/appointments/test...")
      const response = await fetch("/api/appointments/test") // Use the dedicated test route
      const data = await response.json()
      console.log("API test result:", data)
      alert(`API Test: ${data.message}`)
    } catch (error) {
      console.error("API test failed:", error)
      alert("API test failed - check console for details")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    console.log("=== FORM SUBMISSION STARTED ===")
    console.log("Form data:", formData)
    console.log("Current URL:", window.location.href)
    console.log("API endpoint:", "/api/appointments")

    // Client-side validation
    const requiredFields = {
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      dateOfBirth: "Date of Birth",
      clinicId: "Clinic Selection",
      appointmentDate: "Appointment Date",
      appointmentTime: "Appointment Time",
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !formData[key as keyof typeof formData])
      .map(([, label]) => label)

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(", ")}`)
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Making API request to /api/appointments...")
      console.log("Request method: POST")
      console.log("Request headers: Content-Type: application/json")
      console.log("Request body:", JSON.stringify(formData, null, 2))

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("=== RESPONSE RECEIVED ===")
      console.log("Response status:", response.status)
      console.log("Response statusText:", response.statusText)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))
      console.log("Response ok:", response.ok)

      // Check for 405 error specifically
      if (response.status === 405) {
        console.error("405 Method Not Allowed - POST method not supported by server.")
        setError("Server error: POST method not allowed. Please contact support.")
        setIsSubmitting(false)
        return
      }

      // Get response text first to debug
      const responseText = await response.text()
      console.log("Raw response text:", responseText)
      console.log("Response text length:", responseText.length)

      // Try to parse as JSON
      let result
      try {
        result = responseText ? JSON.parse(responseText) : {}
        console.log("Parsed JSON result:", result)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        console.error("Response was:", responseText)
        setError("Server returned invalid response. Please try again.")
        setIsSubmitting(false)
        return
      }

      if (!response.ok) {
        console.error("Response not ok:", response.status, result)
        throw new Error(result.error || `Server error: ${response.status}`)
      }

      if (result.success) {
        console.log("=== SUCCESS ===")
        console.log("Appointment booked successfully!")
        console.log("Appointment ID:", result.appointmentId)
        router.push("/patient/success")
      } else {
        throw new Error(result.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("=== ERROR ===")
      console.error("Error booking appointment:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
      console.log("=== FORM SUBMISSION ENDED ===")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user makes selection
    if (error) setError(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Booking Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" data-testid="quick-booking-form">
        {/* Patient Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-name">Full Name *</Label>
              <Input
                id="quick-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                data-testid="patient-name"
                className={error && !formData.name ? "border-red-300" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-email">Email *</Label>
              <Input
                id="quick-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                data-testid="patient-email"
                className={error && !formData.email ? "border-red-300" : ""}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-phone">Phone Number *</Label>
              <Input
                id="quick-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
                data-testid="patient-phone"
                className={error && !formData.phone ? "border-red-300" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-dob">Date of Birth *</Label>
              <Input
                id="quick-dob"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                data-testid="patient-dob"
                className={error && !formData.dateOfBirth ? "border-red-300" : ""}
              />
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-clinic">Select Clinic *</Label>
            <Select value={formData.clinicId} onValueChange={(value) => handleSelectChange("clinicId", value)} required>
              <SelectTrigger
                data-testid="clinic-select"
                className={error && !formData.clinicId ? "border-red-300" : ""}
              >
                <SelectValue placeholder="Choose a clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{clinic.name}</span>
                      <span className="text-sm text-gray-500">{clinic.specialization}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-date">Preferred Date *</Label>
              <Input
                id="quick-date"
                name="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                data-testid="appointment-date"
                className={error && !formData.appointmentDate ? "border-red-300" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-time">Preferred Time *</Label>
              <Input
                id="quick-time"
                name="appointmentTime"
                type="time"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                data-testid="appointment-time"
                className={error && !formData.appointmentTime ? "border-red-300" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-notes">Additional Notes</Label>
            <Textarea
              id="quick-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific concerns or requirements..."
              rows={3}
              data-testid="appointment-notes"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          data-testid="submit-appointment"
        >
          <Clock className="w-4 h-4 mr-2" />
          {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
        </Button>
      </form>
    </div>
  )
}
