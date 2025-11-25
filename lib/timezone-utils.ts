/**
 * Utilidades para manejo de zona horaria de Chile (UTC-3)
 *
 * La API de la boya retorna timestamps en UTC, y necesitamos
 * convertirlos a hora de Chile (Santiago) que es UTC-3.
 */

/**
 * Convierte un timestamp UTC a hora de Chile (UTC-3)
 * @param utcTimestamp - String timestamp en formato "YYYY-MM-DD HH:MM:SS" (UTC)
 * @returns Date ajustado a zona horaria de Chile (UTC-3)
 */
export function convertToChileTime(utcTimestamp: string | Date): Date {
  // Si ya es un objeto Date, asumimos que es UTC
  // Si es string, le agregamos " UTC" para forzar el parseo como UTC
  const utcDate = typeof utcTimestamp === "string" ? new Date(utcTimestamp + " UTC") : utcTimestamp

  // Chile está 3 horas DETRÁS de UTC
  // Restamos 3 horas al tiempo UTC para obtener la hora local de Chile
  // El objeto Date resultante representará la hora de Chile pero en "tiempo UTC"
  // Ejemplo: Si es 13:00 UTC, restamos 3h -> 10:00 UTC (que visualmente es la hora de Chile)
  // Luego al formatear debemos forzar la zona horaria UTC para mantener ese valor
  const chileDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000)

  return chileDate
}

/**
 * Formatea una fecha con opciones personalizadas en hora de Chile
 * @param timestamp - Timestamp UTC a formatear
 * @param options - Opciones de formato
 * @returns String formateado en español (Chile)
 */
export function formatChileTime(timestamp: string | Date, options: Intl.DateTimeFormatOptions): string {
  const chileDate = convertToChileTime(timestamp)
  // Forzamos timeZone: 'UTC' para mostrar la hora que calculamos manualmente
  return chileDate.toLocaleString("es-CL", { ...options, timeZone: "UTC" })
}

/**
 * Formatea solo la fecha (día y mes) en hora de Chile
 * @param timestamp - Timestamp UTC a formatear
 * @returns String en formato "5 ene", "23 feb", etc.
 */
export function formatChileDate(timestamp: string | Date): string {
  const chileDate = convertToChileTime(timestamp)
  return chileDate.toLocaleDateString("es-CL", { day: "numeric", month: "short", timeZone: "UTC" })
}

/**
 * Formatea fecha y hora completa en hora de Chile
 * @param timestamp - Timestamp UTC a formatear
 * @returns String en formato "5 ene 14:30", "23 feb 09:15", etc.
 */
export function formatChileDateTime(timestamp: string | Date): string {
  const chileDate = convertToChileTime(timestamp)
  return chileDate.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Usar formato 24 horas
    timeZone: "UTC",
  })
}

/**
 * Formatea solo la hora en formato HH:MM para los gráficos
 * Convierte de UTC a hora de Chile (UTC-3)
 * @param timestamp - Timestamp UTC de la API en formato "YYYY-MM-DD HH:MM:SS"
 * @returns String en formato "19:40", "22:00", etc. en hora de Chile
 */
export function formatChileTimeOnly(timestamp: Date | string): string {
  const chileDate = convertToChileTime(timestamp)

  return chileDate.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  })
}

/**
 * Determina si se debe mostrar fecha en vez de solo hora
 * basado en el rango de tiempo seleccionado
 * @param timeRange - Rango de tiempo del gráfico
 * @returns true si se debe mostrar fecha, false para mostrar solo hora
 */
export function shouldShowDate(timeRange: string): boolean {
  return timeRange === "48h" || timeRange === "7d"
}
