"use client"

import { MachinesManager } from "@/components/MachinesManager"

export function PlanningSettings() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Planning Settings</h1>
        <p className="text-sm text-foreground/60">
          Configure machines and other planning parameters for your production facility.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <MachinesManager />
        </div>
      </div>
    </div>
  )
}
