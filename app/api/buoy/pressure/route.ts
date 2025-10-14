import { NextResponse } from "next/server"

const API_BASE = "https://oceancom.msm-data.com/api/device"
const DEVICE_ID = "10"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

function formatDateForApi(date: Date): string {
  return date.toISOString().replace("T", " ").substring(0, 19)
}

export async function GET() {
  try {
    const now = new Date()
    const past = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const url = `${API_BASE}/${DEVICE_ID}/EMA/Atmospheric%20Pressure/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching pressure from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()

    console.log("[v0] Pressure API response received")

    // Structure: data.EMA.0["Atmospheric Pressure"].ATMS.values
    const pressureData = apiResponse?.data?.EMA?.[0]?.["Atmospheric Pressure"]?.ATMS?.values

    if (!pressureData) {
      console.log("[v0] No pressure data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convert the values object to an array
    const dataArray = Object.values(pressureData) as Array<{ date: string; value: string; unit: string }>

    console.log("[v0] Pressure data points found:", dataArray.length)

    const transformedData = dataArray.map((item) => ({
      timestamp: item.date,
      value: Number.parseFloat(item.value),
    }))

    console.log("[v0] Pressure data transformed successfully, first value:", transformedData[0])

    return NextResponse.json({
      data: transformedData,
      lastUpdate: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      currentValue: transformedData[0]?.value || 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching pressure:", error)
    return NextResponse.json({ error: "Failed to fetch pressure data" }, { status: 500 })
  }
}
