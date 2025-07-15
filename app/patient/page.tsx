import { clinicQueries } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Stethoscope, Calendar } from "lucide-react"
import Link from "next/link"
import QuickBookingForm from "./quick-booking-form"

export default function PatientPage() {
  const clinics = clinicQueries.getAll()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Choose a clinic or use the quick booking form below</p>
        </div>

        {/* Quick Booking Form */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Calendar className="w-5 h-5" />
                Quick Booking Form
              </CardTitle>
              <CardDescription className="text-blue-700">
                Fill out the form below to book an appointment with your preferred clinic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickBookingForm clinics={clinics} />
            </CardContent>
          </Card>
        </div>

        {/* Clinic List */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Clinics</h2>
          <p className="text-gray-600 mb-6">Browse our partner clinics and book directly</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{clinic.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      {clinic.specialization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{clinic.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span>{clinic.email}</span>
                  </div>
                </div>
                <Link href={`/patient/book/${clinic.id}`}>
                  <Button className="w-full bg-transparent" variant="outline">
                    Book with {clinic.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
