"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MapPin, Clock, AlertTriangle, Info, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Report = {
  id: string
  user_name: string
  report_type: string
  description: string
  location: string | null
  severity: "info" | "precaucion" | "alerta"
  created_at: string
  confirmations: number
  status: string
}

const reportTypeLabels: Record<string, string> = {
  condiciones_mar: "Condiciones del Mar",
  visibilidad: "Visibilidad y Clima",
  seguridad: "Seguridad",
  actividad_portuaria: "Actividad Portuaria",
  otro: "Otro",
}

const severityConfig = {
  info: { icon: Info, color: "bg-blue-500", label: "Información" },
  precaucion: { icon: AlertTriangle, color: "bg-yellow-500", label: "Precaución" },
  alerta: { icon: AlertCircle, color: "bg-red-500", label: "Alerta" },
}

export function CommunityReportsFeed() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmingIds, setConfirmingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchReports()

    // Configurar suscripción en tiempo real
    const supabase = createClient()
    const channel = supabase
      .channel("community_reports_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_reports",
        },
        () => {
          console.log("[v0] Actualización en tiempo real recibida, cargando reportes")
          fetchReports()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchReports = async () => {
    try {
      console.log("[v0] Cargando reportes de la comunidad...")
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("community_reports")
        .select("*")
        .eq("status", "activo")
        .order("created_at", { ascending: false })
        .limit(20)

      if (fetchError) {
        console.error("[v0] Error al cargar reportes:", fetchError)
        if (fetchError.code === "42P01") {
          setError(
            "La tabla de reportes no existe. Por favor, ejecuta el script SQL '001_create_community_reports.sql' desde la carpeta 'scripts'.",
          )
        } else {
          setError(`Error al cargar reportes: ${fetchError.message}`)
        }
        setReports([])
      } else {
        console.log("[v0] Reportes cargados con éxito:", data?.length || 0, "reportes")
        setReports(data || [])
        setError(null)
      }
    } catch (err) {
      console.error("[v0] Error inesperado al cargar reportes:", err)
      setError("Error inesperado al cargar reportes. Verifica la conexión con Supabase.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async (reportId: string) => {
    setConfirmingIds((prev) => new Set(prev).add(reportId))

    const supabase = createClient()
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    const { error: updateError } = await supabase
      .from("community_reports")
      .update({ confirmations: report.confirmations + 1 })
      .eq("id", reportId)

    if (updateError) {
      console.error("[v0] Error al confirmar el reporte:", updateError)
    } else {
      console.log("[v0] Reporte confirmado con éxito")
      // Actualizar estado local
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, confirmations: r.confirmations + 1 } : r)))
    }

    setConfirmingIds((prev) => {
      const next = new Set(prev)
      next.delete(reportId)
      return next
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Cargando reportes...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <p className="font-semibold text-red-600 mb-2">Error al cargar reportes</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">
            No hay reportes activos. Sé el primero en compartir tus observaciones.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => {
        const SeverityIcon = severityConfig[report.severity].icon
        const severityColor = severityConfig[report.severity].color

        return (
          <Card key={report.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full ${severityColor} text-white`}>
                    <SeverityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold">{reportTypeLabels[report.report_type]}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{report.user_name}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(new Date(report.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                      {report.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{report.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{severityConfig[report.severity].label}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{report.description}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConfirm(report.id)}
                  disabled={confirmingIds.has(report.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>Confirmar</span>
                  {report.confirmations > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {report.confirmations}
                    </Badge>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
