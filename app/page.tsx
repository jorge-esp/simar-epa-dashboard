import { DashboardHeader } from "@/components/dashboard-header"
import { WaveHeightChart } from "@/components/wave-height-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { WindSpeedChart } from "@/components/wind-speed-chart"
import { PressureChart } from "@/components/pressure-chart"
import { WaveCountChart } from "@/components/wave-count-chart"
import { BuoyStatus } from "@/components/buoy-status"
import { DashboardFooter } from "@/components/dashboard-footer"
import { EntrySurvey } from "@/components/entry-survey"
import { ExitSurvey } from "@/components/exit-survey"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6 flex-1">
        {/* Status Overview */}
        <BuoyStatus />

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WaveHeightChart />
          <WindSpeedChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TemperatureChart />
          <PressureChart />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <WaveCountChart />
        </div>
      </main>

      <DashboardFooter />

      <EntrySurvey />
      <ExitSurvey />
    </div>
  )
}
