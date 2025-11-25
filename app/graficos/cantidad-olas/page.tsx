"use client"

import { WaveCountChart } from "@/components/wave-count-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WaveCountPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Cantidad de Olas</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Monitoreo de la cantidad de olas en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <WaveCountChart timeRange={timeRange} />

      <Alert variant="destructive">
        <span>⚠️</span>
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Mayor cantidad de olas significa mar más agitado</li>
            <li>Combina esta información con altura y dirección de olas para mejor evaluación</li>
            <li>Siempre verifica múltiples parámetros antes de salir al mar</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
