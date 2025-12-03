/**
 * API ROUTE: Cantidad de Olas (Frecuencia de Olas)
 *
 * Este endpoint obtiene datos históricos de la cantidad total de olas
 * registradas en períodos de tiempo desde la boya oceanográfica SIMAR-EPA.
 *
 * Parámetros de consulta:
 * - hours: número de horas hacia atrás desde ahora (default: 24)
 *   Ejemplos: 12 (12 horas), 24 (1 día), 48 (2 días), 168 (7 días)
 *
 * Datos retornados:
 * - VQTY: Cantidad total de olas en el período de medición
 * - timestamp: Fecha y hora de la medición en formato ISO
 * - value: Número total de olas contadas
 *
 * La boya cuenta el número de olas que pasan en intervalos regulares,
 * lo cual es útil para analizar la frecuencia y actividad del oleaje.
 */

import { NextResponse } from "next/server"

// Configuración de la API externa de Ocean.com
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10" // ID del dispositivo boya
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9" // Token de autenticación

/**
 * Formatea una fecha JavaScript al formato requerido por la API
 * @param date - Fecha a formatear
 * @returns String en formato "YYYY-MM-DD HH:mm:ss"
 */
function formatDateForApi(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ")
}

/**
 * Manejador GET para obtener datos históricos de cantidad de olas
 * @param request - Request object de Next.js
 * @returns JSON con array de datos transformados y última actualización
 */
export async function GET(request: Request) {
  try {
    // Extraer parámetro 'hours' de la query string
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    // Calcular fechas para el rango de tiempo solicitado
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000)

    const startStr = formatDateForApi(startDate)
    const endStr = formatDateForApi(endDate)

    // Construir URL de la API externa con rango de fechas
    const apiUrl = `${API_BASE}/${DEVICE_ID}/Waves/Wave%20Count/${startStr}/${endStr}?token=${TOKEN}`

    console.log("[v0] Fetching wave count data from:", apiUrl)

    // Realizar petición a la API externa con caché de 5 minutos
    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache de 5 minutos
    })

    if (!response.ok) {
      console.error("[v0] Wave count API error:", response.status, response.statusText)
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    console.log("[v0] Wave count data structure keys:", Object.keys(apiResponse))

    // Extraer datos de cantidad de olas desde la estructura compleja de la API
    // Estructura: data.Waves["0"]["Wave Count"].VQTY.values
    const waveCountData = apiResponse?.data?.Waves?.["0"]?.["Wave Count"]?.VQTY?.values

    if (!waveCountData) {
      console.error("[v0] Could not find wave count data in expected structure")
      return NextResponse.json({ lastUpdate: null, data: [] })
    }

    // Convertir el objeto de valores (keys numéricas) a un array
    const valuesArray = Object.values(waveCountData)
    console.log("[v0] Wave count data points found:", valuesArray.length)

    if (valuesArray.length > 0) {
      console.log("[v0] First wave count value:", valuesArray[0])
      console.log("[v0] Last wave count value:", valuesArray[valuesArray.length - 1])
    }

    // Transformar los datos al formato esperado por el gráfico
    const transformedData = valuesArray.map((item: any) => ({
      timestamp: item.date, // Fecha en formato string
      value: Number.parseFloat(item.value), // Cantidad de olas (número)
    }))

    console.log("[v0] Transformed wave count data points:", transformedData.length)

    // Generar timestamp de última actualización en formato local chileno
    const lastUpdate = new Date().toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })

    console.log("[v0] Last update:", lastUpdate)

    return NextResponse.json({
      lastUpdate,
      data: transformedData,
    })
  } catch (error) {
    console.error("[v0] Error fetching wave count:", error)
    return NextResponse.json({ error: "Failed to fetch wave count data" }, { status: 500 })
  }
}
