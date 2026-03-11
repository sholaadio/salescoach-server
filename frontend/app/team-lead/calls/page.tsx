"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Search,
  Filter,
  Play,
  Phone
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const callsData = [
  { 
    id: 1, 
    caller: "Chukwuemeka Obi",
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
    product: "Skin Care Set",
    duration: "3:15",
    aiScore: 72,
    outcome: "confirmed",
    date: "2026-03-11",
    time: "09:45 AM"
  },
  { 
    id: 3, 
    caller: "David Okonkwo",
    product: "Hair Growth Oil",
    duration: "2:48",
    aiScore: 45,
    outcome: "rejected",
    date: "2026-03-10",
    time: "04:20 PM"
  },
  { 
    id: 4, 
    caller: "Chukwuemeka Obi",
    product: "Teeth Cleaner",
    duration: "5:10",
    aiScore: 92,
    outcome: "confirmed",
    date: "2026-03-10",
    time: "02:15 PM"
  },
]

export default function TeamCallsPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [memberFilter, setMemberFilter] = useState("all")

  const filteredCalls = callsData.filter(call => {
    const matchesSearch = call.product.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMember = memberFilter === "all" || call.caller.toLowerCase().includes(memberFilter.toLowerCase())
    return matchesSearch && matchesMember
  })

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
      default:
        return <Badge variant="outline" className="border-[#8b8b8e]/30 bg-[#8b8b8e]/10 text-[#8b8b8e]">Pending</Badge>
    }
  }

  return (
    <AppShell userRole="teamlead">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Team Calls</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Review calls from your team members</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#161618] border-[#26262a] text-[#f5f5f5] placeholder:text-[#8b8b8e]"
            />
          </div>
          <Select value={memberFilter} onValueChange={setMemberFilter}>
            <SelectTrigger className="w-[180px] bg-[#161618] border-[#26262a] text-[#f5f5f5]">
              <Filter className="w-4 h-4 mr-2 text-[#8b8b8e]" />
              <SelectValue placeholder="Team Member" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1c] border-[#26262a]">
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="chukwuemeka">Chukwuemeka Obi</SelectItem>
              <SelectItem value="adaora">Adaora Nwosu</SelectItem>
              <SelectItem value="david">David Okonkwo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Calls List */}
        <div className="space-y-3">
          {filteredCalls.map((call) => (
            <div
              key={call.id}
              className="rounded-lg border border-[#26262a] bg-[#161618] p-4 hover:bg-[#1f1f22] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#5e6ad2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-[#f5f5f5]">{call.product}</h3>
                      {getOutcomeBadge(call.outcome)}
                    </div>
                    <p className="text-xs text-[#8b8b8e]">
                      {call.caller} - {call.date} at {call.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-[#8b8b8e]">{call.duration}</p>
                    <p className="text-xs text-[#8b8b8e]">duration</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(call.aiScore)}`}>
                      {call.aiScore}/100
                    </p>
                    <p className="text-xs text-[#8b8b8e]">AI score</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
