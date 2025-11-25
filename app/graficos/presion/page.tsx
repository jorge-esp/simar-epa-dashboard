"use client"

import { PressureChart } from "@/components/pressure-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PressurePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    // Contenedor principal con espacio vertical entre elementos (responsive)
    <div className="space-y-4 sm:space-y-6">
      {/* Header con título y selector de rango de tiempo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          {/* Título principal responsive */}
          <h1 className="text-2xl sm:text-3xl font-bold">Presión Atmosférica</h1>
          {/* Descripción responsive */}
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitoreo de la presión atmosférica en tiempo real
          </p>
        </div>
        {/* Selector de rango de tiempo (12h, 24h, 48h, 7d) */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <Card className="bg-card border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
            <span className="text-purple-500">ℹ️</span>
            Cómo Interpretar la Presión Atmosférica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Explicación de qué observar */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            <p className="mb-2">
              <strong className="text-foreground">Qué observar:</strong> Tendencia de cambio (subiendo o bajando)
            </p>
            {/* Lista de rangos con códigos de colores para interpretación */}
            <ul className="list-disc list-inside space-y-1 ml-2 sm:ml-4">
              <li>
                <strong className="text-green-600">&gt;1020 hPa y subiendo:</strong> Alta presión, buen tiempo estable
              </li>
              <li>
                <strong className="text-blue-600">1013-1020 hPa:</strong> Presión normal, condiciones estables
              </li>
              <li>
                <strong className="text-yellow-600">1000-1013 hPa:</strong> Presión baja, posible cambio de tiempo
              </li>
              <li>
                <strong className="text-red-600">&lt;1000 hPa y bajando:</strong> Baja presión, mal tiempo probable
              </li>
            </ul>
            {/* Nota importante sobre caída rápida de presión */}
            <p className="mt-2">
              <strong className="text-foreground">Importante:</strong> Una caída rápida de presión (más de 3 hPa en 3
              horas) indica deterioro inminente del tiempo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de presión atmosférica con el rango de tiempo seleccionado */}
      <PressureChart timeRange={timeRange} />

      <Alert variant="destructive">
        <span>⚠️</span>
        <AlertTitle className="text-sm sm:text-base">Consejos de Seguridad</AlertTitle>
        <AlertDescription className="space-y-2 text-xs sm:text-sm">
          <ul className="list-disc list-inside space-y-1">
            <li>Una caída rápida de presión (más de 3 hPa en 3 horas) indica deterioro inminente del tiempo</li>
            <li>Siempre verifica múltiples parámetros antes de salir al mar</li>
            <li>Presión baja combinada con viento fuerte indica tormenta</li>
            <li>Consulta con personal experimentado si tienes dudas sobre las condiciones</li>
            <li>Los datos son orientativos; las condiciones locales pueden variar</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
