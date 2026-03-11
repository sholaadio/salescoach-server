"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Phone,
  PhoneOff,
  Clock,
  TrendingUp,
  Play,
  Search,
  Filter
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const callsData = [
  { 
    id: 1, 
    caller: "Chukwuemeka Obi",
    team: "Team Abigail",
    product: "Weight Loss Bundle",
    duration: "4:32",
    aiScore: 85,
    outcome: "confirmed",
    date: "2026-03-11",
    time: "10:30 AM"
  },
  { 
    id: 2, 
    caller: "Adaora Nwosu",
    team: "Team Mary",
    product: "Skin Care Set",
    duration: "3:15",
    aiScore: 72,
    outcome: "confirmed",
    date: "2026-03-11",
    time: "09:45 AM"
  },
  { 
    id: 3, 
    caller: "Emeka Johnson",
    team: "Team Abigail",
    product: "Hair Growth Oil",
    duration: "2:48",
    aiScore: 45,
    outcome: "rejected",
    date: "2026-03-10",
    time: "04:20 PM"
  },
  { 
    id: 4, 
    caller: "Blessing Eze",
    team: "Team Deborah",
    product: "Teeth Cleaner",
    duration: "5:10",
    aiScore: 92,
    outcome: "confirmed",
    date: "2026-03-10",
    time: "02:15 PM"
  },
  { 
    id: 5, 
    caller: "David Okonkwo",
    team: "Team Mary",
    product: "Weight Loss Bundle",
    duration: "1:45",
    aiScore: 25,
    outcome: "no-answer",
    date: "2026-03-10",
    time: "11:00 AM"
  },
]

export default function CallsPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [outcomeFilter, setOutcomeFilter] = useState("all")

  const filteredCalls = callsData.filter(call => {
    const matchesSearch = call.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         call.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOutcome = outcomeFilter === "all" || call.outcome === outcomeFilter
    return matchesSearch && matchesOutcome
  })

  const totalCalls = callsData.length
  const confirmedCalls = callsData.filter(c => c.outcome === "confirmed").length
  const avgScore = Math.round(callsData.reduce((sum, c) => sum + c.aiScore, 0) / totalCalls)
  const avgDuration = "3:30"

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#10b981]"
    if (score >= 50) return "text-[#f5a623]"
    return "text-[#e5484d]"
  }

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case "confirmed":
        return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">Confirmed</Badge>
      case "rejected":
        return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">Rejected</Badge>
      case "no-answer":
        return <Badge variant="outline" className="border-[#8b8b8e]/30 bg-[#8b8b8e]/10 text-[#8b8b8e]">No Answer</Badge>
      default:
        return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">Pending</Badge>
    }
  }

  return (
    <AppShell userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Call Analytics</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Monitor and analyze all sales calls</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Calls"
            value={totalCalls.toString()}
            icon={<Phone className="w-4 h-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            label="Confirmed"
            value={confirmedCalls.toString()}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Avg AI Score"
            value={avgScore.toString()}
            icon={<PhoneOff className="w-4 h-4" />}
          />
          <StatCard
            label="Avg Duration"
            value={avgDuration}
            icon={<Clock className="w-4 h-4" />}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#161618] border-[#26262a] text-[#f5f5f5] placeholder:text-[#8b8b8e]"
            />
          </div>
          <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
            <SelectTrigger className="w-[150px] bg-[#161618] border-[#26262a] text-[#f5f5f5]">
              <Filter className="w-4 h-4 mr-2 text-[#8b8b8e]" />
              <SelectValue placeholder="Outcome" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1c] border-[#26262a]">
              <SelectItem value="all">All Outcomes</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="no-answer">No Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls Table */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Caller</th>
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Product</th>
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Duration</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">AI Score</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Outcome</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call) => (
                <tr key={call.id} className="border-b border-[#26262a] last:border-0 hover:bg-[#1f1f22] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">{call.caller}</p>
                      <p className="text-xs text-[#8b8b8e]">{call.team}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#f5f5f5]">{call.product}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[#f5f5f5]">{call.date}</p>
                      <p className="text-xs text-[#8b8b8e]">{call.time}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{call.duration}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${getScoreColor(call.aiScore)}`}>
                      {call.aiScore}/100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getOutcomeBadge(call.outcome)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
                      <Play className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
