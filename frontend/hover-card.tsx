"use client"

import { cn } from "@/lib/utils"

const periods = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "all", label: "All Time" },
]

interface PeriodFilterProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PeriodFilter({ value, onChange, className }: PeriodFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            value === period.value
              ? "bg-[#5e6ad2]/15 text-[#5e6ad2] ring-1 ring-[#5e6ad2]/30"
              : "text-[#8b8b8e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
