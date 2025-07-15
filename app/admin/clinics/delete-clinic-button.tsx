"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteClinicButtonProps {
  clinicId: number
  clinicName: string
}

export default function DeleteClinicButton({ clinicId, clinicName }: DeleteClinicButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${clinicName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/clinics/${clinicId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.refresh()
        alert("Clinic deleted successfully!")
      } else {
        const result = await response.json()
        alert(result.error || "Failed to delete clinic. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting clinic:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
      data-testid="delete-clinic"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
