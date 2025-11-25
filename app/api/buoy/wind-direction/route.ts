/**
 * API ROUTE: Dirección del Viento
 *
 * Este endpoint obtiene la dirección del viento desde la boya usando WDIR.
 * Retorna el valor más reciente de dirección en grados (0-360°)
 *
 * Parámetro WDIR: Dirección del viento en grados
 * - 0° = Norte
 * - 90° = Este
 * - 180° = Sur
 * - 270° = Oeste
 */

import { NextResponse } from "next/server"

// Configuración de la API
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

/**
 * Manejador GET para obtener la dirección actual del viento
 * @returns {JSON} Dirección del viento en grados y velocidad asociada
 */
export async function GET() {
  try {
    // Obtener datos recientes (última hora) para tener el valor más actual
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const formatDate = (date: Date) => date.toISOString().replace("T", " ").substring(0, 19)

    // Construir URL para obtener dirección del viento (WDIR) y velocidad (WSPD)
    const windDirUrl = `${API_BASE}/${DEVICE_ID}/EMA/Angular/${formatDate(oneHourAgo)}/${formatDate(now)}?token=${TOKEN}`
    const windSpeedUrl = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Speed/${formatDate(oneHourAgo)}/${formatDate(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wind direction from:", windDirUrl)

    // Realizar peticiones en paralelo
    const [dirResponse, speedResponse] = await Promise.all([
      fetch(windDirUrl, { headers: { Accept: "application/json" } }),
      fetch(windSpeedUrl, { headers: { Accept: "application/json" } }),
    ])

    if (!dirResponse.ok) {
      throw new Error(`API error for direction: ${dirResponse.status}`)
    }

    const dirData = await dirResponse.json()

    // Navegar por la estructura de la respuesta para obtener WDIR
    // Estructura: data.EMA.0["Angular"].WDIR.values
    const wdirValues = dirData?.data?.EMA?.[0]?.["Angular"]?.WDIR?.values

    if (!wdirValues) {
      console.log("[v0] No WDIR data found")
      return NextResponse.json({ direction: 0, speed: 0 })
    }

    // Obtener el valor más reciente
    const valuesArray = Object.values(wdirValues) as Array<{ date: string; value: string }>
    const latestDirection = valuesArray.length > 0 ? Number.parseFloat(valuesArray[valuesArray.length - 1].value) : 0

    // Intentar obtener velocidad del viento también
    let latestSpeed = 0
    if (speedResponse.ok) {
      const speedData = await speedResponse.json()
      const wspdValues = speedData?.data?.EMA?.[0]?.["Wind Speed"]?.WSPD?.values
      if (wspdValues) {
        const speedArray = Object.values(wspdValues) as Array<{ date: string; value: string }>
        latestSpeed = speedArray.length > 0 ? Number.parseFloat(speedArray[speedArray.length - 1].value) : 0
      }
    }

    console.log("[v0] Wind direction:", latestDirection, "Speed:", latestSpeed)

    return NextResponse.json({
      direction: latestDirection,
      speed: latestSpeed,
    })
  } catch (error) {
    console.error("[v0] Error fetching wind direction:", error)
    return NextResponse.json({ error: "Failed to fetch wind direction" }, { status: 500 })
  }
}
