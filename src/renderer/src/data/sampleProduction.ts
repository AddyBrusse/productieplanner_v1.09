import { ProductionNode } from "@/types/production"

/**
 * Sample production nodes for testing and development
 * Based on real CNC machining operations
 */
export const sampleNodes: ProductionNode[] = [
  {
    id: "002329-DR001-0",
    productionNumber: "002329",
    calculationId: "002329",
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
    productionNumber: "003003",
    calculationId: "003003",
    machineId: "DR001",
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
  {
    id: "003127-DR001-0",
    productionNumber: "003127",
    calculationId: "003127",
    machineId: "DR001",
    customer: "Stinis Holland B.V.",
    description: "Bout ø55x155/M48x214 + verzinken",
    dueDate: new Date(2025, 0, 31), // 31-01-2025
    startDate: new Date(2025, 0, 22), // 22-01-2025
    hours: 7.8667,
    seriesSize: 32,
    nextOperation: "FR004",
    status: "late",
    quantity: 32,
    color: "#ec4899",
    position: undefined,
  },
  {
    id: "003127-FR004-0",
    productionNumber: "003127",
    calculationId: "003127",
    machineId: "FR004",
    customer: "Stinis Holland B.V.",
    description: "Bout ø55x155/M48x214 + verzinken (Frees)",
    dueDate: new Date(2025, 0, 31), // 31-01-2025
    startDate: new Date(2025, 0, 25), // 25-01-2025 (after DR001)
    hours: 4.5,
    seriesSize: 32,
    nextOperation: undefined,
    status: "late",
    quantity: 32,
    color: "#ec4899",
    position: undefined,
  },
  {
    id: "003099-DR001-0",
    productionNumber: "003099",
    calculationId: "003099",
    machineId: "DR001",
    customer: "Post Metaalbewerking",
    description: "Draaideel S355 MD13201305 C",
    dueDate: new Date(2025, 1, 12), // 12-02-2025
    startDate: new Date(2025, 1, 11), // 11-02-2025
    hours: 4.5,
    seriesSize: 10,
    nextOperation: undefined,
    status: "late",
    quantity: 10,
    color: "#f59e0b",
    position: undefined,
  },
  {
    id: "003480-DR001-0",
    productionNumber: "003480",
    calculationId: "003480",
    machineId: "DR001",
    customer: "Post Metaalbewerking",
    description: "Draaideel S355 MD13201305 C (groot)",
    dueDate: new Date(2025, 4, 15), // 15-05-2025
    startDate: new Date(2025, 4, 14), // 14-05-2025
    hours: 12,
    seriesSize: 40,
    nextOperation: undefined,
    status: "ontime",
    quantity: 40,
    color: "#06b6d4",
    position: undefined,
  },
  {
    id: "003481-DR001-0",
    productionNumber: "003481",
    calculationId: "003481",
    machineId: "DR001",
    customer: "Post Metaalbewerking",
    description: "Draaideel S355 MD13201308 A",
    dueDate: new Date(2025, 4, 15), // 15-05-2025
    startDate: new Date(2025, 4, 14), // 14-05-2025
    hours: 2.0833,
    seriesSize: 20,
    nextOperation: undefined,
    status: "ontime",
    quantity: 20,
    color: "#14b8a6",
    position: undefined,
  },
  {
    id: "003450-DR001-0",
    productionNumber: "003450",
    calculationId: "003450",
    machineId: "DR001",
    customer: "Stinis Holland B.V.",
    description: "Speciale as ø12x100",
    dueDate: new Date(2026, 1, 10), // 10-02-2026
    startDate: new Date(2026, 1, 3), // 03-02-2026
    hours: 3.5,
    seriesSize: 5,
    nextOperation: "FR001",
    status: "ontime",
    quantity: 5,
    color: "#84cc16",
    position: undefined,
  },
  {
    id: "003450-FR001-0",
    productionNumber: "003450",
    calculationId: "003450",
    machineId: "FR001",
    customer: "Stinis Holland B.V.",
    description: "Speciale as ø12x100 (Frees)",
    dueDate: new Date(2026, 1, 10), // 10-02-2026
    startDate: new Date(2026, 1, 7), // 07-02-2026
    hours: 2.25,
    seriesSize: 5,
    nextOperation: undefined,
    status: "ontime",
    quantity: 5,
    color: "#84cc16",
    position: undefined,
  },
  {
    id: "003451-DR001-0",
    productionNumber: "003451",
    calculationId: "003451",
    machineId: "DR001",
    customer: "Post Metaalbewerking",
    description: "Tandwiel module 2 ø50",
    dueDate: new Date(2026, 2, 5), // 05-03-2026
    startDate: new Date(2026, 1, 20), // 20-02-2026
    hours: 5.75,
    seriesSize: 15,
    nextOperation: undefined,
    status: "ontime",
    quantity: 15,
    color: "#6366f1",
    position: undefined,
  },
  {
    id: "003452-FR001-0",
    productionNumber: "003452",
    calculationId: "003452",
    machineId: "FR001",
    customer: "Stinis Holland B.V.",
    description: "Montageblok aluminium",
    dueDate: new Date(2026, 2, 15), // 15-03-2026
    startDate: new Date(2026, 2, 2), // 02-03-2026
    hours: 4.33,
    seriesSize: 8,
    nextOperation: undefined,
    status: "ontime",
    quantity: 8,
    color: "#f97316",
    position: undefined,
  },
  {
    id: "003453-DR001-0",
    productionNumber: "003453",
    calculationId: "003453",
    machineId: "DR001",
    customer: "Post Metaalbewerking",
    description: "Naaf ø25x80",
    dueDate: new Date(2026, 2, 20), // 20-03-2026
    startDate: new Date(2026, 2, 10), // 10-03-2026
    hours: 2.67,
    seriesSize: 12,
    nextOperation: undefined,
    status: "ontime",
    quantity: 12,
    color: "#6b7280",
    position: undefined,
  },
]
