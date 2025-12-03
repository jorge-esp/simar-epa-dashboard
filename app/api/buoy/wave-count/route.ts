import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    // Calcular fechas para el rango de tiempo
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000)

    // Formatear fechas para la API (YYYY-MM-DD HH:mm:ss)
    const formatDate = (date: Date) => {
      return date.toISOString().slice(0, 19).replace("T", " ")
    }

    const startStr = formatDate(startDate)
    const endStr = formatDate(endDate)

    const apiUrl = `https://oceancom.msm-data.com/api/device/10/Waves/Wave%20Count/${startStr}/${endStr}?token=91b448bbb9d19b6c651e8f4832fcb6c9`

    console.log("[v0] Fetching wave count data from:", apiUrl)

    const response = await fetch(apiUrl, {
      next: { revalidate: 300 }, // Cache de 5 minutos
    })

    if (!response.ok) {
      console.error("[v0] Wave count API error:", response.status, response.statusText)
      throw new Error(`API error: ${response.status}`)
    }

    const apiResponse = await response.json()
    console.log("[v0] Wave count data structure keys:", Object.keys(apiResponse))

    const waveCountData = apiResponse?.data?.Waves?.["0"]?.["Wave Count"]?.VQTY?.values

    if (!waveCountData) {
      console.error("[v0] Could not find wave count data in expected structure")
      return NextResponse.json({ lastUpdate: null, data: [] })
    }

    // Convertir el objeto de valores a un array
    const valuesArray = Object.values(waveCountData)
    console.log("[v0] Wave count data points found:", valuesArray.length)

    if (valuesArray.length > 0) {
      console.log("[v0] First wave count value:", valuesArray[0])
      console.log("[v0] Last wave count value:", valuesArray[valuesArray.length - 1])
    }

    // Transformar los datos al formato esperado por el gráfico
    const transformedData = valuesArray.map((item: any) => ({
      timestamp: item.date,
      value: Number.parseFloat(item.value),
    }))

    console.log("[v0] Transformed wave count data points:", transformedData.length)

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
