"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Machine {
  id: string // machineId: DR001, FR001, etc.
  name: string // Display name: "Draaidraaibank", "Freesmachine", etc.
  operatingHours: number // 8, 16, or 24 hour shifts
}

interface MachinesContextType {
  machines: Machine[]
  addMachine: (machine: Machine) => Promise<void>
  deleteMachine: (id: string) => Promise<void>
  updateMachine: (machine: Machine) => Promise<void>
  loadMachines: () => Promise<void>
  isLoading: boolean
}

const MachinesContext = createContext<MachinesContextType | undefined>(undefined)

export function MachinesProvider({ children }: { children: React.ReactNode }) {
  const [machines, setMachines] = useState<Machine[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load machines from main process on mount
  useEffect(() => {
    loadMachinesData()
  }, [])

  const loadMachinesData = async () => {
    try {
      setIsLoading(true)
      const data = await window.electron.ipcRenderer.invoke(
        "machines:load"
      )
      setMachines(data || [])
    } catch (error) {
      console.error("Failed to load machines:", error)
      setMachines([])
    } finally {
      setIsLoading(false)
    }
  }

  const addMachine = async (machine: Machine) => {
    try {
      const updatedMachines = [...machines, machine]
      await window.electron.ipcRenderer.invoke("machines:save", updatedMachines)
      setMachines(updatedMachines)
    } catch (error) {
      console.error("Failed to add machine:", error)
      throw error
    }
  }

  const deleteMachine = async (id: string) => {
    try {
      const updatedMachines = machines.filter((m) => m.id !== id)
      await window.electron.ipcRenderer.invoke("machines:save", updatedMachines)
      setMachines(updatedMachines)
    } catch (error) {
      console.error("Failed to delete machine:", error)
      throw error
    }
  }

  const updateMachine = async (machine: Machine) => {
    try {
      const updatedMachines = machines.map((m) =>
        m.id === machine.id ? machine : m
      )
      await window.electron.ipcRenderer.invoke("machines:save", updatedMachines)
      setMachines(updatedMachines)
    } catch (error) {
      console.error("Failed to update machine:", error)
      throw error
    }
  }

  const loadMachines = loadMachinesData

  return (
    <MachinesContext.Provider
      value={{
        machines,
        addMachine,
        deleteMachine,
        updateMachine,
        loadMachines,
        isLoading,
      }}
    >
      {children}
    </MachinesContext.Provider>
  )
}

export function useMachines() {
  const context = useContext(MachinesContext)
  if (context === undefined) {
    throw new Error("useMachines must be used within a MachinesProvider")
  }
  return context
}
