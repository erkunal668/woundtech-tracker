import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, BarChart3, Stethoscope } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Healthcare Appointment System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Book appointments with top clinics or manage your healthcare facility with our comprehensive admin
            dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Patient Portal</CardTitle>
              <CardDescription>Browse clinics and book appointments with ease</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="w-4 h-4" />
                  <span>Multiple Specializations</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Easy Registration</span>
                </div>
              </div>
              <Link href="/patient">
                <Button size="lg" className="w-full">
                  Book Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>Analyze appointment data and manage your healthcare system</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>Advanced Analytics</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Patient Management</span>
                </div>
              </div>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Patient Visit Tracker
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Why Choose Our System?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600 text-sm">Book appointments in just a few clicks</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Clinics</h3>
              <p className="text-gray-600 text-sm">Choose from various specializations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Data Insights</h3>
              <p className="text-gray-600 text-sm">Comprehensive analytics for admins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
