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
export const fetchWaveHeight = (timeRange = "24h") => fetchBuoyData(`wave-height?range=${timeRange}`)

export const fetchAirTemperature = (timeRange = "24h") => fetchBuoyData(`temperature?range=${timeRange}`)

export const fetchWindSpeed = (timeRange = "24h") => fetchBuoyData(`wind-speed?range=${timeRange}`)

export const fetchAtmosphericPressure = (timeRange = "24h") => fetchBuoyData(`pressure?range=${timeRange}`)

export const fetchWaveCount = (timeRange = "24h") => fetchBuoyData(`wave-count?range=${timeRange}`)
