/**
 * API Route: Altura de Olas
 *
 * Este endpoint obtiene datos de altura de olas desde la API de la boya oceanográfica
 * y los transforma para su visualización en el dashboard.
 */

import { NextResponse } from "next/server"

// Configuración de la API externa de la boya
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10" // ID del dispositivo de la boya
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9" // Token de autenticación

/**
 * Formatea una fecha en el formato requerido por la API externa
 * @param date - Fecha a formatear
 * @returns String en formato "YYYY-MM-DD HH:mm:ss"
 */
function formatDateForApi(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19)
}

/**
 * Convierte el rango de tiempo seleccionado a horas
 * @param range - Rango de tiempo ("12h", "24h", "48h", "7d")
 * @returns Número de horas correspondiente
 */
function getTimeRangeHours(range: string): number {
  switch (range) {
    case "12h":
      return 12
    case "24h":
      return 24
    case "48h":
      return 48
    case "7d":
      return 168 // 7 días * 24 horas
    default:
      return 24
  }
}

/**
 * Handler GET: Obtiene datos de altura de olas
 * @param request - Request object de Next.js
 */
export async function GET(request: Request) {
  try {
    // Extraer parámetros de la URL
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "24h"
    const hours = getTimeRangeHours(range)

    // Calcular rango de fechas: desde X horas atrás hasta ahora
    const now = new Date()
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000)

    // Construir URL de la API externa
    const url = `${API_BASE}/${DEVICE_ID}/Waves/Wave%20Height/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wave height from:", url)

    // Realizar petición a la API externa
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    console.log("[v0] Wave height API response received")

    // Extraer datos de la estructura compleja de la respuesta
    // La API retorna: data.Waves.0["Wave Height"].VAVH.values
    // VAVH = Altura significativa (Hs) 1/3 según documentación oficial
    const waveData = apiResponse?.data?.Waves?.[0]?.["Wave Height"]?.VAVH?.values

    if (!waveData) {
      console.log("[v0] No wave height data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convertir el objeto de valores a un array
    const dataArray = Object.values(waveData) as Array<{ date: string; value: string; unit: string }>

    console.log("[v0] Wave height data points found:", dataArray.length)

    // Transformar los datos al formato necesario para los gráficos
    const transformedData = dataArray.map((item) => ({
      timestamp: item.date,
      value: Number.parseFloat(item.value) / 100, // Convertir de centímetros a metros
    }))

    console.log("[v0] Wave height data transformed successfully, first value:", transformedData[0])

    // Retornar datos transformados
    return NextResponse.json({
      data: transformedData,
      lastUpdate: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      currentValue: transformedData[0]?.value || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching wave height:", error)
    return NextResponse.json({ error: "Failed to fetch wave height data" }, { status: 500 })
  }
}
