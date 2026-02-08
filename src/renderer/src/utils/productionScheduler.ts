import { ProductionNode } from "@/types/production"
import { calculateNodeStartTime } from "@/utils/timelineUtils"

const OPERATING_HOURS = { start: 6, end: 22 } // 6:00 to 22:00
const HOURS_PER_DAY = OPERATING_HOURS.end - OPERATING_HOURS.start // 16 hours

/**
 * Calculate the optimal start time for a node by working backwards from due date
 * Uses calculateNodeStartTime from timelineUtils
 */
export function scheduleNode(node: ProductionNode): Date {
  return calculateNodeStartTime(node.dueDate, node.hours)
}

/**
 * Check if a time slot is available on a specific machine
 */
export function isSlotAvailable(
  machineId: string,
  startTime: Date,
  endTime: Date,
  occupiedSlots: Array<{ machineId: string; startTime: Date; endTime: Date }>
): boolean {
  return !occupiedSlots.some(
    (slot) =>
      slot.machineId === machineId &&
      !(endTime <= slot.startTime || startTime >= slot.endTime)
  )
}

/**
 * Find the next available time slot on a machine
 */
export function findAvailableSlot(
  machineId: string,
  requestedStartTime: Date,
  durationHours: number,
  occupiedSlots: Array<{ machineId: string; startTime: Date; endTime: Date }>
): Date {
  let currentStart = new Date(requestedStartTime)

  while (true) {
    const currentEnd = new Date(currentStart)
    currentEnd.setHours(currentEnd.getHours() + durationHours)

    // Check if within operating hours
    const startHour = currentStart.getHours()
    const endHour = currentEnd.getHours()

    if (
      startHour >= OPERATING_HOURS.start &&
      endHour <= OPERATING_HOURS.end &&
      isSlotAvailable(machineId, currentStart, currentEnd, occupiedSlots)
    ) {
      return currentStart
    }

    // Move to next slot (2 hours)
    currentStart.setHours(currentStart.getHours() + 2)

    // Safety check: don't search more than 60 days ahead
    if (currentStart.getTime() - requestedStartTime.getTime() > 60 * 24 * 60 * 60 * 1000) {
      console.warn(`No available slot found for machine ${machineId}`)
      return requestedStartTime
    }
  }
}

/**
 * Schedule all nodes with conflict resolution
 */
export function scheduleAllNodes(nodes: ProductionNode[]): Map<string, Date> {
  const schedule = new Map<string, Date>()
  const occupiedSlots: Array<{ machineId: string; startTime: Date; endTime: Date }> = []

  // Sort nodes by due date (earliest first)
  const sortedNodes = [...nodes].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())

  sortedNodes.forEach((node) => {
    let scheduledStart = scheduleNode(node)

    // Check for conflicts and find available slot if needed
    const scheduledEnd = new Date(scheduledStart)
    scheduledEnd.setHours(scheduledEnd.getHours() + node.hours)

    if (!isSlotAvailable(node.machineId, scheduledStart, scheduledEnd, occupiedSlots)) {
      scheduledStart = findAvailableSlot(
        node.machineId,
        scheduledStart,
        node.hours,
        occupiedSlots
      )
    }

    schedule.set(node.id, scheduledStart)

    // Track occupied slot
    const endTime = new Date(scheduledStart)
    endTime.setHours(endTime.getHours() + node.hours)
    occupiedSlots.push({
      machineId: node.machineId,
      startTime: scheduledStart,
      endTime,
    })
  })

  return schedule
}

/**
 * Calculate optimal layout considering due dates and dependencies
 */
export function calculateOptimalLayout(nodes: ProductionNode[]): Map<string, { startTime: Date }> {
  const schedule = scheduleAllNodes(nodes)
  const layout = new Map<string, { startTime: Date }>()

  schedule.forEach((startTime, nodeId) => {
    layout.set(nodeId, { startTime })
  })

  return layout
}

/**
 * Get operating hours for a specific date
 */
export function getOperatingHoursForDate(date: Date): { start: number; end: number } {
  // Could be extended to support different schedules per day of week
  return { start: OPERATING_HOURS.start, end: OPERATING_HOURS.end }
}

/**
 * Calculate if a node is on schedule
 */
export function isNodeOnSchedule(node: ProductionNode, scheduledStart: Date): boolean {
  const scheduledEnd = new Date(scheduledStart)
  scheduledEnd.setHours(scheduledEnd.getHours() + node.hours)
  return scheduledEnd <= node.dueDate
}
