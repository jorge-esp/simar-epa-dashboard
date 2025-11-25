/**
 * API ROUTE: Velocidad del Viento
 *
 * Este endpoint obtiene datos históricos de velocidad del viento desde la boya.
 * Soporta diferentes rangos de tiempo: 12h, 24h, 48h, 7d
 *
 * Parámetro de consulta:
 * - range: "12h" | "24h" | "48h" | "7d" (default: "24h")
 *
 * Datos retornados en m/s (metros por segundo)
 */

import { NextResponse } from "next/server"

// Configuración de la API
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

/**
 * Formatea una fecha JavaScript a formato requerido por la API: "YYYY-MM-DD HH:MM:SS"
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha formateada para la API
 */
function formatDateForApi(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19)
}

/**
 * Manejador GET para obtener datos históricos de velocidad del viento
 * @param {Request} request - Objeto de petición HTTP con query params
 * @returns {JSON} Array de datos con timestamps y valores de velocidad
 */
export async function GET(request: Request) {
  try {
    // Extraer el parámetro 'range' de la URL
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "24h"

    // Convertir el rango a horas
    const hours = range === "7d" ? 168 : range === "48h" ? 48 : range === "12h" ? 12 : 24

    // Calcular fechas de inicio y fin
    const now = new Date()
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000)

    // Construir URL con parámetros de fecha
    // La API requiere el nombre del sensor codificado: "Wind%20Speed"
    const url = `${API_BASE}/${DEVICE_ID}/EMA/Wind%20Speed/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wind speed from:", url)

    // Realizar petición a la API
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()

    console.log("[v0] Wind speed API response received")

    // Navegar por la estructura de la respuesta para obtener los datos
    // Estructura: data.EMA.0["Wind Speed"].WSPD.values
    const emaData = apiResponse?.data?.EMA?.[0]?.["Wind Speed"]?.WSPD?.values

    if (!emaData) {
      console.log("[v0] No wind speed data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convertir el objeto de valores a un array
    const dataArray = Object.values(emaData) as Array<{ date: string; value: string; unit: string }>

    console.log("[v0] Wind speed data points found:", dataArray.length)

    // Transformar los datos al formato esperado por el frontend
    const transformedData = dataArray.map((item) => ({
      timestamp: item.date, // Fecha/hora del registro
      value: Number.parseFloat(item.value), // Velocidad del viento en m/s
    }))

    console.log("[v0] Wind speed data transformed successfully, first value:", transformedData[0])

    // Retornar datos transformados con metadatos
    return NextResponse.json({
      data: transformedData,
      lastUpdate: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      currentValue: transformedData[0]?.value || 0, // Valor más reciente
    })
  } catch (error) {
    console.error("[v0] Error fetching wind speed:", error)
    return NextResponse.json({ error: "Failed to fetch wind speed data" }, { status: 500 })
  }
}
