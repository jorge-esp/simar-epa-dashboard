"use client"

import { PressureChart } from "@/components/pressure-chart"
import { TimeRangeSelector, type TimeRange } from "@/components/time-range-selector"
import { useState } from "react"

export default function PressurePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Presión Atmosférica</h1>
          <p className="text-muted-foreground">Monitoreo de la presión atmosférica en tiempo real</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>
      <PressureChart timeRange={timeRange} />
    </div>
  )
}
