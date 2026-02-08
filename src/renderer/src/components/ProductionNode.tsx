"use client"

import { useState, useRef, useEffect } from "react"
import { ProductionNode as ProductionNodeType } from "@/types/production"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductionNodeProps {
  node: ProductionNodeType
  machineIndex: number
  xPosition: number
  yPosition: number
  width: number
  isDragging?: boolean
  onDragStart?: (e: React.MouseEvent) => void
  onDragEnd?: (position: { x: number; y: number }) => void
}

const statusColors: Record<string, string> = {
  late: "bg-red-500",
  due: "bg-orange-500",
  ontime: "bg-green-500",
}

const calculationColors: Record<string, string> = {
  "CALC-001": "bg-blue-100 border-blue-300",
  "CALC-002": "bg-purple-100 border-purple-300",
  "CALC-003": "bg-pink-100 border-pink-300",
  "CALC-004": "bg-cyan-100 border-cyan-300",
  "CALC-005": "bg-emerald-100 border-emerald-300",
}

export function ProductionNodeComponent({
  node,
  machineIndex,
  xPosition,
  yPosition,
  width,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ProductionNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragLocal, setIsDragLocal] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragLocal(true)
    setDragOffset({
      x: e.clientX - xPosition,
      y: e.clientY - yPosition,
    })
    onDragStart?.(e)
  }

  useEffect(() => {
    if (!isDragLocal) return

    const handleMouseMove = (e: MouseEvent) => {
      if (onDragEnd) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        onDragEnd({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragLocal(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragLocal, dragOffset, onDragEnd])

  const colorKey = Object.keys(calculationColors).find((key) =>
    node.calculationId.includes(key)
  ) || "CALC-001"

  return (
    <div
      ref={nodeRef}
      className={cn(
        "absolute rounded-md border-2 p-2 cursor-move transition-all",
        calculationColors[colorKey],
        isHovered && "shadow-lg z-20",
        isDragging && "opacity-75"
      )}
      style={{
        left: `${xPosition}px`,
        top: `${yPosition}px`,
        width: `${width}px`,
        minHeight: "80px",
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold truncate flex-1">
            {node.calculationId}
          </div>
          <Badge
            className={cn(
              "text-xs text-white",
              statusColors[node.status] || "bg-gray-500"
            )}
          >
            {node.status}
          </Badge>
        </div>

        <div className="text-xs text-gray-700">
          <div className="font-medium truncate">{node.description}</div>
          <div className="text-gray-600">{node.customer}</div>
        </div>

        <div className="text-xs text-gray-600">
          {node.hours}h • {node.machineId}
        </div>
      </div>
    </div>
  )
}
