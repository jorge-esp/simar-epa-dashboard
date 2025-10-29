"use client"

import { WaveHeightChart } from "@/components/wave-height-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function WaveHeightPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Altura de Olas</h1>
          <p className="text-muted-foreground">Monitoreo de la altura de las olas en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <WaveHeightChart timeRange={timeRange} />
    </div>
  )
}
