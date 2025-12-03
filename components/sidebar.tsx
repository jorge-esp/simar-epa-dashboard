/**
 * Sidebar de Navegación
 *
 * Menú lateral con enlaces a todas las secciones del dashboard.
 * Responsive: se sobrepone en móvil, siempre visible en desktop.
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  HomeIcon,
  WaveIcon,
  CompassIcon,
  WindIcon,
  ThermometerIcon,
  GaugeIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  BookIcon,
  HelpCircleIcon,
} from "@/components/icons"

const navigation = [
  { name: "Inicio", href: "/", icon: HomeIcon },
  { name: "Altura de Olas", href: "/graficos/altura-olas", icon: WaveIcon },
  { name: "Dirección de Olas", href: "/graficos/direccion-olas", icon: CompassIcon },
  { name: "Velocidad del Viento", href: "/graficos/velocidad-viento", icon: WindIcon },
  { name: "Temperatura", href: "/graficos/temperatura", icon: ThermometerIcon },
  { name: "Presión Atmosférica", href: "/graficos/presion", icon: GaugeIcon },
  { name: "Cantidad de Olas", href: "/graficos/cantidad-olas", icon: TrendingUpIcon },
  { name: "Reportes Comunitarios", href: "/reportes-comunitarios", icon: MessageSquareIcon },
  { name: "Glosario", href: "/glosario", icon: BookIcon },
  { name: "Guía de Lectura", href: "/guia", icon: HelpCircleIcon },
]

interface SidebarProps {
  isOpen: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed md:relative inset-y-0 left-0 z-40",
        "w-64 border-r border-border",
        "transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        !isOpen && "md:w-0 md:border-r-0 md:overflow-hidden",
        "flex flex-col overflow-y-auto",
      )}
      style={{ backgroundColor: "#ffffff" }}
    >
      <nav className="flex-1 p-4 space-y-1 pt-24 md:pt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const IconComponent = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <IconComponent size={18} className="flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border flex-shrink-0">
        <p className="text-xs text-muted-foreground text-center">© 2025 Empresa Portuaria Arica</p>
      </div>
    </aside>
  )
}
