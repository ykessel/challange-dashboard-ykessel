import { useState, useEffect } from "react"
import type { DateRange } from "@/types/air-quality"

// Temporary type for partial date range selection
interface TempDateRange {
  from?: Date
  to?: Date
}

interface UseDateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
}

export function useDateRangePicker({ dateRange, onDateRangeChange }: UseDateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<TempDateRange>(dateRange)
  const [isSelecting, setIsSelecting] = useState(false)

  // Debug function to handle calendar open/close
  const handleCalendarOpenChange = (open: boolean) => {
    console.log('Calendar open change:', open)
    setIsCalendarOpen(open)
  }

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    console.log('handleDateSelect called with:', range)
    console.log('Current tempDateRange:', tempDateRange)
    console.log('isSelecting:', isSelecting)
    
    // If no range is provided, clear the selection
    if (!range) {
      setTempDateRange({ from: undefined, to: undefined })
      setIsSelecting(false)
      return
    }

    // If we have both from and to dates, this is a complete range
    if (range.from && range.to) {
      setTempDateRange({ from: range.from, to: range.to })
      setIsSelecting(false)
      return
    }

    // If we only have a from date
    if (range.from && !range.to) {
      // Check if clicking on an existing date in the range
      const isClickingExistingDate = tempDateRange?.from && tempDateRange?.to && 
        (range.from.getTime() === tempDateRange.from.getTime() || 
         range.from.getTime() === tempDateRange.to.getTime())
      
      if (isClickingExistingDate) {
        // If clicking on existing range date, start a new selection
        setTempDateRange({ from: range.from, to: undefined })
        setIsSelecting(true)
      } else if (tempDateRange?.from && tempDateRange?.to) {
        // If we have a complete range and clicking on a new date, start new selection
        setTempDateRange({ from: range.from, to: undefined })
        setIsSelecting(true)
      } else {
        // Normal range selection - just update the from date
        setTempDateRange({ from: range.from, to: tempDateRange?.to })
        setIsSelecting(true)
      }
      return
    }

    // Fallback: clear selection
    setTempDateRange({ from: undefined, to: undefined })
    setIsSelecting(false)
  }

  const handleResetRange = () => {
    setTempDateRange({ from: undefined, to: undefined })
    setIsSelecting(false)
  }

  const handleApplyRange = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      onDateRangeChange({ from: tempDateRange.from, to: tempDateRange.to })
      setIsCalendarOpen(false)
      setIsSelecting(false)
    }
  }

  const handleCancel = () => {
    setTempDateRange(dateRange)
    setIsCalendarOpen(false)
    setIsSelecting(false)
  }

  // Update temp range when dateRange prop changes
  useEffect(() => {
    setTempDateRange(dateRange)
    setIsSelecting(false)
  }, [dateRange])

  return {
    isCalendarOpen,
    setIsCalendarOpen: handleCalendarOpenChange,
    tempDateRange,
    isSelecting,
    handleDateSelect,
    handleResetRange,
    handleApplyRange,
    handleCancel,
  }
}
