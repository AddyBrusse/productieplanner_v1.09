/**
 * Timeline utilities for production planning
 * Handles calculations for day headers, time slots, and positioning
 */

export const SLOT_DURATION_HOURS = 2
export const PIXELS_PER_HOUR = 50 // Base pixel width per hour
export const PIXELS_PER_SLOT = PIXELS_PER_HOUR * SLOT_DURATION_HOURS // 100px per 2-hour slot
export const SLOT_HEIGHT = 60 // Height of each slot row
export const MACHINE_ROW_HEIGHT = 120 // Height allocated for each machine row
export const HEADER_HEIGHT = 60 // Header row height

export const DUTCH_DAY_NAMES = [
  "Zondag",
  "Maandag",
  "Dinsdag",
  "Woensdag",
  "Donderdag",
  "Vrijdag",
  "Zaterdag",
]

export const DUTCH_MONTHS = [
  "januari",
  "februari",
  "maart",
  "april",
  "mei",
  "juni",
  "juli",
  "augustus",
  "september",
  "oktober",
  "november",
  "december",
]

/**
 * Get array of days to display in timeline
 * @param startDate - First day to show
 * @param numberOfDays - How many days to display
 * @returns Array of Date objects
 */
export const getTimelineDays = (startDate: Date, numberOfDays: number): Date[] => {
  const days: Date[] = []
  const date = new Date(startDate)
  date.setHours(0, 0, 0, 0)

  for (let i = 0; i < numberOfDays; i++) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

/**
 * Format date as "Maandag 10 feb"
 */
export const formatDayHeader = (date: Date): string => {
  const dayName = DUTCH_DAY_NAMES[date.getDay()]
  const day = date.getDate()
  const month = DUTCH_MONTHS[date.getMonth()].substring(0, 3)
  return `${dayName} ${day} ${month}`
}

/**
 * Format time slot as "08:00" or "13:00"
 */
export const formatTimeSlot = (slotIndex: number): string => {
  const hour = 6 + slotIndex * SLOT_DURATION_HOURS // Start at 6:00
  return `${String(hour).padStart(2, "0")}:00`
}

/**
 * Get time slots for a single day (2-hour slots from 6:00 to 22:00)
 * @returns Array of time slot strings
 */
export const getDayTimeSlots = (): string[] => {
  const slots: string[] = []
  for (let i = 0; i < 8; i++) {
    // 8 slots × 2 hours = 16 hours (6:00-22:00)
    slots.push(formatTimeSlot(i))
  }
  return slots
}

/**
 * Calculate X position (pixels) for a date/time on the timeline
 * @param date - Start date of node
 * @param timelineStartDate - First day shown on timeline
 * @param startHour - Hour of day (0-23)
 * @returns Pixel distance from left
 */
export const getXPositionForDateTime = (
  date: Date,
  timelineStartDate: Date,
  startHour: number
): number => {
  // Days offset from timeline start
  const daysOffset = Math.floor(
    (date.getTime() - timelineStartDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Hours offset within the day (adjusted for our 6:00 start time)
  const hourOffset = Math.max(0, startHour - 6)
  const slotOffset = hourOffset / SLOT_DURATION_HOURS

  // Total pixel position
  return daysOffset * getDayTimeSlots().length * PIXELS_PER_SLOT + slotOffset * PIXELS_PER_SLOT
}

/**
 * Calculate width (pixels) for a duration
 * @param hours - Duration in hours
 * @returns Pixel width
 */
export const getWidthForDuration = (hours: number): number => {
  return (hours / SLOT_DURATION_HOURS) * PIXELS_PER_SLOT
}

/**
 * Calculate Y position (pixels) for a machine
 * @param machineIndex - Index of machine in sorted list
 * @returns Pixel distance from top
 */
export const getYPositionForMachine = (machineIndex: number): number => {
  return machineIndex * MACHINE_ROW_HEIGHT
}

/**
 * Get unique machines from nodes, sorted
 * @param nodes - Array of production nodes
 * @returns Sorted array of unique machine IDs
 */
export const getUniqueMachines = (nodes: any[]): string[] => {
  const machines = new Set(nodes.map((n) => n.machineId))
  return Array.from(machines).sort()
}

/**
 * Get machine index in sorted list
 * @param machineId - Machine ID to find
 * @param machines - Sorted array of machines
 * @returns Index of machine (for Y positioning)
 */
export const getMachineIndex = (machineId: string, machines: string[]): number => {
  return machines.indexOf(machineId)
}

/**
 * Calculate timeline width needed for all days
 * @param numberOfDays - Number of days to show
 * @returns Total pixel width
 */
export const getTimelineWidth = (numberOfDays: number): number => {
  return numberOfDays * getDayTimeSlots().length * PIXELS_PER_SLOT
}

/**
 * Calculate timeline height needed for all machines
 * @param numberOfMachines - Number of machines
 * @returns Total pixel height
 */
export const getTimelineHeight = (numberOfMachines: number): number => {
  return HEADER_HEIGHT + numberOfMachines * MACHINE_ROW_HEIGHT + 50 // 50px padding
}
