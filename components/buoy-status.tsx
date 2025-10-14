"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MapPin, AlertTriangle, Anchor } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function BuoyStatus() {
  const { data: status, error } = useSWR("/api/buoy/status", fetcher, {
    refreshInterval: 60000, // Update every 60 seconds
  })

  const isOperational = status && !error
  const hasAlarms = status?.alarms && status.alarms > 0

  const formatCoordinate = (lat: number | null, lon: number | null) => {
    if (!lat || !lon) return "Cargando..."
    const latDir = lat < 0 ? "S" : "N"
    const lonDir = lon < 0 ? "W" : "E"
    const latDeg = Math.abs(lat).toFixed(5)
    const lonDeg = Math.abs(lon).toFixed(5)
    return `${latDeg}°${latDir}, ${lonDeg}°${lonDir}`
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-card border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg overflow-hidden bg-primary/10">
              <Image src="/images/boya-arica.png" alt="Boya Arica" width={48} height={48} className="object-cover" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-card-foreground">Boya Arica</CardTitle>
              <p className="text-sm text-muted-foreground font-mono">BOYA-EPA-01</p>
            </div>
          </div>
          <Badge
            variant={hasAlarms ? "destructive" : "default"}
            className={hasAlarms ? "" : "bg-accent text-accent-foreground px-4 py-1"}
          >
            {hasAlarms ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Alerta
              </>
            ) : isOperational ? (
              <>
                <Activity className="w-3 h-3 mr-1" />
                Operativa
              </>
            ) : (
              <>
                <Activity className="w-3 h-3 mr-1" />
                Cargando...
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Ubicación GPS</p>
              <p className="text-sm font-medium text-foreground">
                {formatCoordinate(status?.latitude, status?.longitude)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Última actualización</p>
              <p className="text-sm font-medium text-foreground">{getCurrentTime()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Distancia del Ancla</p>
              <p className="text-sm font-medium text-foreground">
                {status?.distance ? `${status.distance.toFixed(0)} m` : "Cargando..."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
