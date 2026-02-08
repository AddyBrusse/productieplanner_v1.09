"use client"

import { useState } from "react"
import { useMachines } from "@/context/MachinesContext"
import { useProductionData } from "@/context/ProductionDataContext"
import { ProductionNodeComponent } from "@/components/ProductionNode"
import {
  getTimelineDays,
  getDayTimeSlots,
  formatDayHeader,
  getUniqueMachines,
  getMachineIndex,
  getYPositionForMachine,
  getXPositionForDateTime,
  getWidthForDuration,
  calculateNodeStartTime,
  PIXELS_PER_SLOT,
  MACHINE_ROW_HEIGHT,
  HEADER_HEIGHT,
  SLOT_HEIGHT,
} from "@/utils/timelineUtils"

interface TimelineProps {
  numberOfDays?: number
  startDate?: Date
}

export function TimelineLayout({ numberOfDays = 30, startDate = new Date() }: TimelineProps) {
  const { nodes, updateNodePosition } = useProductionData()
  const { machines: configuredMachines } = useMachines()
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null)

  // Get timeline parameters
  const timelineDays = getTimelineDays(startDate, numberOfDays)
  const timeSlots = getDayTimeSlots()
  const uniqueMachines = getUniqueMachines(nodes)

  // Calculate dimensions - EXACT
  const slotsPerDay = timeSlots.length // 8
  const dayWidth = slotsPerDay * PIXELS_PER_SLOT // 800px
  const totalWidth = numberOfDays * dayWidth // Perfect alignment
  const totalHeight = HEADER_HEIGHT + uniqueMachines.length * MACHINE_ROW_HEIGHT + 100

  // Calculate node positions
  const nodePositions = nodes.map((node) => {
    const startTime = calculateNodeStartTime(node.dueDate, node.hours)
    const xPos = getXPositionForDateTime(startTime, timelineDays[0], startTime.getHours()) + 128 // 128px for row header
    const machineIndex = getMachineIndex(node.machineId, uniqueMachines)
    const yPos = getYPositionForMachine(machineIndex) + HEADER_HEIGHT + SLOT_HEIGHT
    const width = getWidthForDuration(node.hours)

    return {
      nodeId: node.id,
      calculationId: node.calculationId,
      x: xPos,
      y: yPos,
      width: Math.max(width, 80), // Minimum 80px width
      machineIndex,
    }
  })

  const handleNodeDragEnd = (nodeId: string, position: { x: number; y: number }) => {
    updateNodePosition(nodeId, {
      x: position.x,
      y: position.y,
    })
  }

  // Draw bezier curves between connected nodes (same calculation)
  const renderConnections = () => {
    const connections: React.ReactNode[] = []
    const calculationGroups = new Map<string, typeof nodePositions>()

    // Group nodes by calculation ID
    nodePositions.forEach((pos) => {
      const group = calculationGroups.get(pos.calculationId) || []
      group.push(pos)
      calculationGroups.set(pos.calculationId, group)
    })

    // Draw curves between sequential nodes in same calculation
    calculationGroups.forEach((group) => {
      group.sort((a, b) => a.x - b.x) // Sort by x position

      for (let i = 0; i < group.length - 1; i++) {
        const from = group[i]
        const to = group[i + 1]

        const x1 = from.x + from.width
        const y1 = from.y + MACHINE_ROW_HEIGHT / 2
        const x2 = to.x
        const y2 = to.y + MACHINE_ROW_HEIGHT / 2

        // Bezier curve control points
        const cp1x = x1 + (x2 - x1) * 0.3
        const cp1y = y1
        const cp2x = x2 - (x2 - x1) * 0.3
        const cp2y = y2

        const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`

        connections.push(
          <path
            key={`connection-${from.nodeId}-${to.nodeId}`}
            d={pathData}
            stroke="#94a3b8"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
            opacity="0.5"
          />
        )
      }
    })

    return connections
  }

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Production Timeline
        </h1>
        <p className="text-sm text-foreground/60">
          {uniqueMachines.length} machines · {nodes.length} production steps
        </p>
      </div>

      {/* Timeline Container */}
      <div className="rounded-lg border bg-card overflow-auto">
        <div
          className="relative bg-white"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
            minWidth: "100%",
          }}
        >
          {/* Day Headers - EXACT ALIGNMENT */}
          <div className="flex bg-muted border-b sticky top-0 z-40">
            <div
              className="shrink-0 border-r w-32 flex items-center justify-center font-medium text-sm text-foreground/70 sticky left-0 z+100 bg-muted"
              style={{ height: HEADER_HEIGHT, width: 128 }}
              >
              Machines
            </div>
            {timelineDays.map((day, dayIndex) => (
              <div
                key={`day-${dayIndex}`}
                className="border-r flex items-center justify-center font-medium text-sm text-foreground/70 flex-shrink-0 bg-muted"
                style={{
                  width: dayWidth,
                  height: HEADER_HEIGHT,
                  minWidth: dayWidth,
                  maxWidth: dayWidth,
                }}
              >
                {formatDayHeader(day)}
              </div>
            ))}
          </div>

          {/* Time Slots Header - EXACT ALIGNMENT */}
          <div className="flex bg-muted/20 border-b sticky z-30" style={{ top: HEADER_HEIGHT }}>
            <div
              className="shrink-0 border-r w-32 sticky left-0 z100 bg-muted flex items-center justify-center font-medium text-sm text-foreground/70"
              style={{
                height: SLOT_HEIGHT,
                width: 128,
                minWidth: 128,
                maxWidth: 128,
              }}
            >
              Tijd
            </div>
            {timelineDays.map((day, dayIndex) => (
              <div
                key={`slots-${dayIndex}`}
                className="flex flex-shrink-0 bg-muted/20"
                style={{
                  width: dayWidth,
                  height: SLOT_HEIGHT,
                  minWidth: dayWidth,
                  maxWidth: dayWidth,
                }}
              >
                {timeSlots.map((slot, slotIndex) => (
                  <div
                    key={`slot-${dayIndex}-${slotIndex}`}
                    className="border-r text-xs text-foreground/40 flex items-center justify-center flex-shrink-0 bg-muted/20"
                    style={{
                      width: PIXELS_PER_SLOT,
                      height: SLOT_HEIGHT,
                      minWidth: PIXELS_PER_SLOT,
                      maxWidth: PIXELS_PER_SLOT,
                    }}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Machine Rows with Grid - EXACT ALIGNMENT */}
          <div className="flex">
            {/* Machine Labels */}
            <div className="flex-shrink-0 flex flex-col sticky left-0 z-10 bg-card" style={{ width: 128, minWidth: 128, top: HEADER_HEIGHT + SLOT_HEIGHT }}>
              {uniqueMachines.map((machineId) => {
                const machine = configuredMachines.find((m) => m.id === machineId)
                return (
                  <div
                    key={`machine-${machineId}`}
                    className="border-b border-r flex items-center px-3 font-medium text-sm text-foreground/70 bg-muted/10 flex-shrink-0"
                    style={{
                      height: MACHINE_ROW_HEIGHT,
                      minHeight: MACHINE_ROW_HEIGHT,
                      maxHeight: MACHINE_ROW_HEIGHT,
                      width: 128,
                      minWidth: 128,
                      maxWidth: 128,
                    }}
                  >
                    <div>
                      <div className="font-mono text-foreground/80">{machineId}</div>
                      <div className="text-xs text-foreground/50">
                        {machine?.name || "Unknown"}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Timeline Grid - EXACT ALIGNMENT */}
            <div className="flex flex-shrink-0">
              {timelineDays.map((day, dayIndex) => (
                <div
                  key={`day-grid-${dayIndex}`}
                  className="flex flex-shrink-0 border-r"
                  style={{
                    width: dayWidth,
                    minWidth: dayWidth,
                    maxWidth: dayWidth,
                  }}
                >
                  {timeSlots.map((slot, slotIndex) => (
                    <div
                      key={`grid-${dayIndex}-${slotIndex}`}
                      className="flex flex-col flex-shrink-0 border-r"
                      style={{
                        width: PIXELS_PER_SLOT,
                        minWidth: PIXELS_PER_SLOT,
                        maxWidth: PIXELS_PER_SLOT,
                      }}
                    >
                      {uniqueMachines.map((machineId) => (
                        <div
                          key={`cell-${dayIndex}-${slotIndex}-${machineId}`}
                          className="border-b bg-gradient-to-b from-transparent to-muted/5 hover:bg-muted/20 transition-colors flex-shrink-0"
                          style={{
                            width: PIXELS_PER_SLOT,
                            height: MACHINE_ROW_HEIGHT,
                            minWidth: PIXELS_PER_SLOT,
                            maxWidth: PIXELS_PER_SLOT,
                            minHeight: MACHINE_ROW_HEIGHT,
                            maxHeight: MACHINE_ROW_HEIGHT,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* SVG Connections Layer */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={totalWidth}
            height={totalHeight}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Production Nodes */}
          <div className="absolute top-0 left-0">
            {nodes.map((node, idx) => {
              const position = nodePositions[idx]
              if (!position) return null

              return (
                <ProductionNodeComponent
                  key={node.id}
                  node={node}
                  machineIndex={position.machineIndex}
                  xPosition={position.x}
                  yPosition={position.y}
                  width={position.width}
                  isDragging={draggedNodeId === node.id}
                  onDragStart={() => setDraggedNodeId(node.id)}
                  onDragEnd={(pos) => {
                    handleNodeDragEnd(node.id, pos)
                    setDraggedNodeId(null)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <div className="text-xs text-foreground/50">
        <p>Timeline dimensions: {totalWidth}px × {totalHeight}px</p>
        <p>Day width: {dayWidth}px | Slot width: {PIXELS_PER_SLOT}px | Slots per day: {slotsPerDay}</p>
        <p>Nodes positioned: {nodes.length} | Connections: {nodePositions.filter((p) => nodes.some((n) => n.calculationId === p.calculationId && nodes.filter((nn) => nn.calculationId === p.calculationId).length > 1)).length}</p>
      </div>
    </div>
  )
}
