"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Maximize2, Waves, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useSWR from "swr"
import { fetchWaveCount } from "@/lib/api-client"
import type { TimeRange } from "@/components/time-range-selector"

interface WaveCountChartProps {
  timeRange: TimeRange
}

const fetcher = async (timeRange: TimeRange) => {
  const response = await fetchWaveCount(timeRange)

  const useDate = timeRange === "48h" || timeRange === "7d"

  const chartData = response.data
    .map((item) => {
      const date = new Date(item.timestamp)
      return {
        time: useDate
          ? date.toLocaleDateString("es-CL", { day: "numeric", month: "short" })
          : date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false }),
        fullTime: date.toLocaleString("es-CL", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        cantidad: Number(item.value),
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
        <p className="text-sm text-purple-600 font-medium mt-1">Cantidad: {payload[0].value} olas</p>
      </div>
    )
  }
  return null
}

export function WaveCountChart({ timeRange }: WaveCountChartProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(["wave-count-data", timeRange], () => fetcher(timeRange), {
    refreshInterval: 60000,
  })

  const currentValue = response?.data[response.data.length - 1]?.cantidad
  const averageValue = response?.data.length
    ? response.data.reduce((sum, item) => sum + item.cantidad, 0) / response.data.length
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
          label={{ value: "Olas", angle: -90, position: "insideLeft", style: { fill: "#6b7280", fontSize: 12 } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="cantidad" stroke="#a855f7" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Waves className="h-5 w-5" />
              Cantidad de Olas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">actualizado {response?.lastUpdate || "--:--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <Badge variant="secondary" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Actual:</span>
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="font-semibold">{currentValue?.toFixed(0) || "--"} olas</span>
                <ArrowUpRight className="w-3 h-3" />
              </Badge>
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <span className="text-xs text-muted-foreground">Promedio:</span>
                <span className="font-semibold">{averageValue?.toFixed(0) || "--"} olas</span>
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
                  <DialogTitle>Cantidad de Olas - Vista Detallada</DialogTitle>
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
