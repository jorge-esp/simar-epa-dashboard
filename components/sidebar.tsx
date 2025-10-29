"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Waves, Wind, Thermometer, Gauge, Activity, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Inicio", href: "/", icon: Home },
  { name: "Altura de Olas", href: "/graficos/altura-olas", icon: Waves },
  { name: "Dirección de Olas", href: "/graficos/direccion-olas", icon: Navigation },
  { name: "Velocidad del Viento", href: "/graficos/velocidad-viento", icon: Wind },
  { name: "Temperatura", href: "/graficos/temperatura", icon: Thermometer },
  { name: "Presión Atmosférica", href: "/graficos/presion", icon: Gauge },
  { name: "Cantidad de Olas", href: "/graficos/cantidad-olas", icon: Activity },
]

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        "fixed md:relative inset-y-0 left-0 z-40",
        isOpen ? "w-64" : "w-0 md:w-0 -translate-x-full md:translate-x-0 border-r-0",
        isOpen && "translate-x-0",
      )}
    >
      <div className="min-w-64 flex flex-col h-full">
        <nav className="flex-1 p-4 space-y-1 pt-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">© 2025 Empresa Portuaria Arica</p>
        </div>
      </div>
    </aside>
  )
}
