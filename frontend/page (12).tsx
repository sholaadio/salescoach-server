"use client"

import * as React from "react"
import { History, Phone, CheckSquare, ThumbsUp } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const periods = ["Today", "This Week", "This Month", "This Year", "All Time"]

const calls = [
  {
    id: 1,
    product: "Teeth Cleaner",
    date: "9 Mar 2026",
    type: "phone",
    summary: "This was a rushed order confirmation that missed every opportunity to build rapport, qualify the customer, or create value.",
    score: 25,
    status: "confirmed",
  },
]

function getScoreColor(score: number) {
  if (score >= 80) return "bg-[#10b981] text-white"
  if (score >= 50) return "bg-[#f5a623] text-black"
  return "bg-[#e5484d] text-white"
}

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("This Month")

  return (
    <AppShell
      title="My Call History"
      description="Review your past calls and AI coaching feedback"
      icon={<History className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Period selector */}
        <div className="flex gap-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                selectedPeriod === period
                  ? "bg-[#5e6ad2] text-white"
                  : "text-[#8b8b8e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
              )}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Call list */}
        <div className="space-y-3">
          {calls.map((call) => (
            <div
              key={call.id}
              className="group rounded-lg border border-[#26262a] border-l-2 border-l-[#e5484d] bg-[#161618] p-4 transition-colors hover:bg-[#1a1a1c]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-[#f5f5f5]">{call.product}</h3>
                    <span className="text-[#8b8b8e]">·</span>
                    <Phone className="h-3.5 w-3.5 text-[#e5484d]" />
                  </div>
                  <p className="mt-0.5 text-xs text-[#5b5b5e]">{call.date}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#8b8b8e]">
                    {call.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={cn("text-xs", getScoreColor(call.score))}>
                    {call.score}/100
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-[#10b981]/40 bg-[#10b981]/10 text-xs text-[#10b981]">
                    <CheckSquare className="h-3 w-3" />
                    Confirmed
                  </Badge>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#8b8b8e] transition-colors hover:bg-[#26262a] hover:text-[#5e6ad2]">
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {calls.length === 0 && (
            <div className="rounded-lg border border-[#26262a] bg-[#161618] p-12 text-center">
              <History className="mx-auto h-10 w-10 text-[#5b5b5e]" />
              <h3 className="mt-4 text-sm font-medium text-[#f5f5f5]">No calls found</h3>
              <p className="mt-1 text-xs text-[#5b5b5e]">
                Upload a call to get started with AI coaching
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
