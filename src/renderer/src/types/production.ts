// Production planning data types

export type NodeStatus = "ontime" | "due" | "late"

export interface ProductionNode {
  id: string // `${productionNumber}-${machineId}-${step}`
  productionNumber: string // Productienummer
  calculationId: string // Same as productionNumber, used for grouping
  machineId: string // Bewerking (DR001, FR001, etc.)
  customer: string // Klantnaam
  description: string // Omschrijving
  dueDate: Date // LevDat
  startDate: Date // Theoretische startdatum
  hours: number // Uren (duration in hours)
  seriesSize: number // Seriegrootte
  nextOperation?: string // Volgende bewerking
  status: NodeStatus // Calculated based on dueDate
  quantity: number // Restant (remaining quantity)
  
  // UI/Layout properties
  position?: { x: number; y: number } // Saved position on canvas
  color?: string // Random color for calculation group
}

export interface CSVRow {
  Productienummer: string
  MatOK: string
  "Theoretische startdatum": string
  Klantnaam: string
  Omschrijving: string
  Tekeningnummer: string
  Bewerking: string
  BewGereed: string
  "Volgende bewerking": string
  BewStat: string
  LevDat: string
  Seriegrootte: string
  VrgBwplStat: string
  Restant: string
  Uren: string
  Status: string
  Bestelhoeveelheid: string
  Doorlooptijd: string
  Referentie: string
  Projectnummer: string
}

export const getNodeStatus = (dueDate: Date): NodeStatus => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDateOnly = new Date(dueDate)
  dueDateOnly.setHours(0, 0, 0, 0)

  const daysUntilDue = Math.floor(
    (dueDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilDue < 0) return "late"
  if (daysUntilDue === 0) return "due"
  return "ontime"
}

export const nodeStatusColors = {
  onetime: "#10b981", // Green - on time
  due: "#f59e0b", // Orange - due today
  late: "#ef4444", // Red - late
}

// Color palette for calculation groups
export const colorPalette = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#14b8a6", // Teal
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#6b7280", // Gray
]

export const getRandomColor = (seed: string): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  const index = Math.abs(hash) % colorPalette.length
  return colorPalette[index]
}
