"use client"

import * as React from "react"
import { Sparkles, FileText, Calendar } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const periods = [
  { label: "Today's", value: "today" },
  { label: "This Week's", value: "week" },
  { label: "Last 14 Days", value: "14days" },
  { label: "This Month's", value: "month" },
  { label: "Custom Range", value: "custom" },
]

export default function AISummaryPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("today")
  const [showCustom, setShowCustom] = React.useState(false)

  return (
    <AppShell
      title="AI Summary Report"
      description="AI-powered analysis of your call performance"
      icon={<Sparkles className="h-4 w-4" />}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#f5f5f5]">Select period:</h3>

          {/* Period selector */}
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => {
                  setSelectedPeriod(period.value)
                  setShowCustom(period.value === "custom")
                }}
                className={cn(
                  "rounded-md px-4 py-2 text-sm font-medium transition-all",
                  selectedPeriod === period.value
                    ? "bg-[#5e6ad2] text-white"
                    : "border border-[#26262a] text-[#8b8b8e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
                )}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          {showCustom && (
            <div className="mt-4 flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  Start Date
                </label>
                <Input
                  type="date"
                  className="h-9 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus-visible:ring-[#5e6ad2]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  End Date
                </label>
                <Input
                  type="date"
                  className="h-9 border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] focus-visible:ring-[#5e6ad2]"
                />
              </div>
            </div>
          )}

          {/* Status message */}
          <p className="mt-6 text-sm text-[#5b5b5e]">
            {"0 call reports found for today's period"}
          </p>

          {/* Generate button */}
          <Button
            className="mt-4 w-full bg-gradient-to-r from-[#5e6ad2] to-[#7c3aed] text-white hover:opacity-90"
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Summary Report
          </Button>
        </div>

        {/* Empty state */}
        <div className="rounded-lg border border-dashed border-[#26262a] bg-[#161618]/50 p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-[#5b5b5e]" />
          <h3 className="mt-4 text-sm font-medium text-[#f5f5f5]">No report generated yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs text-[#5b5b5e]">
            Select a time period and click generate to get an AI-powered summary of your call performance, 
            including strengths, areas for improvement, and personalized coaching tips.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
