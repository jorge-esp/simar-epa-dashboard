export function convertToChileTime(utcDate: Date): Date {
  const chileOffset = -3 * 60 // Chile is UTC-3 (in minutes)
  const utcOffset = utcDate.getTimezoneOffset() // Current timezone offset
  const totalOffset = chileOffset - utcOffset

  return new Date(utcDate.getTime() + totalOffset * 60 * 1000)
}

export function formatChileTime(date: Date, options: Intl.DateTimeFormatOptions): string {
  const chileDate = convertToChileTime(date)
  return chileDate.toLocaleString("es-CL", options)
}

export function formatChileDate(date: Date): string {
  const chileDate = convertToChileTime(date)
  return chileDate.toLocaleDateString("es-CL", { day: "numeric", month: "short" })
}

export function formatChileDateTime(date: Date): string {
  const chileDate = convertToChileTime(date)
  return chileDate.toLocaleString("es-CL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
