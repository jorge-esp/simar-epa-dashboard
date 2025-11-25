"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"

export function VisitCounter() {
  const [visits, setVisits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Obtener contador de visitas actual desde localStorage
    const currentVisits = localStorage.getItem("simar-epa-visits")
    const visitCount = currentVisits ? Number.parseInt(currentVisits, 10) : 0

    // Incrementar contador de visitas
    const newVisitCount = visitCount + 1
    localStorage.setItem("simar-epa-visits", newVisitCount.toString())

    setVisits(newVisitCount)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
      <Eye className="h-4 w-4" />
      <span>Visitas: {visits.toLocaleString()}</span>
    </div>
  )
}
