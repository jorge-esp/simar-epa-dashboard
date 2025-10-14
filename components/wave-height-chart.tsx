"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import { ArrowUpRight, Maximize2, AlertTriangle, Waves } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import useSWR from "swr"
import { fetchWaveHeight } from "@/lib/api-client"

const fetcher = async () => {
  const response = await fetchWaveHeight()

  const chartData = response.data
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      altura: Number(item.value),
    }))
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
        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.time}</p>
        <p className="text-sm text-cyan-600 font-medium mt-1">Altura: {payload[0].value.toFixed(2)} m</p>
      </div>
    )
  }
  return null
}

export function WaveHeightChart() {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR("wave-data", fetcher, {
    refreshInterval: 60000,
  })

  const currentValue = response?.data[response.data.length - 1]?.altura
  const isRisky = currentValue && currentValue > 1.75

  const ChartComponent = ({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 2]} tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={1.75}
          stroke="#ef4444"
          strokeDasharray="5 5"
          strokeWidth={2}
          label={{ value: "Umbral 1.75m", position: "right", fill: "#ef4444", fontSize: 11 }}
        />
        <Line type="monotone" dataKey="altura" stroke="#06b6d4" strokeWidth={2} dot={false} />
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
              Altura de Olas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">actualizado {response?.lastUpdate || "--:--"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span className="font-semibold">{currentValue?.toFixed(2) || "--"} m</span>
              <ArrowUpRight className="w-3 h-3" />
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="rounded-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Altura de Olas - Vista Detallada</DialogTitle>
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
        {isRisky && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Altura riesgosa</AlertTitle>
            <AlertDescription>
              La altura de las olas ha superado el umbral de seguridad de 1.75 metros.
            </AlertDescription>
          </Alert>
        )}
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
