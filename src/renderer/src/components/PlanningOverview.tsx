"use client"

import { useProductionData } from "@/context/ProductionDataContext"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PlanningOverview() {
  const { nodes } = useProductionData()

  // Group nodes by calculation ID
  const groupedByCalculation = nodes.reduce(
    (acc, node) => {
      if (!acc[node.calculationId]) {
        acc[node.calculationId] = []
      }
      acc[node.calculationId].push(node)
      return acc
    },
    {} as Record<string, typeof nodes>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Production Overview
        </h1>
        <p className="text-sm text-foreground/60">
          {nodes.length} production steps across {Object.keys(groupedByCalculation).length} calculations
        </p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Calc ID
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Customer
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Description
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Machine
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Hours
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Status
              </TableHead>
              <TableHead className="font-medium text-foreground/70 h-12 px-6">
                Due Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.map((node) => (
              <TableRow
                key={node.id}
                className="hover:bg-muted/50 transition-colors"
              >
                <TableCell className="font-mono font-medium text-sm px-6 py-4 text-foreground/80">
                  {node.calculationId}
                </TableCell>
                <TableCell className="text-sm px-6 py-4 text-foreground/70">
                  {node.customer}
                </TableCell>
                <TableCell className="text-sm px-6 py-4 text-foreground/70 max-w-xs truncate">
                  {node.description}
                </TableCell>
                <TableCell className="text-sm px-6 py-4 text-foreground/70 font-mono">
                  {node.machineId}
                </TableCell>
                <TableCell className="text-sm px-6 py-4 text-foreground/70">
                  {node.hours.toFixed(2)}h
                </TableCell>
                <TableCell className="text-sm px-6 py-4">
                  <Badge
                    style={{
                      color: "white",
                    }}
                  >
                    {node.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm px-6 py-4 text-foreground/70">
                  {node.dueDate.toLocaleDateString("nl-NL")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-foreground/50">
        <p>Next: Timeline Layout Component</p>
      </div>
    </div>
  )
}
