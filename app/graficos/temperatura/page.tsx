"use client"

import { TemperatureChart } from "@/components/temperature-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TemperaturePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Temperatura del Aire</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la temperatura del aire en tiempo real
          </p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <TemperatureChart timeRange={timeRange} />

      <Alert variant="destructive">
        <span>⚠️</span>
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Temperaturas extremas pueden afectar tu salud y la de tu embarcación</li>
            <li>Protégete del sol en días calurosos y del frío en días fríos</li>
            <li>Cambios bruscos de temperatura pueden indicar cambios climáticos</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
