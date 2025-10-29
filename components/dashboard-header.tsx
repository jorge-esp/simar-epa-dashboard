"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface DashboardHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) {
  return (
    <header className="border-b border-blue-800 bg-[#2B4C7E]">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-3">
          {/* Left section: Menu button and logo */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-white hover:bg-blue-700 shrink-0"
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </Button>

            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shrink-0">
              <Image
                src="/images/puerto-arica-logo.png"
                alt="Puerto Arica Logo"
                width={64}
                height={64}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Center section: Title and subtitle */}
          <div className="flex-1 min-w-0">
            <h1 className="text-base md:text-xl font-bold text-white leading-tight">SIMAR-EPA</h1>
            <p className="text-xs md:text-sm text-blue-100 leading-tight mt-0.5 truncate">
              Sistema de Información Marítima
            </p>
          </div>

          {/* Right section: Status info */}
          <div className="text-right shrink-0">
            <p className="text-xs md:text-sm font-medium text-white leading-tight whitespace-nowrap">Monitoreo en</p>
            <p className="text-xs md:text-sm font-medium text-white leading-tight whitespace-nowrap">Tiempo Real</p>
            <p className="text-[10px] md:text-xs text-blue-100 leading-tight mt-1 whitespace-nowrap">
              Última actualización:
            </p>
            <p className="text-[10px] md:text-xs text-blue-100 leading-tight whitespace-nowrap">
              {new Date().toLocaleTimeString("es-CL")}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
