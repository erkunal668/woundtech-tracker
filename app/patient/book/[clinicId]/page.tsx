import { clinicQueries } from "@/lib/database"
import { notFound } from "next/navigation"
import BookingForm from "./booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Stethoscope } from "lucide-react"

interface BookingPageProps {
  params: {
    clinicId: string
  }
}

export default function BookingPage({ params }: BookingPageProps) {
  const clinicId = Number.parseInt(params.clinicId)
  const clinic = clinicQueries.getById(clinicId)

  if (!clinic) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Appointment</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">{clinic.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                {clinic.specialization}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
            </CardContent>
          </Card>

          <BookingForm clinic={clinic} />
        </div>
      </div>
    </div>
  )
}
