/**
 * Componente DashboardHeader
 * Header principal de la aplicación con logo, título y controles de navegación
 * Incluye botón para toggle del sidebar y información de actualización en tiempo real
 * Totalmente responsive con optimizaciones para móvil y desktop
 *
 * FUNCIONALIDAD STICKY:
 * - El header se mantiene fijo en la parte superior al hacer scroll
 * - Usa position: sticky para comportamiento suave y natural
 * - z-index alto para estar siempre visible sobre el contenido
 * - Compatible con todos los dispositivos y tamaños de pantalla
 */
"use client"

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  sidebarOpen: boolean // Estado actual del sidebar (abierto/cerrado)
  onToggleSidebar: () => void // Función callback para abrir/cerrar sidebar
}

export function DashboardHeader({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) {
  return (
    // - sticky: Posicionamiento sticky que se "pega" al top cuando haces scroll
    // - top-0: Se posiciona a 0px desde el top (pegado arriba)
    // - z-50: Índice z alto para estar sobre todo el contenido (valor estándar en Tailwind)
    // Header con fondo azul corporativo y borde inferior
    <header className="sticky top-0 z-50 border-b border-blue-800 bg-[#2B4C7E]">
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Layout flex con tres secciones: botón/logo, título, y estado */}
        <div className="flex items-center justify-between gap-3">
          {/* Sección izquierda: Botón de menú hamburguesa y logo */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Botón toggle para abrir/cerrar sidebar (solo visible en móvil/tablet) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-white hover:bg-blue-700 shrink-0"
              aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {/* Ícono de menú hamburguesa responsive */}
              <span className="text-xl">☰</span>
            </Button>

            {/* Logo de Puerto Arica con tamaño responsive */}
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shrink-0">
              <img
                src="/images/puerto-arica-logo-sin-fondo.png"
                alt="Puerto Arica - Empresa Portuaria Arica Logo"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Sección central: Título y subtítulo del sistema */}
          <div className="flex-1 min-w-0">
            {/* Título principal: SIMAR-EPA */}
            <h1 className="text-base md:text-xl font-bold text-white leading-tight">SIMAR-EPA</h1>
            {/* Subtítulo con truncate para evitar que se rompa en pantallas pequeñas */}
            <p className="text-xs md:text-sm text-blue-100 leading-tight mt-0.5 truncate">
              Sistema de Información Marítima
            </p>
          </div>

          {/* Sección derecha: Estado de monitoreo y hora de actualización */}
          <div className="text-right shrink-0">
            {/* Texto "Monitoreo en Tiempo Real" dividido en dos líneas para mejor ajuste */}
            <p className="text-xs md:text-sm font-medium text-white leading-tight whitespace-nowrap">Monitoreo en</p>
            <p className="text-xs md:text-sm font-medium text-white leading-tight whitespace-nowrap">Tiempo Real</p>
            {/* Etiqueta de última actualización */}
            <p className="text-[10px] md:text-xs text-blue-100 leading-tight mt-1 whitespace-nowrap">
              Última actualización:
            </p>
            {/* Hora actual formateada para zona horaria de Chile */}
            <p className="text-[10px] md:text-xs text-blue-100 leading-tight whitespace-nowrap">
              {new Date().toLocaleTimeString("es-CL")}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
