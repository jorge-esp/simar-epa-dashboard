"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2 } from "lucide-react"

type ReportType = "condiciones_mar" | "visibilidad" | "seguridad" | "actividad_portuaria" | "otro"
type Severity = "info" | "precaucion" | "alerta"

export function CommunityReportForm() {
  const [userName, setUserName] = useState("")
  const [reportType, setReportType] = useState<ReportType>("condiciones_mar")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [severity, setSeverity] = useState<Severity>("info")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    const supabase = createClient()

    try {
      console.log("[v0] Submitting community report...")
      const { error } = await supabase.from("community_reports").insert({
        user_name: userName || "Anónimo",
        report_type: reportType,
        description,
        location: location || null,
        severity,
      })

      if (error) {
        console.error("[v0] Error submitting report:", error)
        throw error
      }

      console.log("[v0] Report submitted successfully")
      setSubmitStatus("success")
      // Resetear formulario
      setUserName("")
      setDescription("")
      setLocation("")
      setReportType("condiciones_mar")
      setSeverity("info")

      // Resetear mensaje de éxito después de 3 segundos
      setTimeout(() => setSubmitStatus("idle"), 3000)
    } catch (error) {
      console.error("[v0] Error submitting report:", error)
      setSubmitStatus("error")
      if (error instanceof Error) {
        if (error.message.includes("42P01")) {
          setErrorMessage(
            "La tabla de reportes no existe. Por favor, ejecuta el script SQL desde la carpeta 'scripts'.",
          )
        } else {
          setErrorMessage(error.message)
        }
      } else {
        setErrorMessage("Error al enviar el reporte")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportar Condiciones</CardTitle>
        <CardDescription>Comparte tus observaciones sobre las condiciones marítimas actuales</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">Nombre (opcional)</Label>
            <Input id="userName" placeholder="Anónimo" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportType">Tipo de Reporte</Label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger id="reportType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="condiciones_mar">Condiciones del Mar</SelectItem>
                <SelectItem value="visibilidad">Visibilidad y Clima</SelectItem>
                <SelectItem value="seguridad">Seguridad</SelectItem>
                <SelectItem value="actividad_portuaria">Actividad Portuaria</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación (opcional)</Label>
            <Input
              id="location"
              placeholder="Ej: Muelle Norte, Zona de Pesca"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Nivel</Label>
            <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
              <SelectTrigger id="severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Información</SelectItem>
                <SelectItem value="precaucion">Precaución</SelectItem>
                <SelectItem value="alerta">Alerta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las condiciones que observas..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          {submitStatus === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Reporte enviado exitosamente</span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
