import { VisitCounter } from "./visit-counter"

export function DashboardFooter() {
  return (
    <footer className="bg-[#2B4C7E] text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            <VisitCounter />
          </div>
          <p className="text-center text-sm">
            Empresa Portuaria Arica © 2025{" "}
            <a
              href="https://maps.google.com/?q=Avda.+Máximo+Lira+389,+Arica"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200 transition-colors"
            >
              Avda. Máximo Lira #389, Arica
            </a>{" "}
            Fono:{" "}
            <a href="tel:+56582593400" className="underline hover:text-blue-200 transition-colors">
              (+5658) 2593400
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
