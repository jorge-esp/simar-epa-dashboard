"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Star } from "lucide-react"

export function ExitSurvey() {
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")

  useEffect(() => {
    // Show exit survey when user tries to leave or after 5 minutes
    const handleBeforeUnload = () => {
      const hasAnswered = sessionStorage.getItem("exit_survey_answered")
      if (!hasAnswered) {
        setIsOpen(true)
      }
    }

    // Show after 5 minutes if not answered
    const timer = setTimeout(() => {
      const hasAnswered = sessionStorage.getItem("exit_survey_answered")
      if (!hasAnswered) {
        setIsOpen(true)
      }
    }, 300000) // 5 minutes

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = () => {
    if (rating === 0) return

    // Save survey response
    const response = {
      type: "exit",
      rating,
      feedback,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage (later can be sent to database)
    const surveys = JSON.parse(localStorage.getItem("surveys") || "[]")
    surveys.push(response)
    localStorage.setItem("surveys", JSON.stringify(surveys))
    sessionStorage.setItem("exit_survey_answered", "true")

    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 relative">
        <button
          onClick={() => {
            sessionStorage.setItem("exit_survey_answered", "true")
            setIsOpen(false)
          }}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold mb-2">¿Le fue útil la información?</h3>
        <p className="text-sm text-muted-foreground mb-6">Su opinión nos ayuda a mejorar el servicio</p>

        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Califique su experiencia:</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-10 w-10 ${
                    star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Poco útil</span>
            <span>Muy útil</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Comentarios (opcional):</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="¿Qué podríamos mejorar?"
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
          Enviar Evaluación
        </Button>
      </Card>
    </div>
  )
}
