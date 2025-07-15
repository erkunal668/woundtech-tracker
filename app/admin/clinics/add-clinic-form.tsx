"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, MapPin, Phone, Mail, Stethoscope } from "lucide-react"

const specializations = [
  "General Medicine",
  "Cardiology",
  "Dentistry",
  "Ophthalmology",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Psychiatry",
  "Gynecology",
  "Urology",
  "ENT",
  "Oncology",
  "Radiology",
  "Anesthesiology",
]

export default function AddClinicForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    specialization: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/clinics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        // Reset form
        setFormData({
          name: "",
          address: "",
          phone: "",
          email: "",
          specialization: "",
        })
        // Refresh the page to show the new clinic
        router.refresh()
        alert("Clinic added successfully!")
      } else {
        alert(result.error || "Failed to add clinic. Please try again.")
      }
    } catch (error) {
      console.error("Error adding clinic:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      specialization: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="add-clinic-form">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clinic-name" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Clinic Name *
          </Label>
          <Input
            id="clinic-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter clinic name"
            required
            data-testid="clinic-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-specialization" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Specialization *
          </Label>
          <Select value={formData.specialization} onValueChange={handleSelectChange} required>
            <SelectTrigger data-testid="clinic-specialization">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clinic-address" className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Address *
        </Label>
        <Input
          id="clinic-address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter full address"
          required
          data-testid="clinic-address"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clinic-phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number *
          </Label>
          <Input
            id="clinic-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            required
            data-testid="clinic-phone"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinic-email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </Label>
          <Input
            id="clinic-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="clinic@example.com"
            required
            data-testid="clinic-email"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700"
        data-testid="submit-clinic"
      >
        {isSubmitting ? "Adding Clinic..." : "Add Clinic"}
      </Button>
    </form>
  )
}
