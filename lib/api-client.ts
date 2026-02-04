/**
 * MÓDULO: api-client.ts - Cliente API para datos de la Boya Oceanográfica
 *
 * Este módulo centraliza todas las llamadas a las APIs locales de Next.js
 * que a su vez consumen datos de la boya oceanográfica desde Oceancom.
 *
 * ARQUITECTURA DE CONEXIÓN:
 * ┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────────────┐
 * │ Componente  │────▶│ api-client.ts    │────▶│ /api/buoy/* (Next.js Routes)    │
 * │ React       │     │ (este archivo)   │     │                                 │
 * └─────────────┘     └──────────────────┘     └─────────────────────────────────┘
 *                                                          │
 *                                                          ▼
 *                                               ┌─────────────────────────────────┐
 *                                               │ API Externa Oceancom            │
 *                                               │ https://oceancom.msm-data.com   │
 *                                               │ Token: 91b448bbb9d19b6c651e...  │
 *                                               │ Device ID: 10 (Boya Arica)      │
 *                                               └─────────────────────────────────┘
 *
 * ENDPOINTS DISPONIBLES:
 * - wave-height: Altura significativa H1/3 (metros)
 * - wave-direction: Dirección y dispersión de olas (grados)
 * - wave-count: Cantidad de olas (número)
 * - wind-speed: Velocidad del viento y ráfagas (m/s)
 * - temperature: Temperatura del aire (°C)
 * - pressure: Presión atmosférica (hPa)
 *
 * PARÁMETROS DE TIEMPO:
 * - "12h": Últimas 12 horas
 * - "24h": Últimas 24 horas (default)
 * - "48h": Últimas 48 horas
 * - "7d": Últimos 7 días
 */

// Interfaces TypeScript para tipar las respuestas
export interface ApiDataPoint {
  timestamp: string // Fecha/hora en formato ISO
  value: number // Valor del dato medido
}

export interface ApiResponse {
  data: ApiDataPoint[] // Array de puntos de datos
  lastUpdate: string // Última actualización formateada
}

/**
 * Fetcher genérico para endpoints locales de la boya
 * @param endpoint - Nombre del endpoint (ej: "wave-height")
 * @returns Promise con los datos de la API
 */
async function fetchBuoyData(endpoint: string): Promise<ApiResponse> {
  try {
    // Realizar petición al endpoint local
    const response = await fetch(`/api/buoy/${endpoint}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Exportar funciones específicas para cada tipo de dato
// Todas aceptan un parámetro de rango de tiempo opcional

/** Obtener datos de altura de olas */
export const fetchWaveHeight = (timeRange = "24h") => fetchBuoyData(`wave-height?range=${timeRange}`)

/** Obtener datos de temperatura del aire */
export const fetchAirTemperature = (timeRange = "24h") => fetchBuoyData(`temperature?range=${timeRange}`)

/** Obtener datos de velocidad del viento */
export const fetchWindSpeed = (timeRange = "24h") => fetchBuoyData(`wind-speed?range=${timeRange}`)

/** Obtener datos de presión atmosférica */
export const fetchAtmosphericPressure = (timeRange = "24h") => fetchBuoyData(`pressure?range=${timeRange}`)

/** Obtener datos de cantidad de olas */
export const fetchWaveCount = (timeRange = "24h") => fetchBuoyData(`wave-count?range=${timeRange}`)

/** Obtener datos de dirección y dispersión de olas */
export const fetchWaveDirection = (timeRange = "24h") => fetchBuoyData(`wave-direction?range=${timeRange}`)
