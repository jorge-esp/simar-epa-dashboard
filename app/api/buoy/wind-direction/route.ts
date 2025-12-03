/**
 * API ROUTE: Dirección del Viento y Ráfagas
 *
 * Este endpoint obtiene la dirección del viento y ráfagas desde la boya.
 * Parámetros:
 * - WDIR: Dirección del viento en grados (0-360°)
 * - WSPD: Velocidad del viento en m/s
 * - GDIR: Dirección de la ráfaga en grados (0-360°)
 * - GSPD: Velocidad de la ráfaga en m/s
 */

import { NextResponse } from "next/server"

// Configuración de la API
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

/**
 * Manejador GET para obtener la dirección y velocidad del viento y ráfagas
 * @returns {JSON} Dirección y velocidad del viento, más dirección y velocidad de ráfaga
 */
export async function GET() {
  try {
    // Obtener datos recientes (última hora) para tener el valor más actual
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const formatDate = (date: Date) => date.toISOString().replace("T", " ").substring(0, 19)

    // Construir URLs para obtener todos los datos
    // Angular contiene WDIR (dirección viento) y GDIR (dirección ráfaga)
    const angularUrl = `${API_BASE}/${DEVICE_ID}/EMA/Angular/${formatDate(oneHourAgo)}/${formatDate(now)}?token=${TOKEN}`
    // Wind Speed contiene WSPD (velocidad viento)
    const windSpeedUrl = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Speed/${formatDate(oneHourAgo)}/${formatDate(now)}?token=${TOKEN}`
    // Wind Gust contiene GSPD (velocidad ráfaga)
    const gustSpeedUrl = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Gust/${formatDate(oneHourAgo)}/${formatDate(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wind data from Angular, Wind Speed, and Wind Gust APIs")

    // Realizar peticiones en paralelo
    const [angularResponse, speedResponse, gustResponse] = await Promise.all([
      fetch(angularUrl, { headers: { Accept: "application/json" } }),
      fetch(windSpeedUrl, { headers: { Accept: "application/json" } }),
      fetch(gustSpeedUrl, { headers: { Accept: "application/json" } }),
    ])

    // Valores por defecto
    let windDirection = 0
    let windSpeed = 0
    let gustDirection = 0
    let gustSpeed = 0

    // Procesar datos de Angular (WDIR y GDIR)
    if (angularResponse.ok) {
      const angularData = await angularResponse.json()

      // Obtener WDIR (dirección del viento)
      const wdirValues = angularData?.data?.EMA?.[0]?.["Angular"]?.WDIR?.values
      if (wdirValues) {
        const valuesArray = Object.values(wdirValues) as Array<{ date: string; value: string }>
        windDirection = valuesArray.length > 0 ? Number.parseFloat(valuesArray[valuesArray.length - 1].value) : 0
      }

      // Obtener GDIR (dirección de la ráfaga)
      const gdirValues = angularData?.data?.EMA?.[0]?.["Angular"]?.GDIR?.values
      if (gdirValues) {
        const valuesArray = Object.values(gdirValues) as Array<{ date: string; value: string }>
        gustDirection = valuesArray.length > 0 ? Number.parseFloat(valuesArray[valuesArray.length - 1].value) : 0
      }
    }

    // Procesar velocidad del viento (WSPD)
    if (speedResponse.ok) {
      const speedData = await speedResponse.json()
      const wspdValues = speedData?.data?.EMA?.[0]?.["Wind Speed"]?.WSPD?.values
      if (wspdValues) {
        const speedArray = Object.values(wspdValues) as Array<{ date: string; value: string }>
        windSpeed = speedArray.length > 0 ? Number.parseFloat(speedArray[speedArray.length - 1].value) : 0
      }
    }

    // Procesar velocidad de ráfaga (GSPD)
    if (gustResponse.ok) {
      const gustData = await gustResponse.json()
      const gspdValues = gustData?.data?.EMA?.[0]?.["Wind Gust"]?.GSPD?.values
      if (gspdValues) {
        const gustArray = Object.values(gspdValues) as Array<{ date: string; value: string }>
        gustSpeed = gustArray.length > 0 ? Number.parseFloat(gustArray[gustArray.length - 1].value) : 0
      }
    }

    console.log("[v0] Wind direction:", windDirection, "Speed:", windSpeed)
    console.log("[v0] Gust direction:", gustDirection, "Speed:", gustSpeed)

    return NextResponse.json({
      direction: windDirection,
      speed: windSpeed,
      gustDirection: gustDirection,
      gustSpeed: gustSpeed,
    })
  } catch (error) {
    console.error("[v0] Error fetching wind direction:", error)
    return NextResponse.json({ error: "Failed to fetch wind direction" }, { status: 500 })
  }
}
