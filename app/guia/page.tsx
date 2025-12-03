import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function GuiaPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Encabezado de la página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
          <Icons.book className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Guía de Lectura de Datos
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Aprende a interpretar los gráficos y datos del sistema de monitoreo SIMAR-EPA
        </p>
      </div>

      <div className="rounded-lg border bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Icons.info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-blue-900">Actualización de Datos</h3>
            <p className="text-xs sm:text-sm text-blue-800 mt-1">
              Los datos se actualizan automáticamente cada 10 minutos, coincidiendo con la frecuencia de transmisión de
              la boya. La hora de última actualización se muestra en cada gráfico. Todos los horarios están en zona
              horaria de Chile (UTC-3).
            </p>
          </div>
        </div>
      </div>

      {/* Cómo leer los gráficos */}
      <Card className="bg-card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-card-foreground flex items-center gap-2 text-lg sm:text-xl">
            <Icons.trend className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Cómo Leer los Gráficos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Elementos Comunes</h3>
            <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong className="text-foreground">Eje X (Horizontal):</strong> Representa el tiempo. Puede mostrar
                  horas (12h, 24h) según el rango seleccionado.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong className="text-foreground">Eje Y (Vertical):</strong> Representa el valor de la medición
                  (metros, m/s, °C, hPa, etc.).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong className="text-foreground">Línea del Gráfico:</strong> Muestra cómo ha variado el valor a lo
                  largo del tiempo. Pendiente ascendente = aumento, descendente = disminución.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong className="text-foreground">Valor Actual:</strong> Mostrado en la esquina superior derecha con
                  un punto de color. Es la medición más reciente.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>
                  <strong className="text-foreground">Promedio:</strong> Valor medio de todas las mediciones en el
                  período seleccionado. Útil para comparar con el valor actual.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mt-3 sm:mt-4">
            <p className="text-xs sm:text-sm text-muted-foreground">
              <strong className="text-foreground">Consejo:</strong> Pasa el cursor sobre cualquier punto del gráfico
              para ver los valores exactos en ese momento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rangos de Tiempo */}
      <Card className="bg-card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-card-foreground text-base sm:text-lg">Selección de Rangos de Tiempo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">12 horas</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ideal para ver condiciones actuales y tendencias inmediatas. Útil para planificar actividades del día.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">24 horas</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Muestra el ciclo completo día-noche. Perfecto para entender patrones diarios y planificar el día
                siguiente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
