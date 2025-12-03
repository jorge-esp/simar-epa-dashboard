/**
 * Componente BuoyMap
 * Mapa interactivo que muestra la ubicación geográfica de la boya oceanográfica
 * Utiliza iframe de OpenStreetMap embebido - No requiere bibliotecas externas
 * Incluye: marcador de la boya, controles de zoom, interfaz responsive
 */
"use client"

import { MapPinIcon } from "@/components/icons"

// Definir props del componente
interface BuoyMapProps {
  latitude: number
  longitude: number
  distance?: number
}

export default function BuoyMap({ latitude, longitude, distance }: BuoyMapProps) {
  // Formatear coordenadas para mostrar en el mapa
  const latDir = latitude < 0 ? "S" : "N"
  const lonDir = longitude < 0 ? "W" : "E"
  const latFormatted = `${Math.abs(latitude).toFixed(5)}°${latDir}`
  const lonFormatted = `${Math.abs(longitude).toFixed(5)}°${lonDir}`

  // URL de OpenStreetMap con marcador personalizado
  // Parámetros: mlat/mlon = marcador, zoom = nivel de acercamiento
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`

  return (
    <div className="space-y-3">
      {/* Información de coordenadas encima del mapa */}
      <div className="bg-muted/50 rounded-lg p-3 border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
          {/* Columna 1: Latitud */}
          <div>
            <p className="text-muted-foreground font-medium mb-1">Latitud</p>
            <p className="font-mono text-foreground">{latFormatted}</p>
          </div>
          {/* Columna 2: Longitud */}
          <div>
            <p className="text-muted-foreground font-medium mb-1">Longitud</p>
            <p className="font-mono text-foreground">{lonFormatted}</p>
          </div>
          {/* Columna 3: Distancia del ancla (si está disponible) */}
          {distance && (
            <div>
              <p className="text-muted-foreground font-medium mb-1">Distancia Ancla</p>
              <p className="font-mono text-foreground">{distance.toFixed(0)} m</p>
            </div>
          )}
        </div>
      </div>

      {/* Contenedor del mapa con iframe de OpenStreetMap */}
      <div className="relative w-full h-[300px] sm:h-[350px] rounded-lg border-2 border-border overflow-hidden bg-muted">
        {/* Iframe embebido de OpenStreetMap */}
        <iframe
          src={mapUrl}
          className="w-full h-full"
          style={{ border: 0 }}
          loading="lazy"
          title="Mapa de ubicación de la boya oceanográfica"
        />

        {/* Badge flotante con identificación de la boya */}
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border">
          <div className="flex items-center gap-2">
            <MapPinIcon size={16} className="text-primary" />
            <div>
              <p className="text-xs font-semibold text-foreground">Boya Arica</p>
              <p className="text-xs text-muted-foreground">Puerto Arica, Chile</p>
            </div>
          </div>
        </div>

        {/* Enlace para abrir en OpenStreetMap completo */}
        <div className="absolute bottom-3 right-3">
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            Ver mapa completo →
          </a>
        </div>
      </div>

      {/* Nota informativa sobre el mapa */}
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <MapPinIcon size={12} />
        Mapa proporcionado por OpenStreetMap • Ubicación actualizada en tiempo real
      </p>
    </div>
  )
}
