"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock
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
import { cn } from "@/lib/utils"

const logsData = [
  { 
    id: 1, 
    date: "2026-03-11",
    closer: "Chukwuemeka Obi",
    assigned: 20,
    confirmed: 18,
    delivered: 17,
    rate: 85,
    commission: 4350,
    status: "pending"
  },
  { 
    id: 2, 
    date: "2026-03-11",
    closer: "Adaora Nwosu",
    assigned: 30,
    confirmed: 25,
    delivered: 15,
    rate: 50,
    commission: 3300,
    status: "pending"
  },
  { 
    id: 3, 
    date: "2026-03-10",
    closer: "Chukwuemeka Obi",
    assigned: 20,
    confirmed: 19,
    delivered: 18,
    rate: 90,
    commission: 5400,
    status: "approved"
  },
  { 
    id: 4, 
    date: "2026-03-10",
    closer: "David Okonkwo",
    assigned: 15,
    confirmed: 10,
    delivered: 5,
    rate: 33,
    commission: 1100,
    status: "approved"
  },
]

export default function TeamLogsPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.closer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getRateBadge = (rate: number) => {
    if (rate >= 80) return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">{rate}%</Badge>
    if (rate >= 50) return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">{rate}%</Badge>
    return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">{rate}%</Badge>
  }

  const handleApprove = (id: number) => {
    console.log("Approving log:", id)
  }

  const handleReject = (id: number) => {
    console.log("Rejecting log:", id)
  }

  return (
    <AppShell userRole="teamlead">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Team Logs</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Review and approve daily logs from your team</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
            <Input
              placeholder="Search by closer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#161618] border-[#26262a] text-[#f5f5f5] placeholder:text-[#8b8b8e]"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#161618] border-[#26262a] text-[#f5f5f5]">
              <Filter className="w-4 h-4 mr-2 text-[#8b8b8e]" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1c] border-[#26262a]">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Closer</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Assigned</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Confirmed</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Delivered</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Rate</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Commission</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#26262a] last:border-0 hover:bg-[#1f1f22] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#f5f5f5]">{log.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#f5f5f5]">{log.closer}</td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.assigned}</td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.confirmed}</td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.delivered}</td>
                  <td className="px-4 py-3 text-center">{getRateBadge(log.rate)}</td>
                  <td className="px-4 py-3 text-sm text-[#10b981] text-right">N{log.commission.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {log.status === "pending" ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleApprove(log.id)}
                          className="text-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/10"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleReject(log.id)}
                          className="text-[#e5484d] hover:text-[#e5484d] hover:bg-[#e5484d]/10"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            log.status === "approved" 
                              ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]" 
                              : "border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]"
                          )}
                        >
                          {log.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                    )}
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
