/**
 * API ROUTE: Estado de la Boya
 *
 * Este endpoint obtiene el estado actual de la boya oceanográfica, incluyendo
 * datos técnicos del sistema como voltaje, corriente, memoria, y ubicación GPS.
 *
 * URL de la API externa: https://oceancom.msm-data.com/api/device/lastStatus/10/MMB03/recent/
 * Método: GET
 * Actualización: En tiempo real, con caché simple
 */

import { NextResponse } from "next/server"

// Configuración de la API externa de Ocean.com
const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10" // ID del dispositivo boya
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9" // Token de autenticación

// Cache simple en memoria para evitar rate limiting
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 1000 // 1 minuto de caché

/**
 * Manejador GET para obtener el estado actual de la boya
 * @returns {JSON} Objeto con los datos técnicos de la boya
 */
export async function GET() {
  try {
    // Verificar caché
    const now = Date.now()
    if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
      console.log("[v0] Returning cached buoy status")
      return NextResponse.json(cachedData)
    }

    // Construir la URL completa del endpoint
    const url = `${API_BASE}/lastStatus/${DEVICE_ID}/MMB03/recent/?token=${TOKEN}`

    console.log("[v0] Fetching buoy status from:", url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // Timeout de 10 segundos

    // Realizar la petición HTTP a la API externa
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store", // No cachear para obtener datos en tiempo real
      signal: controller.signal, // Agregar señal de abort
    })

    clearTimeout(timeoutId) // Limpiar timeout si la petición fue exitosa

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      // Si recibimos un error 429 (Too Many Requests) y tenemos caché, devolver caché
      if (response.status === 429 && cachedData) {
        console.warn("[v0] Rate limit hit, returning cached data")
        return NextResponse.json(cachedData)
      }
      throw new Error(`API responded with status: ${response.status}`)
    }

    // Leer el texto de la respuesta antes de parsearlo como JSON
    const responseText = await response.text()
    console.log("[v0] Response text length:", responseText.length)
    console.log("[v0] Response text preview:", responseText.substring(0, 200))

    // Verificar si la respuesta está vacía
    if (!responseText || responseText.trim() === "") {
      console.log("[v0] Empty response received from API")
      // Si tenemos caché, devolverlo en lugar de nulos
      if (cachedData) {
        return NextResponse.json(cachedData)
      }
      // Retornar estructura con valores nulos si no hay datos
      return NextResponse.json({
        voltage: null,
        current: null,
        memory: null,
        latitude: null,
        longitude: null,
        distance: null,
        alarms: null,
        lastUpdate: null,
      })
    }

    // Intentar parsear la respuesta JSON
    let apiResponse
    try {
      apiResponse = JSON.parse(responseText)
    } catch (e) {
      console.error("[v0] Failed to parse JSON response:", responseText.substring(0, 100))
      // Si falla el parseo (ej. "Too Many Requests") y tenemos caché, usarlo
      if (cachedData) {
        return NextResponse.json(cachedData)
      }
      throw new Error("Invalid JSON response from API")
    }

    console.log("[v0] Buoy status API response received")

    // Extraer el array de datos desde la estructura de la API
    const dataArray = apiResponse?.data ? Object.values(apiResponse.data) : []

    if (dataArray.length === 0) {
      console.log("[v0] No status data found in response")
      return NextResponse.json({
        voltage: null,
        current: null,
        memory: null,
        latitude: null,
        longitude: null,
        distance: null,
        alarms: null,
        lastUpdate: null,
      })
    }

    /**
     * Función auxiliar para buscar un dato específico por su nombre
     * @param {string} name - Nombre del parámetro a buscar
     * @returns {object|undefined} Objeto con el dato encontrado o undefined
     */
    const findByName = (name: string) => dataArray.find((item: any) => item.name === name)

    // Extraer cada valor específico buscando por nombre
    const latitudeData = findByName("Latitude") // Latitud GPS
    const longitudeData = findByName("Longitude") // Longitud GPS
    const distanceData = findByName("Distance from anchor") // Distancia desde el ancla
    const memoryData = findByName("Memory") // Memoria disponible
    const voltageData = findByName("V2") // Voltaje principal (V2)
    const currentData = findByName("Input Total") // Corriente total de entrada
    const alarmsData = findByName("Alarms") // Estado de alarmas

    // Construir el objeto de resultado con conversión a números
    const result = {
      voltage: voltageData?.value ? Number(voltageData.value) : null,
      current: currentData?.value ? Number(currentData.value) : null,
      memory: memoryData?.value ? Number(memoryData.value) : null,
      latitude: latitudeData?.value ? Number(latitudeData.value) : null,
      longitude: longitudeData?.value ? Number(longitudeData.value) : null,
      distance: distanceData?.value ? Number(distanceData.value) : null,
      alarms: alarmsData?.value ? Number(alarmsData.value) : null,
      lastUpdate: latitudeData?.date_time_data || null, // Fecha de última actualización
    }

    console.log("[v0] Buoy status extracted:", result)

    // Actualizar caché si tenemos datos válidos
    if (result.latitude !== null) {
      cachedData = result
      lastFetchTime = now
    }

    return NextResponse.json(result)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error fetching buoy status:", errorMessage)
    
    // Retornar estructura con valores nulos en caso de error
    return NextResponse.json({
      voltage: null,
      current: null,
      memory: null,
      latitude: null,
      longitude: null,
      distance: null,
      alarms: null,
      lastUpdate: null,
    })
  }
}
