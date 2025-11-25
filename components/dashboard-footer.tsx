/**
 * Componente de Footer del Dashboard
 *
 * Muestra información de contacto de la Empresa Portuaria Arica y contador de visitas.
 * Se mantiene siempre en la parte inferior de la página.
 */

import { VisitCounter } from "./visit-counter"

export function DashboardFooter() {
  return (
    // Footer con fondo azul institucional, padding vertical reducido y sin margin-top
    // El mt-auto se maneja desde el layout para que siempre esté al fondo
    <footer className="bg-[#2B4C7E] text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2">
          {/* Contador de visitas centrado */}
          <div className="flex justify-center">
            <VisitCounter />
          </div>
          {/* Información de contacto con enlaces interactivos */}
          <p className="text-center text-sm">
            Empresa Portuaria Arica © 2025 {/* Enlace a Google Maps con la dirección */}
            <a
              href="https://maps.google.com/?q=Avda.+Máximo+Lira+389,+Arica"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              Avda. Máximo Lira #389, Arica
            </a>{" "}
            Fono: {/* Enlace para llamar directo desde dispositivos móviles */}
            <a href="tel:+56582593400" className="underline hover:text-blue-200 transition-colors">
              (+5658) 2593400
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
