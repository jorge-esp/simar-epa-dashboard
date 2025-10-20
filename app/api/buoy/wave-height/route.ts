import { NextResponse } from "next/server"

const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

function formatDateForApi(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19)
}

function getTimeRangeHours(range: string): number {
  switch (range) {
    case "12h":
      return 12
    case "24h":
      return 24
    case "48h":
      return 48
    case "7d":
      return 168 // 7 days * 24 hours
    default:
      return 24
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "24h"
    const hours = getTimeRangeHours(range)

    const now = new Date()
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000)

    const url = `${API_BASE}/${DEVICE_ID}/Waves/Wave%20Height/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wave height from:", url)

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

    // Structure: data.Waves.0["Wave Height"].VHM0.values (or VMXL for max height)
    const waveData =
      apiResponse?.data?.Waves?.[0]?.["Wave Height"]?.VHM0?.values ||
      apiResponse?.data?.Waves?.[0]?.["Wave Height"]?.VMXL?.values

    if (!waveData) {
      console.log("[v0] No wave height data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convert the values object to an array
    const dataArray = Object.values(waveData) as Array<{ date: string; value: string; unit: string }>

    console.log("[v0] Wave height data points found:", dataArray.length)

    const transformedData = dataArray.map((item) => ({
      timestamp: item.date,
      value: Number.parseFloat(item.value) / 100, // Convert cm to meters
    }))

    console.log("[v0] Wave height data transformed successfully, first value:", transformedData[0])

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
