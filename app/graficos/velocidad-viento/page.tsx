"use client"

import { WindSpeedChart } from "@/components/wind-speed-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WindRose } from "@/components/wind-rose"

export default function WindSpeedPage() {
  // Estado para el rango de tiempo seleccionado (12h, 24h, 48h, 7d)
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  // Hook SWR para obtener datos de dirección del viento en tiempo real
  // Se actualiza automáticamente cada 2 minutos (120000ms)
  const { data: currentData } = useSWR(
    "/api/buoy/wind-direction",
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) return null
      return response.json()
    },
    { refreshInterval: 120000 },
  )

  // Extraer dirección y velocidad actuales de los datos
  const currentDirection = currentData?.direction || 0
  const currentSpeed = currentData?.speed || 0

  return (
    // Contenedor principal con espacio vertical entre elementos (responsive)
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y selector de rango de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          {/* Título principal responsive */}
          <h1 className="text-2xl sm:text-3xl font-bold">Velocidad del Viento</h1>
          {/* Descripción responsive */}
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la velocidad del viento en tiempo real
          </p>
        </div>
        {/* Selector de rango de tiempo (12h, 24h, 48h, 7d) */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Tarjeta de interpretación */}
      <Card className="bg-card border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
            <span className="text-green-500">ℹ️</span>
            Cómo Interpretar la Velocidad del Viento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Explicación de qué observar */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Qué observar:</strong> Velocidad sostenida y ráfagas
            </p>
            {/* Lista de interpretaciones con códigos de colores */}
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
        {/* Rosa de los vientos (1 columna en desktop) - IZQUIERDA */}
        <div className="lg:col-span-1">
          {/* Componente visual que muestra la dirección actual del viento */}
          <WindRose direction={currentDirection} label="Dirección Actual del Viento" size="lg" />
          {/* Mostrar velocidad actual si está disponible */}
          {currentSpeed !== undefined && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Velocidad: <span className="font-semibold text-foreground">{currentSpeed.toFixed(1)} m/s</span>
              </p>
              {/* Interpretación automática de la velocidad */}
              <p className="text-xs text-muted-foreground mt-1">
                {currentSpeed < 5
                  ? "Brisa ligera"
                  : currentSpeed < 10
                    ? "Brisa moderada"
                    : currentSpeed < 15
                      ? "Viento fresco"
                      : currentSpeed < 20
                        ? "Viento fuerte"
                        : "Temporal"}
              </p>
            </div>
          )}
        </div>
        {/* Gráfico de línea temporal (2 columnas en desktop) - DERECHA */}
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
