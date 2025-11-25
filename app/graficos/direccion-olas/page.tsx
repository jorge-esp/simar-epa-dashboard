"use client"

import { WaveDirectionChart } from "@/components/wave-direction-chart"
import { WindRose } from "@/components/wind-rose"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WaveDirectionPage() {
  // Estado para el rango de tiempo seleccionado (12h, 24h, 48h, 7d)
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  // Hook SWR para obtener datos de dirección de olas en tiempo real
  // Se actualiza automáticamente cada 2 minutos (120000ms)
  const { data: currentData } = useSWR(
    "/api/buoy/wave-direction?range=24h",
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) return null
      return response.json()
    },
    { refreshInterval: 120000 },
  )

  // Extraer dirección y dispersión actuales de los datos
  const currentDirection = currentData?.currentValue?.direction || 0
  const currentSpread = currentData?.currentValue?.spread

  return (
    // Contenedor principal con espacio vertical entre elementos (responsive)
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y selector de rango de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          {/* Título principal responsive */}
          <h1 className="text-2xl sm:text-3xl font-bold">Dirección y Dispersión de Olas</h1>
          {/* Descripción responsive */}
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la dirección y dispersión direccional de las olas
          </p>
        </div>
        {/* Selector de rango de tiempo (12h, 24h, 48h, 7d) */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <Card className="bg-card border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
            <span className="text-orange-500">ℹ️</span>
            Cómo Interpretar la Dirección y Dispersión de Olas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Explicación de qué observar */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Qué observar:</strong> Dirección predominante y dispersión
            </p>
            {/* Lista de interpretaciones con códigos de colores */}
            <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4">
              <li>
                <strong className="text-foreground">Dirección:</strong> Indica de dónde vienen las olas (0°=N, 90°=E,
                180°=S, 270°=O)
              </li>
              <li>
                <strong className="text-green-600">Dispersión &lt;20°:</strong> Olas muy ordenadas, swell limpio
              </li>
              <li>
                <strong className="text-yellow-600">Dispersión 20-40°:</strong> Olas moderadamente ordenadas
              </li>
              <li>
                <strong className="text-red-600">Dispersión &gt;40°:</strong> Mar confuso, olas de múltiples direcciones
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Grid responsive: 1 columna en móvil, 3 columnas en desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Rosa de los vientos (1 columna en desktop) */}
        <div className="lg:col-span-1">
          {/* Componente visual que muestra la dirección actual de las olas */}
          <WindRose direction={currentDirection} label="Dirección Actual de Olas" size="lg" />
          {/* Mostrar dispersión y su interpretación si está disponible */}
          {currentSpread !== undefined && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Dispersión: <span className="font-semibold text-foreground">{currentSpread.toFixed(1)}°</span>
              </p>
              {/* Interpretación automática de la dispersión */}
              <p className="text-xs text-muted-foreground mt-1">
                {currentSpread < 20
                  ? "Olas muy ordenadas"
                  : currentSpread < 40
                    ? "Olas moderadamente ordenadas"
                    : "Mar confuso"}
              </p>
            </div>
          )}
        </div>
        {/* Gráfico de línea temporal (2 columnas en desktop) */}
        <div className="lg:col-span-2">
          <WaveDirectionChart timeRange={timeRange} />
        </div>
      </div>

      <Alert variant="destructive">
        <span>⚠️</span>
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Mar confuso (alta dispersión) es más peligroso que olas altas ordenadas</li>
            <li>Olas de múltiples direcciones dificultan la navegación</li>
            <li>Siempre verifica múltiples parámetros antes de salir al mar</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
