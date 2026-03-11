"use client"

import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const stats = [
  { label: "PRESENT", value: "0", color: "border-l-[#10b981]", textColor: "text-[#10b981]" },
  { label: "ABSENT", value: "9", color: "border-l-[#e5484d]", textColor: "text-[#e5484d]" },
  { label: "WORKDAYS", value: "9", color: "border-l-[#5e6ad2]", textColor: "text-[#f5f5f5]" },
  { label: "ATTENDANCE RATE", value: "0%", color: "border-l-[#f5a623]", textColor: "text-[#e5484d]" },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Generate calendar data for March 2026
const calendarDays = [
  // Week 1
  { day: null, status: null }, // Empty slots before the 1st
  { day: null, status: null },
  { day: null, status: null },
  { day: null, status: null },
  { day: null, status: null },
  { day: null, status: null },
  { day: 1, status: null },
  // Week 2
  { day: 2, status: "absent" },
  { day: 3, status: "absent" },
  { day: 4, status: "absent" },
  { day: 5, status: "absent" },
  { day: 6, status: "absent" },
  { day: 7, status: null },
  { day: 8, status: null },
  // Week 3
  { day: 9, status: "absent" },
  { day: 10, status: "absent" },
  { day: 11, status: "absent" },
  { day: 12, status: "absent" },
  { day: 13, status: null },
  { day: 14, status: null },
  { day: 15, status: null },
  // Week 4+
  { day: 16, status: null },
  { day: 17, status: null },
  { day: 18, status: null },
  { day: 19, status: null },
  { day: 20, status: null },
  { day: 21, status: null },
  { day: 22, status: null },
  { day: 23, status: null },
  { day: 24, status: null },
  { day: 25, status: null },
  { day: 26, status: null },
  { day: 27, status: null },
  { day: 28, status: null },
  { day: 29, status: null },
  { day: 30, status: null },
  { day: 31, status: null },
]

export default function AttendancePage() {
  return (
    <AppShell
      title="My Attendance"
      description="Your log submission history — every approved log = present day"
      icon={<CalendarDays className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-lg border border-[#26262a] bg-[#161618] p-4 border-l-2",
                stat.color
              )}
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                {stat.label}
              </p>
              <p className={cn("mt-2 text-2xl font-semibold", stat.textColor)}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          {/* Calendar header */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b8b8e] hover:bg-[#26262a] hover:text-[#f5f5f5]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold text-[#f5f5f5]">Mar 2026</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b8b8e] hover:bg-[#26262a] hover:text-[#f5f5f5]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {days.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-lg border p-2 transition-colors",
                  item.day === null
                    ? "border-transparent"
                    : item.status === "absent"
                    ? "border-[#e5484d]/40 bg-[#e5484d]/10"
                    : item.status === "present"
                    ? "border-[#10b981]/40 bg-[#10b981]/10"
                    : "border-[#26262a] bg-[#1a1a1c]"
                )}
              >
                {item.day && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      item.status === "absent"
                        ? "text-[#e5484d]"
                        : item.status === "present"
                        ? "text-[#10b981]"
                        : "text-[#8b8b8e]"
                    )}
                  >
                    {item.day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
