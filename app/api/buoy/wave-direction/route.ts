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
      return 168
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

    const url = `${API_BASE}/${DEVICE_ID}/Waves/Angular/${formatDateForApi(past)}/${formatDateForApi(now)}?token=${TOKEN}`

    console.log("[v0] Fetching wave direction from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()

    console.log("[v0] Wave direction API response received")
    console.log("[v0] API Response structure:", JSON.stringify(apiResponse, null, 2).substring(0, 500))
    console.log("[v0] Has data?", !!apiResponse?.data)
    console.log("[v0] Has Waves?", !!apiResponse?.data?.Waves)
    console.log("[v0] Waves keys:", apiResponse?.data?.Waves ? Object.keys(apiResponse.data.Waves) : "none")

    // Try accessing with string key "0" instead of numeric index
    const wavesData = apiResponse?.data?.Waves
    const angularData = wavesData?.["0"]?.Angular || wavesData?.[0]?.Angular

    console.log("[v0] Angular data found?", !!angularData)
    if (angularData) {
      console.log("[v0] Angular data keys:", Object.keys(angularData))
    }

    if (!angularData || !angularData.VDIR?.values || !angularData.VPSP?.values) {
      console.log("[v0] No wave direction data found in API response")
      return NextResponse.json({
        data: [],
        lastUpdate: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      })
    }

    // Convert the numbered objects to arrays - access the values property
    const directionData = angularData.VDIR.values
    const spreadData = angularData.VPSP.values

    console.log("[v0] Wave direction data points found:", Object.keys(directionData).length)

    // Transform the data by combining VDIR and VPSP
    const transformedData = Object.keys(directionData).map((key) => {
      const dirItem = directionData[key]
      const sprItem = spreadData[key]

      return {
        timestamp: dirItem.date,
        direction: Number.parseFloat(dirItem.value),
        spread: sprItem ? Number.parseFloat(sprItem.value) : 0,
      }
    })

    // Sort by timestamp (most recent first)
    transformedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    console.log("[v0] Wave direction data transformed successfully, total points:", transformedData.length)
    console.log("[v0] First data point:", transformedData[0])

    return NextResponse.json({
      data: transformedData,
      lastUpdate: new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      currentValue: {
        direction: transformedData[0]?.direction || 0,
        spread: transformedData[0]?.spread || 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching wave direction:", error)
    return NextResponse.json({ error: "Failed to fetch wave direction data" }, { status: 500 })
  }
}
