"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useSWR from "swr"
import { fetchWindSpeed } from "@/lib/api-client"
import type { TimeRange } from "@/components/time-range-selector"
import { formatChileDate, formatChileDateTime, formatChileTimeOnly, shouldShowDate } from "@/lib/timezone-utils"
import { WindIcon, ExpandIcon } from "@/components/icons"

interface WindSpeedChartProps {
  timeRange: TimeRange
}

const fetcher = async (timeRange: TimeRange) => {
  const response = await fetchWindSpeed(timeRange)

  const useDate = shouldShowDate(timeRange)

  const chartData = response.data
    .map((item: any) => {
      const timestamp = item.timestamp
      return {
        time: useDate ? formatChileDate(timestamp) : formatChileTimeOnly(timestamp),
        fullTime: formatChileDateTime(timestamp),
        velocidad: Number(item.value),
        rafaga: item.gustValue ? Number(item.gustValue) : null,
      }
    })
    .reverse()

  return {
    lastUpdate: response.lastUpdate,
    data: chartData,
    currentGustValue: response.currentGustValue,
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.fullTime}</p>
        <p className="text-sm text-green-600 font-medium mt-1">Viento: {payload[0].value.toFixed(1)} m/s</p>
        {payload[1]?.value && (
          <p className="text-sm text-orange-600 font-medium">Ráfaga: {payload[1].value.toFixed(1)} m/s</p>
        )}
      </div>
    )
  }
  return null
}

export function WindSpeedChart({ timeRange }: WindSpeedChartProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(["wind-data", timeRange], () => fetcher(timeRange), {
    refreshInterval: 600000,
  })

  const currentValue = response?.data[response.data.length - 1]?.velocidad
  const currentGustValue = response?.data[response.data.length - 1]?.rafaga
  const averageValue = response?.data.length
    ? response.data.reduce((sum: number, item: any) => sum + item.velocidad, 0) / response.data.length
    : undefined

  const ChartComponent = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Velocidad (m/s)",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#6b7280", fontSize: 12 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => <span className="text-sm">{value === "velocidad" ? "Viento" : "Ráfaga"}</span>}
        />
        {/* Línea de velocidad del viento */}
        <Line type="monotone" dataKey="velocidad" name="velocidad" stroke="#10b981" strokeWidth={2} dot={false} />
        {/* Línea de velocidad de ráfaga */}
        <Line
          type="monotone"
          dataKey="rafaga"
          name="rafaga"
          stroke="#f97316"
          strokeWidth={2}
          dot={false}
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <WindIcon size={20} />
              Velocidad del Viento y Ráfagas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">actualizado {response?.lastUpdate || "--:--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Viento:</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-semibold">{currentValue?.toFixed(1) || "--"} m/s</span>
              </Badge>
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Ráfaga:</span>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="font-semibold">{currentGustValue?.toFixed(1) || "--"} m/s</span>
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Promedio:</span>
                <span className="font-semibold">{averageValue?.toFixed(1) || "--"} m/s</span>
              </Badge>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                  <ExpandIcon size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Velocidad del Viento y Ráfagas - Vista Detallada</DialogTitle>
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
