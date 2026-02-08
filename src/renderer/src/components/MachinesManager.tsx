"use client"

import { useState } from "react"
import { Trash2, Edit2 } from "lucide-react"
import { useMachines, type Machine } from "@/context/MachinesContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MachinesManager() {
  const { machines, addMachine, deleteMachine, updateMachine, isLoading } = useMachines()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [machineToDelete, setMachineToDelete] = useState<string | null>(null)
  const [machineToEdit, setMachineToEdit] = useState<Machine | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    operatingHours: 8,
  })

  const handleAddMachine = async () => {
    if (!formData.id.trim() || !formData.name.trim()) {
      alert("Please fill in all fields")
      return
    }

    // Check if machine ID already exists
    if (machines.some((m) => m.id === formData.id)) {
      alert("Machine ID already exists")
      return
    }

    try {
      setIsSubmitting(true)
      await addMachine({
        id: formData.id.toUpperCase(),
        name: formData.name,
        operatingHours: formData.operatingHours,
      })
      setFormData({ id: "", name: "", operatingHours: 8 })
      setIsAddOpen(false)
    } catch (error) {
      alert("Failed to add machine")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditOpen = (machine: Machine) => {
    setMachineToEdit(machine)
    setFormData({
      id: machine.id,
      name: machine.name,
      operatingHours: machine.operatingHours,
    })
    setIsEditOpen(true)
  }

  const handleUpdateMachine = async () => {
    if (!formData.name.trim()) {
      alert("Please fill in all fields")
      return
    }

    try {
      setIsSubmitting(true)
      await updateMachine({
        id: formData.id,
        name: formData.name,
        operatingHours: formData.operatingHours,
      })
      setFormData({ id: "", name: "", operatingHours: 8 })
      setMachineToEdit(null)
      setIsEditOpen(false)
    } catch (error) {
      alert("Failed to update machine")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMachine = async () => {
    if (!machineToDelete) return
    try {
      await deleteMachine(machineToDelete)
      setMachineToDelete(null)
    } catch (error) {
      alert("Failed to delete machine")
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium tracking-tight text-foreground">
            Machines
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure and manage your machining equipment
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <span>+ Add Machine</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Machine</DialogTitle>
              <DialogDescription className="text-sm">
                Configure a new machining machine for production planning.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="machine-id" className="text-sm font-medium">
                  Machine ID
                </Label>
                <Input
                  id="machine-id"
                  placeholder="e.g., DR001, FR001"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="machine-name" className="text-sm font-medium">
                  Machine Name
                </Label>
                <Input
                  id="machine-name"
                  placeholder="e.g., Draaibank, Freesmachine"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operating-hours" className="text-sm font-medium">
                  Operating Hours
                </Label>
                <Select
                  value={formData.operatingHours.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      operatingHours: parseInt(value),
                    })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="operating-hours" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8 hours (1 shift)</SelectItem>
                    <SelectItem value="16">16 hours (2 shifts)</SelectItem>
                    <SelectItem value="24">24 hours (3 shifts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddMachine}
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? "Adding..." : "Add Machine"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-dashed p-12 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading machines...</p>
        </div>
      ) : machines.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-muted-foreground">
            No machines configured yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Add one to get started with production planning.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-medium text-foreground/70 h-12 px-6">
                  Machine ID
                </TableHead>
                <TableHead className="font-medium text-foreground/70 h-12 px-6">
                  Name
                </TableHead>
                <TableHead className="font-medium text-foreground/70 h-12 px-6">
                  Operating Hours
                </TableHead>
                <TableHead className="text-right font-medium text-foreground/70 h-12 px-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machines.map((machine) => (
                <TableRow 
                  key={machine.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono font-medium text-sm px-6 py-4 text-foreground/80">
                    {machine.id}
                  </TableCell>
                  <TableCell className="text-sm px-6 py-4 text-foreground/70">
                    {machine.name}
                  </TableCell>
                  <TableCell className="text-sm text-foreground/60 px-6 py-4">
                    {machine.operatingHours}h
                  </TableCell>
                  <TableCell className="text-right px-6 py-4 space-x-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditOpen(machine)}
                      className="hover:bg-blue-50 hover:text-blue-600 text-foreground/60"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog
                      open={machineToDelete === machine.id}
                      onOpenChange={(open) => {
                        if (!open) setMachineToDelete(null)
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMachineToDelete(machine.id)}
                        className="hover:bg-red-50 hover:text-red-600 text-foreground/60"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Machine?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium">{machine.name}</span>?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex gap-2 justify-end">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteMachine}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Machine</DialogTitle>
            <DialogDescription className="text-sm">
              Update the machine details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-machine-id" className="text-sm font-medium">
                Machine ID
              </Label>
              <Input
                id="edit-machine-id"
                value={formData.id}
                disabled
                className="text-sm bg-muted text-foreground/50"
              />
              <p className="text-xs text-muted-foreground">
                Machine ID cannot be changed
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-machine-name" className="text-sm font-medium">
                Machine Name
              </Label>
              <Input
                id="edit-machine-name"
                placeholder="e.g., Draaibank, Freesmachine"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isSubmitting}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-operating-hours" className="text-sm font-medium">
                Operating Hours
              </Label>
              <Select
                value={formData.operatingHours.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    operatingHours: parseInt(value),
                  })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-operating-hours" className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 hours (1 shift)</SelectItem>
                  <SelectItem value="16">16 hours (2 shifts)</SelectItem>
                  <SelectItem value="24">24 hours (3 shifts)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleUpdateMachine}
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? "Updating..." : "Update Machine"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
