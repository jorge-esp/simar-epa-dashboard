/**
 * Página principal del dashboard SIMAR-EPA
 * Muestra la información general del sistema de monitoreo oceanográfico
 * incluyendo el estado de la boya, estadísticas rápidas y descripción del proyecto
 */
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BuoyStatus } from "@/components/buoy-status"

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Sección Hero: Imagen destacada con título y descripción sobrepuesta */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg sm:rounded-xl overflow-hidden">
        {/* Imagen de fondo de la boya oceanográfica oficial */}
        <img
          src="/images/boya-arica.png"
          alt="Boya Oceanográfica Puerto Arica"
          className="w-full h-full object-cover"
        />
        {/* Gradiente oscuro en la parte inferior para mejorar legibilidad del texto */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 md:p-8">
          {/* Título principal responsive: más grande en desktop, más pequeño en móvil */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
            Sistema de Información Marítima
          </h1>
          {/* Subtítulo descriptivo */}
          <p className="text-sm sm:text-base md:text-lg text-white drop-shadow-lg">
            Monitoreo en tiempo real de condiciones oceanográficas
          </p>
        </div>
      </div>

      {/* Componente de estado de la boya: muestra ubicación GPS, estado operacional y última actualización */}
      <BuoyStatus />

      {/* Tarjetas de descripción: tres características principales del sistema */}
      {/* Grid responsive: 1 columna en móvil, 3 columnas en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Tarjeta 1: Monitoreo Continuo */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Ícono con fondo de color suave */}
              <div className="p-2 sm:p-3 bg-cyan-500/10 rounded-lg flex-shrink-0">
                <span className="text-2xl sm:text-3xl">🌊</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Monitoreo Continuo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Datos oceanográficos en tiempo real las 24 horas del día, los 7 días de la semana.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta 2: Ubicación Estratégica */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg flex-shrink-0">
                <span className="text-2xl sm:text-3xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Ubicación Estratégica</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Boya ubicada a un 1 km del puerto de la ciudad de Arica
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarjeta 3: Histórico de Datos */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-orange-500/10 rounded-lg flex-shrink-0">
                <span className="text-2xl sm:text-3xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Histórico de Datos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Acceso a datos históricos para análisis de tendencias y patrones climáticos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección "Acerca de": Descripción detallada del sistema SIMAR-EPA */}
      <Card>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Acerca del Sistema SIMAR-EPA</h2>
          {/* Tres párrafos explicativos con espaciado vertical */}
          <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
            {/* Párrafo 1: Introducción al sistema */}
            <p>
              El Sistema de Información Marítima de la Empresa Portuaria Arica (SIMAR-EPA) es una plataforma de
              monitoreo oceanográfico que proporciona datos en tiempo real sobre las condiciones marítimas en la bahía
              de Arica.
            </p>
            {/* Párrafo 2: Tecnología y sensores */}
            <p>
              La boya oceanográfica está equipada con sensores de última generación que miden parámetros críticos como
              altura de olas, velocidad del viento, temperatura del agua, presión atmosférica y frecuencia de oleaje.
              Esta información es fundamental para la seguridad de las operaciones portuarias y la navegación marítima.
            </p>
            {/* Párrafo 3: Uso de los datos */}
            <p>
              Los datos recopilados son procesados y visualizados en tiempo real, permitiendo a los operadores
              portuarios, capitanes de barco y autoridades marítimas tomar decisiones informadas basadas en las
              condiciones actuales del mar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas: 4 métricas clave del sistema */}
      {/* Grid responsive: 2 columnas en móvil, 4 columnas en desktop grande */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Estadística 1: Disponibilidad 24/7 */}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-500 mb-1">24/7</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Monitoreo Continuo</div>
          </CardContent>
        </Card>

        {/* Estadística 2: Cantidad de parámetros medidos */}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">6</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Parámetros Medidos</div>
          </CardContent>
        </Card>

        {/* Estadística 3: Frecuencia de actualización */}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">2min</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Actualización</div>
          </CardContent>
        </Card>

        {/* Estadística 4: Nivel de precisión */}
        <Card>
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Precisión</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
