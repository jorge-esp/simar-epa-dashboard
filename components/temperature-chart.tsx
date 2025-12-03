"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { ArrowUpRight, Maximize2, Thermometer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useSWR from "swr"
import { fetchAirTemperature } from "@/lib/api-client"
import type { TimeRange } from "@/components/time-range-selector"
import { formatChileDate, formatChileDateTime, formatChileTimeOnly, shouldShowDate } from "@/lib/timezone-utils"

interface TemperatureChartProps {
  timeRange: TimeRange
}

const fetcher = async (timeRange: TimeRange) => {
  const response = await fetchAirTemperature(timeRange)

  const useDate = shouldShowDate(timeRange)

  const chartData = response.data
    .map((item) => {
      const timestamp = item.timestamp
      return {
        time: useDate ? formatChileDate(timestamp) : formatChileTimeOnly(timestamp),
        fullTime: formatChileDateTime(timestamp),
        temperatura: Number(item.value),
      }
    })
    .reverse()

  return {
    lastUpdate: response.lastUpdate,
    data: chartData,
  }
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.fullTime}</p>
        <p className="text-sm text-orange-600 font-medium mt-1">Temperatura: {payload[0].value.toFixed(1)} °C</p>
      </div>
    )
  }
  return null
}

export function TemperatureChart({ timeRange }: TemperatureChartProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(["temp-data", timeRange], () => fetcher(timeRange), {
    refreshInterval: 600000,
  })

  const currentValue = response?.data[response.data.length - 1]?.temperatura
  const averageValue = response?.data.length
    ? response.data.reduce((sum, item) => sum + item.temperatura, 0) / response.data.length
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
            value: "Temperatura (°C)",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#6b7280", fontSize: 12 },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="temperatura" stroke="#f97316" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperatura del Aire
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">actualizado {response?.lastUpdate || "--:--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Actual:</span>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="font-semibold">{currentValue?.toFixed(1) || "--"} °C</span>
                <ArrowUpRight className="w-3 h-3" />
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Promedio:</span>
                <span className="font-semibold">{averageValue?.toFixed(1) || "--"} °C</span>
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
                  <DialogTitle>Temperatura del Aire - Vista Detallada</DialogTitle>
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
