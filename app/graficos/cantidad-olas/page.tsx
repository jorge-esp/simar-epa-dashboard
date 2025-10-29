"use client"

import { WaveCountChart } from "@/components/wave-count-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function WaveCountPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cantidad de Olas</h1>
          <p className="text-muted-foreground">Monitoreo de la cantidad de olas en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <WaveCountChart timeRange={timeRange} />
    </div>
  )
}
