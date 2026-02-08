"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import type { ZoomLevel } from "@/utils/viewModifiers"
import {
  getNextPeriod,
  getPreviousPeriod,
  formatDateRange,
  getViewStartDate,
  getViewEndDate,
  getTodayNormalized,
  ZOOM_CONFIGS,
  getWeekNumber,
} from "@/utils/viewModifiers"

interface TimelineControlsProps {
  currentStartDate: Date
  zoomLevel: ZoomLevel
  onDateChange: (date: Date) => void
  onZoomChange: (zoom: ZoomLevel) => void
}

export function TimelineControls({
  currentStartDate,
  zoomLevel,
  onDateChange,
  onZoomChange,
}: TimelineControlsProps) {
  const endDate = new Date(currentStartDate)
  endDate.setDate(endDate.getDate() + ZOOM_CONFIGS[zoomLevel].days - 1)

  const handlePrevious = () => {
    const prevDate = getPreviousPeriod(currentStartDate, zoomLevel)
    onDateChange(prevDate)
  }

  const handleNext = () => {
    const nextDate = getNextPeriod(currentStartDate, zoomLevel)
    onDateChange(nextDate)
  }

  const handleToday = () => {
    const today = getTodayNormalized()
    const viewStart = getViewStartDate(today, zoomLevel)
    onDateChange(viewStart)
  }

  const dateRangeLabel = formatDateRange(currentStartDate, endDate, zoomLevel)

  const getPaginationLabel = () => {
    switch (zoomLevel) {
      case 'week':
        return `Week ${getWeekNumber(currentStartDate)}`
      case 'day':
        return `${currentStartDate.getDate()}`
      case 'month':
        return currentStartDate.toLocaleString('nl-NL', { month: 'long' })
    }
  }

  return (
    <div className="flex flex-col gap-3 px-6 py-4 border-b bg-card">
      {/* Top row: Zoom selector centered */}
      <div className="flex items-center justify-center">
        <Select value={zoomLevel} onValueChange={(value) => onZoomChange(value as ZoomLevel)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Dag (1 dag)</SelectItem>
            <SelectItem value="week">Week (7 dagen)</SelectItem>
            <SelectItem value="month">Maand (30 dagen)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Middle row: Date range display centered */}
      <div className="flex items-center justify-center">
        <h3 className="text-sm font-medium text-foreground/80">{dateRangeLabel}</h3>
      </div>

      {/* Bottom row: Navigation pagination centered */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm" onClick={handleToday} className="gap-2">
          <Calendar className="h-4 w-4" />
          Vandaag
        </Button>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevious} className="cursor-pointer" />
            </PaginationItem>

            <PaginationItem>
              <span className="px-3 text-sm text-foreground/70">{getPaginationLabel()}</span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext onClick={handleNext} className="cursor-pointer" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
