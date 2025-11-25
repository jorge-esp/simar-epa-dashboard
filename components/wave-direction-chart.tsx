"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ArrowUpRight, Maximize2, Navigation } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useSWR from "swr"
import type { TimeRange } from "@/components/time-range-selector"
import { formatChileDate, formatChileDateTime, formatChileTimeOnly, shouldShowDate } from "@/lib/timezone-utils"

interface WaveDirectionChartProps {
  timeRange: TimeRange
}

interface WaveDirectionData {
  timestamp: string
  direction: number
  spread: number
}

interface ApiResponse {
  data: WaveDirectionData[]
  lastUpdate: string
  currentValue: {
    direction: number
    spread: number
  }
}

const fetcher = async (url: string, timeRange: TimeRange): Promise<any> => {
  console.log("[v0] Fetching wave direction data for range:", timeRange)

  const response = await fetch(`${url}?range=${timeRange}`)

  if (!response.ok) {
    console.error("[v0] API error:", response.status)
    throw new Error(`API error: ${response.status}`)
  }

  const apiResponse: ApiResponse = await response.json()

  console.log("[v0] Wave direction data received, points:", apiResponse.data?.length || 0)

  const useDate = shouldShowDate(timeRange)

  const chartData = apiResponse.data
    .map((item) => {
      const timestamp = item.timestamp
      return {
        time: useDate ? formatChileDate(timestamp) : formatChileTimeOnly(timestamp),
        fullTime: formatChileDateTime(timestamp),
        direccion: item.direction,
        dispersion: item.spread,
      }
    })
    .reverse()

  console.log("[v0] Chart data transformed, points:", chartData.length)

  return {
    lastUpdate: apiResponse.lastUpdate,
    data: chartData,
    currentValue: apiResponse.currentValue,
  }
}

// Convertir grados a dirección cardinal
const getCardinalDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
  const index = Math.round(degrees / 45) % 8
  return directions[index]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.fullTime}</p>
        <p className="text-sm text-blue-600 font-medium mt-1">
          Dirección: {payload[0].value.toFixed(1)}° ({getCardinalDirection(payload[0].value)})
        </p>
        <p className="text-sm text-orange-600 font-medium">Dispersión: {payload[1].value.toFixed(1)}°</p>
      </div>
    )
  }
  return null
}

export function WaveDirectionChart({ timeRange }: WaveDirectionChartProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(["/api/buoy/wave-direction", timeRange], ([url, range]) => fetcher(url, range), {
    refreshInterval: 120000, // Update every 2 minutes
  })

  const currentDirection = response?.currentValue?.direction
  const currentSpread = response?.currentValue?.spread
  const averageDirection = response?.data.length
    ? response.data.reduce((sum, item) => sum + item.direccion, 0) / response.data.length
    : undefined

  const ChartComponent = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={[0, 360]}
          ticks={[0, 90, 180, 270, 360]}
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Grados (°)", angle: -90, position: "insideLeft", style: { fill: "#6b7280", fontSize: 12 } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="direccion" stroke="#3b82f6" strokeWidth={2} dot={false} name="Dirección (°)" />
        <Line type="monotone" dataKey="dispersion" stroke="#f97316" strokeWidth={2} dot={false} name="Dispersión (°)" />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Dirección y Dispersión de Olas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">actualizado {response?.lastUpdate || "--:--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Dirección:</span>
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-semibold">
                  {currentDirection?.toFixed(0) || "--"}° (
                  {currentDirection ? getCardinalDirection(currentDirection) : "--"})
                </span>
                <ArrowUpRight className="w-3 h-3" />
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Dispersión:</span>
                <span className="font-semibold">{currentSpread?.toFixed(1) || "--"}°</span>
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Promedio:</span>
                <span className="font-semibold">
                  {averageDirection?.toFixed(0) || "--"}° (
                  {averageDirection ? getCardinalDirection(averageDirection) : "--"})
                </span>
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Dirección y Dispersión de Olas - Vista Detallada</DialogTitle>
                </DialogHeader>
                <div className="h-[500px]">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Cargando datos...
                    </div>
                  ) : error ? (
                    <div className="h-full flex items-center justify-center text-destructive">
                      Error al cargar datos
                    </div>
                  ) : response?.data ? (
                    <ChartComponent data={response.data} />
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">Cargando datos...</div>
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center text-destructive">Error al cargar datos</div>
        ) : response?.data ? (
          <div className="h-[300px]">
            <ChartComponent data={response.data} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
