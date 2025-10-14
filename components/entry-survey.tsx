"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function EntrySurvey() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState<string>("")

  useEffect(() => {
    // Check if user has already answered the entry survey today
    const lastSurvey = localStorage.getItem("entry_survey_date")
    const today = new Date().toDateString()

    if (lastSurvey !== today) {
      // Show survey after 2 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = () => {
    if (!selectedReason) return

    // Save survey response
    const response = {
      type: "entry",
      reason: selectedReason,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage (later can be sent to database)
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
    surveys.push(response)
    localStorage.setItem("surveys", JSON.stringify(surveys))
    localStorage.setItem("entry_survey_date", new Date().toDateString())

    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-2">Bienvenido a SIMAR-EPA</h3>
        <p className="text-sm text-muted-foreground mb-6">¿Qué información está buscando hoy?</p>

        <div className="space-y-3">
          {[
            "Condiciones actuales del mar",
            "Planificación de actividades marítimas",
            "Monitoreo de seguridad portuaria",
            "Investigación o estudio",
            "Otro",
          ].map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedReason === reason
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "border-border hover:border-blue-300"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={!selectedReason} className="w-full mt-6">
          Continuar
        </Button>
      </Card>
    </div>
  )
}
