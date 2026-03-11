"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const teamMembers = [
  { id: 1, name: "Chukwuemeka Obi", present: 18, absent: 2 },
  { id: 2, name: "Adaora Nwosu", present: 15, absent: 5 },
  { id: 3, name: "David Okonkwo", present: 10, absent: 10 },
]

// Generate calendar data
const generateCalendarDays = () => {
  const days = []
  for (let i = 1; i <= 31; i++) {
    days.push({
      date: i,
      isWeekend: i % 7 === 0 || i % 7 === 6,
      attendance: {
        1: i <= 11 ? (i % 5 !== 0 ? "present" : "absent") : null,
        2: i <= 11 ? (i % 4 !== 0 ? "present" : "absent") : null,
        3: i <= 11 ? (i % 2 !== 0 ? "present" : "absent") : null,
      } as Record<number, string | null>
    })
  }
  return days
}

const calendarDays = generateCalendarDays()

export default function TeamAttendancePage() {
  const [period, setPeriod] = useState("this-month")
  const [currentMonth] = useState("March 2026")

  const getRateBadge = (present: number, absent: number) => {
    const rate = Math.round((present / (present + absent)) * 100)
    if (rate >= 80) return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">{rate}%</Badge>
    if (rate >= 50) return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">{rate}%</Badge>
    return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">{rate}%</Badge>
  }

  return (
    <AppShell userRole="teamlead">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Team Attendance</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Track attendance for your team members</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-lg border border-[#26262a] bg-[#161618] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#f5f5f5]">{member.name}</h3>
                {getRateBadge(member.present, member.absent)}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#10b981]" />
                  <span className="text-sm text-[#8b8b8e]">{member.present} present</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-[#e5484d]" />
                  <span className="text-sm text-[#8b8b8e]">{member.absent} absent</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-5">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-lg font-medium text-[#f5f5f5]">{currentMonth}</h3>
            <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-[#8b8b8e] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts (assuming March 2026 starts on Sunday) */}
            {[...Array(6)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {calendarDays.slice(0, 25).map((day) => {
              const hasPresent = Object.values(day.attendance).some(a => a === "present")
              const hasAbsent = Object.values(day.attendance).some(a => a === "absent")
              const isFuture = day.date > 11
              
              return (
                <div
                  key={day.date}
                  className={cn(
                    "aspect-square rounded-lg border flex flex-col items-center justify-center transition-colors",
                    isFuture 
                      ? "border-[#26262a] bg-transparent"
                      : hasAbsent && !hasPresent
                        ? "border-[#e5484d]/30 bg-[#e5484d]/10"
                        : hasPresent
                          ? "border-[#10b981]/30 bg-[#10b981]/10"
                          : "border-[#26262a] bg-[#1f1f22]",
                    day.isWeekend && "opacity-50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isFuture ? "text-[#8b8b8e]" : "text-[#f5f5f5]"
                  )}>
                    {day.date}
                  </span>
                  {!isFuture && (
                    <div className="flex gap-0.5 mt-1">
                      {teamMembers.map((member) => {
                        const status = day.attendance[member.id]
                        if (!status) return null
                        return (
                          <div
                            key={member.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              status === "present" ? "bg-[#10b981]" : "bg-[#e5484d]"
                            )}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#26262a]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="text-xs text-[#8b8b8e]">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#e5484d]" />
              <span className="text-xs text-[#8b8b8e]">Absent</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
