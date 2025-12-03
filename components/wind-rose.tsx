/**
 * Componente WindRose (Rosa de los Vientos)
 * Visualiza de forma gráfica e interactiva la dirección del viento o las olas
 * Incluye:
 * - Rosa de los vientos animada con flecha direccional
 * - Opcionalmente una segunda flecha para dirección de ráfaga
 * - Puntos cardinales (N, S, E, O)
 * - Conversión a dirección cardinal (N, NE, E, SE, etc.)
 * - Animación suave de rotación cuando cambia la dirección
 */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CompassIcon } from "@/components/icons"

interface WindRoseProps {
  direction: number // Dirección principal en grados (0-360°): 0° = Norte, 90° = Este, 180° = Sur, 270° = Oeste
  speed?: number // Velocidad opcional para mostrar (m/s o nudos)
  label?: string // Etiqueta personalizada para el título
  size?: "sm" | "md" | "lg" // Tamaño del componente
}

/**
 * Convierte grados (0-360) a dirección cardinal abreviada
 * @param degrees Dirección en grados
 * @returns Abreviación de la dirección (N, NNE, NE, etc.)
 */
const getCardinalDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSO",
    "SO",
    "OSO",
    "O",
    "ONO",
    "NO",
    "NNO",
  ]
  // Divide el círculo en 16 sectores (360° / 16 = 22.5° por sector)
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

/**
 * Convierte grados (0-360) a dirección cardinal completa en español
 * @param degrees Dirección en grados
 * @returns Nombre completo de la dirección (Norte, Nor-Noreste, etc.)
 */
const getCardinalDirectionFull = (degrees: number): string => {
  const directions = [
    "Norte",
    "Nor-Noreste",
    "Noreste",
    "Este-Noreste",
    "Este",
    "Este-Sureste",
    "Sureste",
    "Sur-Sureste",
    "Sur",
    "Sur-Suroeste",
    "Suroeste",
    "Oeste-Suroeste",
    "Oeste",
    "Oeste-Noroeste",
    "Noroeste",
    "Nor-Noroeste",
  ]
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function WindRose({ direction, speed, label = "Dirección", size = "md" }: WindRoseProps) {
  // Estado local para controlar la rotación con animación suave
  const [rotation, setRotation] = useState(0)

  // Efecto que actualiza la rotación cuando cambia la dirección
  useEffect(() => {
    setRotation(direction)
  }, [direction])

  // Clases CSS para diferentes tamaños del componente (responsive)
  const sizeClasses = {
    sm: "w-24 h-24 sm:w-32 sm:h-32",
    md: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48",
    lg: "w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64",
  }

  // Tamaños de la flecha direccional según el tamaño del componente
  const arrowSizes = {
    sm: "w-8 h-8 sm:w-12 sm:h-12",
    md: "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16",
    lg: "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2 text-base sm:text-lg">
          <CompassIcon size={20} className="text-primary" />
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3 sm:gap-4">
        {/* Contenedor principal de la rosa de los vientos */}
        <div className="relative flex items-center justify-center">
          {/* Círculo exterior con gradiente y borde */}
          <div
            className={`${sizeClasses[size]} relative rounded-full border-2 sm:border-4 border-primary/20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900`}
          >
            {/* Puntos cardinales fijos en el círculo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Norte (arriba) - destacado en color primario */}
              <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold text-primary">
                N
              </div>
              {/* Sur (abajo) */}
              <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold text-muted-foreground">
                S
              </div>
              {/* Este (derecha) */}
              <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-muted-foreground">
                E
              </div>
              {/* Oeste (izquierda) */}
              <div className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-muted-foreground">
                O
              </div>
            </div>

            {/* Líneas de referencia para los puntos cardinales y intermedios */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Línea horizontal (E-O) */}
              <div className="absolute w-full h-0.5 bg-primary/10" />
              {/* Línea vertical (N-S) */}
              <div className="absolute h-full w-0.5 bg-primary/10" />
              {/* Línea diagonal (NE-SO) */}
              <div className="absolute w-full h-0.5 bg-primary/10 rotate-45" />
              {/* Línea diagonal (NO-SE) */}
              <div className="absolute w-full h-0.5 bg-primary/10 -rotate-45" />
            </div>

            {/* Flecha principal (viento sostenido) */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className={`${arrowSizes[size]} relative`}>
                {/* SVG de la flecha con gradientes */}
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-lg">
                  {/* Sombra de la flecha para efecto 3D */}
                  <path d="M12 2L16 10H8L12 2Z" fill="rgba(0,0,0,0.2)" transform="translate(0.5, 0.5)" />
                  {/* Punta de la flecha (triángulo superior) con gradiente verde */}
                  <path d="M12 2L16 10H8L12 2Z" fill="url(#arrowGradient)" stroke="#16a34a" strokeWidth="1.5" />
                  {/* Cola de la flecha (forma de V invertida) */}
                  <path
                    d="M12 10L10 22L12 20L14 22L12 10Z"
                    fill="url(#tailGradient)"
                    stroke="#22c55e"
                    strokeWidth="1"
                  />
                  {/* Definición de gradientes SVG */}
                  <defs>
                    {/* Gradiente de la punta: verde oscuro a verde claro */}
                    <linearGradient id="arrowGradient" x1="12" y1="2" x2="12" y2="10">
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    {/* Gradiente de la cola: verde claro a muy claro */}
                    <linearGradient id="tailGradient" x1="12" y1="10" x2="12" y2="22">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#86efac" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Punto central decorativo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary border-2 border-white shadow-lg" />
            </div>
          </div>
        </div>

        {/* Información textual debajo de la rosa de los vientos */}
        <div className="text-center space-y-0.5 sm:space-y-1">
          {/* Dirección en grados numéricos */}
          <div className="text-xl sm:text-2xl font-bold text-foreground">{direction.toFixed(0)}°</div>
          {/* Dirección cardinal abreviada y completa */}
          <div className="text-xs sm:text-sm font-medium text-muted-foreground">
            {getCardinalDirection(direction)} ({getCardinalDirectionFull(direction)})
          </div>
          {/* Velocidad opcional si se proporciona */}
          {speed !== undefined && (
            <div className="text-xs sm:text-sm text-muted-foreground">
              Velocidad: <span className="font-semibold text-foreground">{speed.toFixed(1)} m/s</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
