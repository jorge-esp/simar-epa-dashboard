"use client"

import { WindSpeedChart } from "@/components/wind-speed-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function WindSpeedPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Velocidad del Viento</h1>
          <p className="text-muted-foreground">Monitoreo de la velocidad del viento en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <WindSpeedChart timeRange={timeRange} />
    </div>
  )
}
