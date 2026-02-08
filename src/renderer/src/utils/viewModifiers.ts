export type ZoomLevel = 'day' | 'week' | 'month'

export const ZOOM_CONFIGS: Record<ZoomLevel, { days: number; label: string }> = {
  day: { days: 1, label: 'Dag' },
  week: { days: 7, label: 'Week' },
  month: { days: 30, label: 'Maand' },
}

/**
 * Get the start date for a specific view
 */
export function getViewStartDate(baseDate: Date, zoomLevel: ZoomLevel): Date {
  const date = new Date(baseDate)

  switch (zoomLevel) {
    case 'day':
      date.setHours(0, 0, 0, 0)
      break
    case 'week':
      // Start from Monday
      const dayOfWeek = date.getDay()
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
      date.setDate(diff)
      date.setHours(0, 0, 0, 0)
      break
    case 'month':
      // Start from first day of month
      date.setDate(1)
      date.setHours(0, 0, 0, 0)
      break
  }

  return date
}

/**
 * Get the end date for a specific view
 */
export function getViewEndDate(startDate: Date, zoomLevel: ZoomLevel): Date {
  const endDate = new Date(startDate)
  const daysToAdd = ZOOM_CONFIGS[zoomLevel].days
  endDate.setDate(endDate.getDate() + daysToAdd - 1)
  endDate.setHours(23, 59, 59, 999)
  return endDate
}

/**
 * Navigate to next period
 */
export function getNextPeriod(startDate: Date, zoomLevel: ZoomLevel): Date {
  const nextDate = new Date(startDate)
  const daysToAdd = ZOOM_CONFIGS[zoomLevel].days
  nextDate.setDate(nextDate.getDate() + daysToAdd)
  return getViewStartDate(nextDate, zoomLevel)
}

/**
 * Navigate to previous period
 */
export function getPreviousPeriod(startDate: Date, zoomLevel: ZoomLevel): Date {
  const prevDate = new Date(startDate)
  const daysToSubtract = ZOOM_CONFIGS[zoomLevel].days
  prevDate.setDate(prevDate.getDate() - daysToSubtract)
  return getViewStartDate(prevDate, zoomLevel)
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: Date, endDate: Date, zoomLevel: ZoomLevel): string {
  const monthNames = [
    'januari',
    'februari',
    'maart',
    'april',
    'mei',
    'juni',
    'juli',
    'augustus',
    'september',
    'oktober',
    'november',
    'december',
  ]
  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']

  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startMonth = monthNames[startDate.getMonth()]
  const endMonth = monthNames[endDate.getMonth()]
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()

  switch (zoomLevel) {
    case 'day':
      return `${dayNames[startDate.getDay()]} ${startDay} ${startMonth} ${startYear}`
    case 'week':
      if (startDate.getMonth() === endDate.getMonth()) {
        return `Week ${getWeekNumber(startDate)} - ${startDay} tot ${endDay} ${startMonth} ${startYear}`
      }
      return `${startDay} ${startMonth} tot ${endDay} ${endMonth} ${startYear}`
    case 'month':
      return `${startMonth} ${startYear}`
  }
}

/**
 * Get ISO week number
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Get today's date normalized
 */
export function getTodayNormalized(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = getTodayNormalized()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}
