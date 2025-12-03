/**
 * Layout del Cliente
 *
 * Componente principal que estructura el dashboard con:
 * - Sidebar de navegación (responsive)
 * - Header con información en tiempo real
 * - Contenedor principal para páginas
 * - Footer con información adicional
 * - Encuestas de entrada/salida
 */

"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardFooter } from "@/components/dashboard-footer"
import { EntrySurvey } from "@/components/entry-survey"
import { ExitSurvey } from "@/components/exit-survey"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Estado para controlar apertura/cierre del sidebar en móvil
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={closeSidebar} aria-hidden="true" />
      )}

      {/* Sidebar de navegación */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Contenedor principal con flex para empujar footer al fondo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header con toggle del sidebar */}
        <DashboardHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Contenedor de contenido que crece para empujar el footer */}
          <div className="flex-1 container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            {/* Suspense para lazy loading de componentes */}
            <Suspense fallback={null}>{children}</Suspense>
          </div>
          <DashboardFooter />
        </main>
      </div>

      {/* Encuestas modales */}
      <EntrySurvey />
      <ExitSurvey />
    </div>
  )
}
