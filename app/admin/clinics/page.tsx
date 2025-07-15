import { clinicQueries } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Phone, Mail, Stethoscope, Plus, Edit } from "lucide-react"
import Link from "next/link"
import AddClinicForm from "./add-clinic-form"
import DeleteClinicButton from "./delete-clinic-button"

export default function ClinicsManagementPage() {
  const clinics = clinicQueries.getAll()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinic Management</h1>
          <p className="text-gray-600">Add, edit, and manage healthcare clinics</p>
        </div>

        {/* Add New Clinic Form */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Plus className="w-5 h-5" />
              Add New Clinic
            </CardTitle>
            <CardDescription className="text-green-700">
              Register a new healthcare provider to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddClinicForm />
          </CardContent>
        </Card>

        {/* Existing Clinics */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Existing Clinics ({clinics.length})</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      {clinic.name}
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Stethoscope className="w-3 h-3 mr-1" />
                      {clinic.specialization}
                    </Badge>
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

                <div className="flex gap-2">
                  <Link href={`/admin/clinics/edit/${clinic.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <DeleteClinicButton clinicId={clinic.id} clinicName={clinic.name} />
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Added: {new Date(clinic.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clinics.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clinics Found</h3>
              <p className="text-gray-600">Add your first clinic using the form above.</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
