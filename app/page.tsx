"use client"

import { Waves, MapPin, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { BuoyStatus } from "@/components/buoy-status"

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-xl overflow-hidden">
        <img src="/simar-epa-buoy.png" alt="Boya Oceanográfica Puerto Arica" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Sistema de Información Marítima</h1>
          <p className="text-lg text-white drop-shadow-lg">Monitoreo en tiempo real de condiciones oceanográficas</p>
        </div>
      </div>

      {/* Buoy Status Component */}
      <BuoyStatus />

      {/* Description Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-lg">
                <Waves className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Monitoreo Continuo</h3>
                <p className="text-sm text-muted-foreground">
                  Datos oceanográficos en tiempo real las 24 horas del día, los 7 días de la semana.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ubicación Estratégica</h3>
                <p className="text-sm text-muted-foreground">Boya ubicada a un 1 km del puerto de la ciudad de Arica</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Histórico de Datos</h3>
                <p className="text-sm text-muted-foreground">
                  Acceso a datos históricos para análisis de tendencias y patrones climáticos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4">Acerca del Sistema SIMAR-EPA</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              El Sistema de Información Marítima de la Empresa Portuaria Arica (SIMAR-EPA) es una plataforma de
              monitoreo oceanográfico que proporciona datos en tiempo real sobre las condiciones marítimas en la bahía
              de Arica.
            </p>
            <p>
              La boya oceanográfica está equipada con sensores de última generación que miden parámetros críticos como
              altura de olas, velocidad del viento, temperatura del agua, presión atmosférica y frecuencia de oleaje.
              Esta información es fundamental para la seguridad de las operaciones portuarias y la navegación marítima.
            </p>
            <p>
              Los datos recopilados son procesados y visualizados en tiempo real, permitiendo a los operadores
              portuarios, capitanes de barco y autoridades marítimas tomar decisiones informadas basadas en las
              condiciones actuales del mar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-cyan-500 mb-1">24/7</div>
            <div className="text-sm text-muted-foreground">Monitoreo Continuo</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-1">6</div>
            <div className="text-sm text-muted-foreground">Parámetros Medidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">2min</div>
            <div className="text-sm text-muted-foreground">Actualización</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-1">100%</div>
            <div className="text-sm text-muted-foreground">Precisión</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
