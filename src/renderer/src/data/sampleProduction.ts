import { ProductionNode } from "@/types/production"

/**
 * Sample production nodes for testing and development
 * Based on real CNC machining operations
 */
export const sampleNodes: ProductionNode[] = [
  {
    id: "002329-DR001-0",
    productionNumber: "002329",
    calculationId: "003003",
    machineId: "DR001",
    customer: "Stinis Holland B.V.",
    description: "Astap ø16x25-ø18x22/M16",
    dueDate: new Date(2024, 3, 5), // 05-04-2024
    startDate: new Date(2024, 3, 4), // 04-04-2024
    hours: 1.1333,
    seriesSize: 1,
    nextOperation: undefined,
    status: "late",
    quantity: 1,
    color: "#3b82f6",
    position: undefined,
  },
  {
    id: "003003-DR001-0",
    productionNumber: "002329",
    calculationId: "003003",
    machineId: "FR001",
    customer: "Post Metaalbewerking",
    description: "Draaideel S355 MD13200808 A",
    dueDate: new Date(2024, 11, 13), // 13-12-2024
    startDate: new Date(2024, 11, 12), // 12-12-2024
    hours: 2.8333,
    seriesSize: 20,
    nextOperation: undefined,
    status: "late",
    quantity: 20,
    color: "#8b5cf6",
    position: undefined,
  },
]
