"use client"

import { WindSpeedChart } from "@/components/wind-speed-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "@/components/icons"
import { WindRose } from "@/components/wind-rose"

export default function WindSpeedPage() {
  // Estado para el rango de tiempo seleccionado
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  // Hook SWR para obtener datos de dirección del viento en tiempo real
  const { data: currentData } = useSWR(
    "/api/buoy/wind-direction",
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) return null
      return response.json()
    },
    { refreshInterval: 600000 }, // Actualización cada 10 minutos (600000ms) - coincide con frecuencia de transmisión de la boya
  )

  // Extraer dirección y velocidad del viento
  const currentDirection = currentData?.direction || 0
  const currentSpeed = currentData?.speed || 0
  const gustDirection = currentData?.gustDirection || 0
  const gustSpeed = currentData?.gustSpeed || 0

  // Función para interpretar la velocidad del viento
  const interpretSpeed = (speed: number) => {
    if (speed < 5) return "Brisa ligera"
    if (speed < 10) return "Brisa moderada"
    if (speed < 15) return "Viento fresco"
    if (speed < 20) return "Viento fuerte"
    return "Temporal"
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y selector de rango de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Velocidad y Dirección del Viento</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la velocidad, dirección del viento y ráfagas en tiempo real
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Tarjeta de interpretación */}
      <Card className="bg-card border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
            <InfoIcon size={18} className="text-green-500" />
            Cómo Interpretar la Velocidad del Viento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Qué observar:</strong> Velocidad sostenida y ráfagas
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4">
              <li>
                <strong className="text-green-600">0-5 m/s (0-10 nudos):</strong> Brisa ligera
              </li>
              <li>
                <strong className="text-blue-600">5-10 m/s (10-19 nudos):</strong> Brisa moderada
              </li>
              <li>
                <strong className="text-yellow-600">10-15 m/s (19-29 nudos):</strong> Viento fresco
              </li>
              <li>
                <strong className="text-orange-600">15-20 m/s (29-39 nudos):</strong> Viento fuerte
              </li>
              <li>
                <strong className="text-red-600">&gt;20 m/s (&gt;39 nudos):</strong> Temporal
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <WindRose direction={currentDirection} label="Dirección del Viento" size="md" />

          {/* Información del viento y ráfaga debajo de la rosa */}
          <div className="mt-4 space-y-3">
            {/* Viento sostenido */}
            <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">Viento Sostenido</p>
              <p className="text-lg font-bold text-green-800 dark:text-green-200">{currentSpeed.toFixed(1)} m/s</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {interpretSpeed(currentSpeed)} - {currentDirection.toFixed(0)}°
              </p>
            </div>
            {/* Ráfaga */}
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-700 dark:text-orange-300 font-medium">Ráfaga</p>
              <p className="text-lg font-bold text-orange-800 dark:text-orange-200">{gustSpeed.toFixed(1)} m/s</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {interpretSpeed(gustSpeed)} - {gustDirection.toFixed(0)}°
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico de línea temporal con viento y ráfaga (2 columnas en desktop) */}
        <div className="lg:col-span-2">
          <WindSpeedChart timeRange={timeRange} />
        </div>
      </div>

      {/* Consejos de seguridad */}
      <Alert variant="destructive">
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Siempre verifica múltiples parámetros antes de salir al mar (olas, viento, presión)</li>
            <li>Un aumento rápido de viento indica deterioro de condiciones</li>
            <li>Vientos superiores a 15 m/s son peligrosos para embarcaciones pequeñas</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
