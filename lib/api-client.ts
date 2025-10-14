export interface ApiDataPoint {
  timestamp: string
  value: number
}

export interface ApiResponse {
  data: ApiDataPoint[]
  lastUpdate: string
}

// Generic fetcher for local API routes
async function fetchBuoyData(endpoint: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/buoy/${endpoint}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    throw error
  }
}

// Specific API fetchers
export const fetchWaveHeight = () => fetchBuoyData("wave-height")

export const fetchAirTemperature = () => fetchBuoyData("temperature")

export const fetchWindSpeed = () => fetchBuoyData("wind-speed")

export const fetchAtmosphericPressure = () => fetchBuoyData("pressure")

export const fetchWaveCount = () => fetchBuoyData("wave-count")
