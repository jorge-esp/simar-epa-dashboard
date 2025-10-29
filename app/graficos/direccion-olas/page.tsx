"use client"

import { WaveDirectionChart } from "@/components/wave-direction-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function WaveDirectionPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dirección y Dispersión de Olas</h1>
          <p className="text-muted-foreground">Monitoreo de la dirección y dispersión direccional de las olas</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <WaveDirectionChart timeRange={timeRange} />
    </div>
  )
}
