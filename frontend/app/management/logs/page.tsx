"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  ClipboardList,
  Package,
  Truck,
  CheckCircle,
  Search,
  Filter,
  Eye
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

const logsData = [
  { 
    id: 1, 
    date: "2026-03-11",
    closer: "Chukwuemeka Obi",
    team: "Team Abigail",
    assigned: 20,
    confirmed: 18,
    delivered: 17,
    rate: 85,
    commission: 4350,
    status: "approved"
  },
  { 
    id: 2, 
    date: "2026-03-11",
    closer: "Adaora Nwosu",
    team: "Team Mary",
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
    closer: "Emeka Johnson",
    team: "Team Abigail",
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
    closer: "Blessing Eze",
    team: "Team Deborah",
    assigned: 30,
    confirmed: 28,
    delivered: 25,
    rate: 83,
    commission: 6150,
    status: "approved"
  },
]

export default function LogsPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredLogs = logsData.filter(log => {
    const matchesSearch = log.closer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.team.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAssigned = logsData.reduce((sum, log) => sum + log.assigned, 0)
  const totalConfirmed = logsData.reduce((sum, log) => sum + log.confirmed, 0)
  const totalDelivered = logsData.reduce((sum, log) => sum + log.delivered, 0)
  const avgRate = Math.round(logsData.reduce((sum, log) => sum + log.rate, 0) / logsData.length)

  const getRateBadge = (rate: number) => {
    if (rate >= 80) return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">{rate}%</Badge>
    if (rate >= 50) return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">{rate}%</Badge>
    return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">{rate}%</Badge>
  }

  return (
    <AppShell userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Daily Logs</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Review and approve daily order logs</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Assigned"
            value={totalAssigned.toString()}
            icon={<ClipboardList className="w-4 h-4" />}
          />
          <StatCard
            label="Total Confirmed"
            value={totalConfirmed.toString()}
            icon={<Package className="w-4 h-4" />}
          />
          <StatCard
            label="Total Delivered"
            value={totalDelivered.toString()}
            icon={<Truck className="w-4 h-4" />}
          />
          <StatCard
            label="Avg Delivery Rate"
            value={`${avgRate}%`}
            icon={<CheckCircle className="w-4 h-4" />}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
            <Input
              placeholder="Search logs..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
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
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#26262a] last:border-0 hover:bg-[#1f1f22] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#f5f5f5]">{log.date}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">{log.closer}</p>
                      <p className="text-xs text-[#8b8b8e]">{log.team}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.assigned}</td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.confirmed}</td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e] text-center">{log.delivered}</td>
                  <td className="px-4 py-3 text-center">{getRateBadge(log.rate)}</td>
                  <td className="px-4 py-3 text-sm text-[#10b981] text-right">N{log.commission.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge 
                      variant="outline" 
                      className={log.status === "approved" 
                        ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]" 
                        : "border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]"
                      }
                    >
                      {log.status === "approved" ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
                      <Eye className="w-4 h-4" />
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
