/**
 * Componente BuoyStatus
 * Muestra el estado operacional de la boya oceanográfica en tiempo real
 * Incluye: estado operativo, ubicación GPS, última actualización y distancia del ancla
 * Los datos se actualizan automáticamente cada 2 minutos usando useState y useEffect
 */
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState, useRef } from "react"

export function BuoyStatus() {
  // Hook useState para manejar el estado manualmente
  const [status, setStatus] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [showMap, setShowMap] = useState(false)
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [isGpsStable, setIsGpsStable] = useState(true) // Nuevo estado para indicar estabilidad GPS

  // Referencia para guardar la última posición del mapa y evitar dependencias circulares en useEffect
  const lastMapPosRef = useRef<{ lat: number; lon: number } | null>(null)

  // Posición nominal de la boya (basada en registros históricos estables)
  // Se usa como referencia para filtrar errores de GPS o saltos grandes
  const NOMINAL_POSITION = { lat: -18.46772, lon: -70.34051 }

  useEffect(() => {
    // Función para obtener datos del status de la boya
    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/buoy/status")
        if (!response.ok) throw new Error("Error fetching status")
        const data = await response.json()
        setStatus(data)
        setError(null)

        if (data.latitude && data.longitude) {
          // Calcular distancia desde la posición nominal para detectar errores de GPS
          const R = 6371e3 // Radio de la Tierra en metros
          const φ1 = (NOMINAL_POSITION.lat * Math.PI) / 180
          const φ2 = (data.latitude * Math.PI) / 180
          const Δφ = ((data.latitude - NOMINAL_POSITION.lat) * Math.PI) / 180
          const Δλ = ((data.longitude - NOMINAL_POSITION.lon) * Math.PI) / 180

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          const deviation = R * c // Desviación en metros desde la posición nominal

          // Si la desviación es mayor a 2000m (2km), asumimos error de GPS y usamos la nominal
          if (deviation > 2000) {
            console.warn(`[v0] Desviación GPS excesiva detectada (${deviation.toFixed(0)}m). Usando posición nominal.`)

            // Solo actualizar si es diferente para evitar re-renders innecesarios
            if (
              !lastMapPosRef.current ||
              lastMapPosRef.current.lat !== NOMINAL_POSITION.lat ||
              lastMapPosRef.current.lon !== NOMINAL_POSITION.lon
            ) {
              setMapCoordinates(NOMINAL_POSITION)
              lastMapPosRef.current = NOMINAL_POSITION
            }
            setIsGpsStable(false)
          } else {
            // Si la desviación es aceptable, usamos la lógica de movimiento suave
            setIsGpsStable(true)

            if (!lastMapPosRef.current) {
              setMapCoordinates({ lat: data.latitude, lon: data.longitude })
              lastMapPosRef.current = { lat: data.latitude, lon: data.longitude }
            } else {
              // Calcular movimiento relativo desde la última posición del mapa
              const φ1_map = (lastMapPosRef.current.lat * Math.PI) / 180
              const Δφ_map = ((data.latitude - lastMapPosRef.current.lat) * Math.PI) / 180
              const Δλ_map = ((data.longitude - lastMapPosRef.current.lon) * Math.PI) / 180

              const a_map =
                Math.sin(Δφ_map / 2) * Math.sin(Δφ_map / 2) +
                Math.cos(φ1_map) * Math.cos(φ2) * Math.sin(Δλ_map / 2) * Math.sin(Δλ_map / 2)
              const c_map = 2 * Math.atan2(Math.sqrt(a_map), Math.sqrt(1 - a_map))
              const movement = R * c_map

              // Solo actualizar mapa si el movimiento real es significativo (>10m)
              if (movement > 10) {
                console.log(`[v0] Movimiento válido detectado (${movement.toFixed(2)}m). Actualizando mapa.`)
                setMapCoordinates({ lat: data.latitude, lon: data.longitude })
                lastMapPosRef.current = { lat: data.latitude, lon: data.longitude }
              }
            }
          }
        }
      } catch (err) {
        console.error("[v0] Error fetching buoy status:", err)
        setError(err)
      }
    }

    // Llamada inicial
    fetchStatus()

    // Actualización automática cada 2 minutos (120000ms)
    const interval = setInterval(fetchStatus, 120000)

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(interval)
  }, []) // Eliminada dependencia de mapCoordinates para evitar bucle infinito

  // Determinar si la boya está operativa (tiene datos y sin errores)
  const isOperational = status && !error
  // Verificar si hay alarmas activas en la boya
  const hasAlarms = status?.alarms && status.alarms > 0

  useEffect(() => {
    if (status?.latitude && status?.longitude) {
      // Pequeño delay para asegurar que el componente esté montado
      const timer = setTimeout(() => setShowMap(true), 500)
      return () => clearTimeout(timer)
    }
  }, [status])

  /**
   * Formatea coordenadas GPS al formato legible con hemisferios
   * @param lat Latitud en grados decimales
   * @param lon Longitud en grados decimales
   * @returns String formateado: "18.46772°S, 70.34051°W"
   */
  const formatCoordinate = (lat: number | null, lon: number | null) => {
    if (!lat || !lon) return "Cargando..."
    // Determinar hemisferio: Norte/Sur para latitud, Este/Oeste para longitud
    const latDir = lat < 0 ? "S" : "N"
    const lonDir = lon < 0 ? "W" : "E"
    // Convertir a valor absoluto y limitar a 5 decimales
    const latDeg = Math.abs(lat).toFixed(5)
    const lonDeg = Math.abs(lon).toFixed(5)
    return `${latDeg}°${latDir}, ${lonDeg}°${lonDir}`
  }

  /**
   * Obtiene la hora actual en formato local chileno (HH:MM)
   */
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    // Card principal con borde destacado para indicar importancia
    <Card className="bg-card border-2 border-primary/20">
      <CardHeader className="p-4 sm:p-6">
        {/* Layout flexible: vertical en móvil, horizontal en desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Sección izquierda: Imagen y título de la boya */}
          <div className="flex items-center gap-3">
            {/* Contenedor de imagen con tamaño responsive */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img src="/images/boya-arica.png" alt="Boya Arica" className="object-cover w-full h-full" />
            </div>
            <div>
              {/* Nombre de la boya */}
              <CardTitle className="text-base sm:text-lg font-semibold text-card-foreground">Boya Arica</CardTitle>
              {/* Identificador único en formato monoespaciado */}
              <p className="text-xs sm:text-sm text-muted-foreground font-mono">BOYA-EPA-01</p>
            </div>
          </div>

          {/* Badge de estado: Cambia color y texto según estado operacional */}
          <Badge
            variant={hasAlarms ? "destructive" : "default"}
            className={`${hasAlarms ? "" : "bg-accent text-accent-foreground"} px-3 sm:px-4 py-1 self-start sm:self-auto`}
          >
            {hasAlarms ? (
              // Estado de alerta: muestra triángulo de advertencia
              <>
                <span className="mr-1">⚠️</span>
                Alerta
              </>
            ) : isOperational ? (
              // Estado operativo normal
              <>
                <span className="mr-1">📡</span>
                Operativa
              </>
            ) : (
              // Estado de carga inicial
              <>
                <span className="mr-1">📡</span>
                Cargando...
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Grid de información: 1 columna en móvil, 2 en tablet, 3 en desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Información 1: Ubicación GPS de la boya */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">📍</span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Ubicación GPS</p>
              {/* Coordenadas formateadas con truncate para evitar overflow */}
              <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                {formatCoordinate(status?.latitude, status?.longitude)}
              </p>
            </div>
          </div>

          {/* Información 2: Hora de última actualización */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">📡</span>
            <div>
              <p className="text-xs text-muted-foreground">Última actualización</p>
              {/* Muestra hora actual (datos se actualizan cada 2 min) */}
              <p className="text-xs sm:text-sm font-medium text-foreground">{getCurrentTime()}</p>
            </div>
          </div>

          {/* Información 3: Distancia desde el punto de anclaje */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">⚓</span>
            <div>
              <p className="text-xs text-muted-foreground">Distancia del Ancla</p>
              {/* Distancia en metros (indica deriva de la boya) */}
              <p className="text-xs sm:text-sm font-medium text-foreground">
                {status?.distance ? `${status.distance.toFixed(0)} m` : "Cargando..."}
              </p>
            </div>
          </div>
        </div>

        {status?.latitude && status?.longitude && mapCoordinates && (
          <div className="mt-4 sm:mt-6">
            {/* Título de la sección del mapa */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary">📍</span>
              <h3 className="text-sm font-semibold text-foreground">Ubicación Geográfica</h3>
            </div>

            {/* Contenedor del mapa con aspect ratio 16:9 responsive */}
            <div className="relative w-full rounded-lg overflow-hidden border-2 border-border bg-muted">
              {/* Aspect ratio container: mantiene proporción 16:9 */}
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                {/* Iframe de OpenStreetMap embebido - AHORA USA mapCoordinates ESTABLES */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoordinates.lon - 0.01},${mapCoordinates.lat - 0.01},${mapCoordinates.lon + 0.01},${mapCoordinates.lat + 0.01}&layer=mapnik&marker=${mapCoordinates.lat},${mapCoordinates.lon}`}
                  style={{ border: 0 }}
                  title="Ubicación de la Boya Arica"
                />
              </div>

              {/* Badge flotante con información de la boya - MUESTRA COORDENADAS REALES */}
              <div className="absolute top-2 left-2 bg-background/95 backdrop-blur-sm rounded-md px-3 py-1.5 shadow-lg border border-border">
                <p className="text-xs font-semibold text-foreground">Boya SIMAR-EPA</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatCoordinate(status.latitude, status.longitude)}
                </p>
              </div>

              {/* Enlace para abrir el mapa completo en nueva pestaña - USA COORDENADAS REALES */}
              <a
                href={`https://www.openstreetmap.org/?mlat=${status.latitude}&mlon=${status.longitude}#map=13/${status.latitude}/${status.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors shadow-lg"
              >
                Ver mapa completo →
              </a>
            </div>

            {/* Información adicional debajo del mapa */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>
                📍 Distancia del ancla: <strong className="text-foreground">{status.distance?.toFixed(0)} m</strong>
              </span>
              <span className="hidden sm:inline">•</span>
              <span>🌊 Frente a la costa de Arica, Chile</span>
              <span className="hidden sm:inline">•</span>
              {isGpsStable ? (
                <span className="text-xs italic text-green-600 flex items-center gap-1">
                  <span>📡</span> Señal GPS estable
                </span>
              ) : (
                <span className="text-xs italic text-amber-600 flex items-center gap-1">
                  <span>⚠️</span> Señal GPS inestable (mostrando ubicación nominal)
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
