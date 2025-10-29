"use client"

import { TemperatureChart } from "@/components/temperature-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function TemperaturePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Temperatura del Agua</h1>
          <p className="text-muted-foreground">Monitoreo de la temperatura del agua en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <TemperatureChart timeRange={timeRange} />
    </div>
  )
}
