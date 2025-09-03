// import * as React from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type Props = {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  maxDate?: Date
}

export function DateRangePicker({ value, onChange, maxDate = new Date() }: Props) {
  const label =
    value?.from
      ? value.to
        ? `${format(value.from, "MM/dd/yyyy")} – ${format(value.to, "MM/dd/yyyy")}`
        : `${format(value.from, "MM/dd/yyyy")} –`
      : "mm/dd/yyyy – mm/dd/yyyy"

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[260px] justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            onSelect={onChange}
            disabled={(date) => date > maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(value?.from || value?.to) && (
        <Button variant="ghost" size="icon" onClick={() => onChange(undefined)} title="Clear range">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
