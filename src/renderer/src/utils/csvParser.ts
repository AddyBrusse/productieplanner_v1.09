import { ProductionNode, CSVRow, getNodeStatus, getRandomColor } from "@/types/production"

/**
 * Parse Dutch date format (DD-MM-YYYY) to Date object
 */
export const parseDutchDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Parse comma-separated number (1,5 -> 1.5)
 */
export const parseNumber = (numString: string): number => {
  return parseFloat(numString.replace(",", "."))
}

/**
 * Convert CSV row to ProductionNode
 */
export const csvRowToNode = (row: CSVRow, stepIndex: number = 0): ProductionNode => {
  const productionNumber = row.Productienummer.trim()
  const machineId = row.Bewerking.trim()
  const dueDate = parseDutchDate(row.LevDat)
  const startDate = parseDutchDate(row["Theoretische startdatum"])
  const hours = parseNumber(row.Uren)
  const quantity = parseNumber(row.Restant || row.Seriegrootte)

  const nodeId = `${productionNumber}-${machineId}-${stepIndex}`
  const color = getRandomColor(productionNumber)

  return {
    id: nodeId,
    productionNumber,
    calculationId: productionNumber,
    machineId,
    customer: row.Klantnaam.trim(),
    description: row.Omschrijving.trim(),
    dueDate,
    startDate,
    hours,
    seriesSize: parseNumber(row.Seriegrootte),
    nextOperation: row["Volgende bewerking"]?.trim() || undefined,
    status: getNodeStatus(dueDate),
    quantity,
    color,
    position: undefined, // Will be calculated based on algorithm
  }
}

/**
 * Parse CSV string to ProductionNode array
 * Expected format: semicolon-separated with Dutch date format
 */
export const parseCSVToNodes = (csvContent: string): ProductionNode[] => {
  const lines = csvContent.split("\n").filter((line) => line.trim())
  if (lines.length < 2) return []

  // Parse header
  const headerLine = lines[0]
  const headers = headerLine.split(";").map((h) => h.trim())

  // Parse rows
  const nodes: ProductionNode[] = []
  const processedProductions = new Set<string>()

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(";").map((v) => v.trim())

    // Create row object
    const row: Partial<CSVRow> = {}
    headers.forEach((header, index) => {
      row[header as keyof CSVRow] = values[index] || ""
    })

    // Skip if production number is empty or already processed (to avoid duplicates in this parse)
    const productionNumber = row.Productienummer as string
    if (!productionNumber) continue

    // Create node
    const node = csvRowToNode(row as CSVRow, 0)
    nodes.push(node)
  }

  return nodes
}

/**
 * Filter out already planned calculations
 * Useful when re-importing data - skip calculations that already have positions saved
 */
export const filterNewCalculations = (
  newNodes: ProductionNode[],
  existingNodes: ProductionNode[]
): ProductionNode[] => {
  const existingCalcIds = new Set(
    existingNodes.filter((n) => n.position).map((n) => n.calculationId)
  )
  return newNodes.filter((n) => !existingCalcIds.has(n.calculationId))
}
