import { NextResponse } from "next/server"

const API_BASE = "https://oceancom.msm-data.com/api"
const TOKEN = "91b448bbb9d19b6c651e8f4832fcb6c9"

export async function GET() {
  try {
    const url = `${API_BASE}/device/lastStatus/10/MMB03/recent/?token=${TOKEN}`

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const apiResponse = await response.json()

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

    // Find specific data points by name
    const findByName = (name: string) => dataArray.find((item: any) => item.name === name)

    const latitudeData = findByName("Latitude")
    const longitudeData = findByName("Longitude")
    const distanceData = findByName("Distance from anchor")
    const memoryData = findByName("Memory")
    const voltageData = findByName("V2") // Using V2 as main voltage
    const currentData = findByName("Input Total")
    const alarmsData = findByName("Alarms")

    const result = {
      voltage: voltageData?.value ? Number(voltageData.value) : null,
      current: currentData?.value ? Number(currentData.value) : null,
      memory: memoryData?.value ? Number(memoryData.value) : null,
      latitude: latitudeData?.value ? Number(latitudeData.value) : null,
      longitude: longitudeData?.value ? Number(longitudeData.value) : null,
      distance: distanceData?.value ? Number(distanceData.value) : null,
      alarms: alarmsData?.value ? Number(alarmsData.value) : null,
      lastUpdate: latitudeData?.date_time_data || null,
    }

    console.log("[v0] Buoy status extracted:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching buoy status:", error)
    return NextResponse.json({ error: "Failed to fetch buoy status" }, { status: 500 })
  }
}
