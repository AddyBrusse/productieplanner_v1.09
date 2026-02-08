"use client"

import React, { createContext, useContext, useState } from "react"
import { ProductionNode } from "@/types/production"
import { sampleNodes } from "@/data/sampleProduction"

interface ProductionDataContextType {
  nodes: ProductionNode[]
  addNodes: (newNodes: ProductionNode[]) => void
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void
  getNodesByCalculation: (calculationId: string) => ProductionNode[]
  clearNodes: () => void
  importCSVNodes: (nodes: ProductionNode[]) => void
}

const ProductionDataContext = createContext<ProductionDataContextType | undefined>(
  undefined
)

export function ProductionDataProvider({ children }: { children: React.ReactNode }) {
  // Initialize with sample data for now (will be replaced with real imports)
  const [nodes, setNodes] = useState<ProductionNode[]>(sampleNodes)

  const addNodes = (newNodes: ProductionNode[]) => {
    setNodes((prevNodes) => {
      const existingIds = new Set(prevNodes.map((n) => n.id))
      const nodesToAdd = newNodes.filter((n) => !existingIds.has(n.id))
      return [...prevNodes, ...nodesToAdd]
    })
  }

  const updateNodePosition = (nodeId: string, position: { x: number; y: number }) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      )
    )
  }

  const getNodesByCalculation = (calculationId: string): ProductionNode[] => {
    return nodes.filter((n) => n.calculationId === calculationId)
  }

  const clearNodes = () => {
    setNodes([])
  }

  const importCSVNodes = (newNodes: ProductionNode[]) => {
    // Replace all nodes when importing
    setNodes(newNodes)
  }

  return (
    <ProductionDataContext.Provider
      value={{
        nodes,
        addNodes,
        updateNodePosition,
        getNodesByCalculation,
        clearNodes,
        importCSVNodes,
      }}
    >
      {children}
    </ProductionDataContext.Provider>
  )
}

export function useProductionData() {
  const context = useContext(ProductionDataContext)
  if (context === undefined) {
    throw new Error(
      "useProductionData must be used within a ProductionDataProvider"
    )
  }
  return context
}
