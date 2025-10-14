import Image from "next/image"

export function DashboardHeader() {
  return (
    <header className="border-b border-blue-800 bg-[#2B4C7E]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/images/puerto-arica-logo-sin-fondo.png"
              alt="Puerto Arica - Empresa Portuaria Arica"
              width={180}
              height={80}
              className="object-contain"
            />
            <div className="border-l border-blue-400 pl-4">
              <h1 className="text-xl font-semibold text-white">SIMAR-EPA</h1>
              <p className="text-sm text-blue-100">Sistema de Información Marítima</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">Monitoreo en Tiempo Real</p>
              <p className="text-xs text-blue-100">Última actualización: {new Date().toLocaleTimeString("es-CL")}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
