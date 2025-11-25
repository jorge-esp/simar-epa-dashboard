import { CommunityReportForm } from "@/components/community-report-form"
import { CommunityReportsFeed } from "@/components/community-reports-feed"

export default function ReportesComunitariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes Comunitarios</h1>
        <p className="text-muted-foreground mt-2">
          Comparte y consulta observaciones de la comunidad marítima sobre las condiciones actuales
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CommunityReportForm />
        </div>
        <div className="lg:col-span-2">
          <CommunityReportsFeed />
        </div>
      </div>
    </div>
  )
}
