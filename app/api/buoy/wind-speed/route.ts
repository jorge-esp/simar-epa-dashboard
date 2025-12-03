/**
 * API ROUTE: Velocidad del Viento y Ráfagas
 *
 * Este endpoint obtiene datos históricos de velocidad del viento y ráfagas desde la boya.
 * Soporta diferentes rangos de tiempo: 12h, 24h
 *
 * Parámetro de consulta:
 * - range: "12h" | "24h" (default: "24h")
 *
 * Datos retornados en m/s (metros por segundo)
 * - WSPD: Velocidad del viento sostenido
 * - GSPD: Velocidad de la ráfaga
 */

import { NextResponse } from "next/server"

// Configuración de la API
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

/**
 * Formatea una fecha JavaScript a formato requerido por la API: "YYYY-MM-DD HH:MM:SS"
 */
function formatDateForApi(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19)
}

/**
 * Manejador GET para obtener datos históricos de velocidad del viento y ráfagas
 */
export async function GET(request: Request) {
  try {
    // Extraer el parámetro 'range' de la URL
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "24h"

    // Convertir el rango a horas
    const hours = range === "12h" ? 12 : 24

    // Calcular fechas de inicio y fin
    const now = new Date()
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000)

    const windSpeedUrl = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Speed/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`
    const gustSpeedUrl = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Gust/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wind speed from:", windSpeedUrl)
    console.log("[v0] Fetching gust speed from:", gustSpeedUrl)

    // Realizar peticiones en paralelo
    const [windResponse, gustResponse] = await Promise.all([
      fetch(windSpeedUrl, { headers: { Accept: "application/json" } }),
      fetch(gustSpeedUrl, { headers: { Accept: "application/json" } }),
    ])

    if (!windResponse.ok) {
      throw new Error(`Wind API error: ${windResponse.status}`)
    }

    const windApiResponse = await windResponse.json()
    const gustApiResponse = gustResponse.ok ? await gustResponse.json() : null

    console.log("[v0] Wind speed API response received")

    // Obtener datos de velocidad del viento
    const windData = windApiResponse?.data?.EMA?.[0]?.["Wind Speed"]?.WSPD?.values
    // Obtener datos de velocidad de ráfaga
    const gustData = gustApiResponse?.data?.EMA?.[0]?.["Wind Gust"]?.GSPD?.values

    if (!windData) {
      console.log("[v0] No wind speed data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convertir el objeto de valores a un array
    const windArray = Object.values(windData) as Array<{ date: string; value: string; unit: string }>
    const gustArray = gustData ? (Object.values(gustData) as Array<{ date: string; value: string; unit: string }>) : []

    console.log("[v0] Wind speed data points found:", windArray.length)
    console.log("[v0] Gust speed data points found:", gustArray.length)

    // Crear mapa de ráfagas por fecha para fácil acceso
    const gustMap = new Map<string, number>()
    gustArray.forEach((item) => {
      gustMap.set(item.date, Number.parseFloat(item.value))
    })

    const transformedData = windArray.map((item) => ({
      timestamp: item.date,
      value: Number.parseFloat(item.value), // Velocidad del viento en m/s
      gustValue: gustMap.get(item.date) || null, // Velocidad de ráfaga en m/s
    }))

    console.log("[v0] Wind data transformed successfully, first value:", transformedData[0])

    // Retornar datos transformados con metadatos
    return NextResponse.json({
      data: transformedData,
      lastUpdate: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      currentValue: transformedData[0]?.value || 0,
      currentGustValue: transformedData[0]?.gustValue || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching wind speed:", error)
    return NextResponse.json({ error: "Failed to fetch wind speed data" }, { status: 500 })
  }
}
