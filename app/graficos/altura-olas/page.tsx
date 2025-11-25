"use client"

import { WaveHeightChart } from "@/components/wave-height-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WaveHeightPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    // Contenedor principal con espacio vertical entre elementos (responsive: gap-4 en móvil, gap-6 en desktop)
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y selector de rango de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          {/* Título principal responsive */}
          <h1 className="text-2xl sm:text-3xl font-bold">Altura Significativa de Olas (H 1/3)</h1>
          {/* Descripción responsive */}
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la altura significativa (promedio del tercio mayor) en tiempo real
          </p>
        </div>
        {/* Selector de rango de tiempo (12h, 24h, 48h, 7d) */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <Card className="bg-card border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
            <span className="text-blue-500">ℹ️</span>
            Cómo Interpretar la Altura de Olas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Explicación de qué observar */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Qué observar:</strong> Tendencia general y valores máximos
            </p>
            {/* Lista de rangos con códigos de colores para interpretación */}
            <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4">
              <li>
                <strong className="text-green-600">0-1m:</strong> Mar calmo, excelente para todas las actividades
              </li>
              <li>
                <strong className="text-blue-600">1-2m:</strong> Mar moderado, bueno para navegación
              </li>
              <li>
                <strong className="text-yellow-600">2-3m:</strong> Mar agitado, precaución para embarcaciones pequeñas
              </li>
              <li>
                <strong className="text-orange-600">3-4m:</strong> Mar grueso, solo embarcaciones grandes
              </li>
              <li>
                <strong className="text-red-600">&gt;4m:</strong> Mar muy grueso, condiciones peligrosas
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <WaveHeightChart timeRange={timeRange} />

      <Alert variant="destructive">
        <span>⚠️</span>
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Siempre verifica múltiples parámetros antes de salir al mar (olas, viento, presión)</li>
            <li>Presta atención a las tendencias, no solo a los valores actuales</li>
            <li>Si las olas están aumentando rápidamente, evita salir al mar</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
