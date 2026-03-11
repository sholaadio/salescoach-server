"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Calendar,
  Users,
  UserCheck,
  UserX,
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

const attendanceData = [
  { 
    id: 1, 
    name: "Chukwuemeka Obi",
    team: "Team Abigail",
    role: "Sales Closer",
    present: 18,
    absent: 2,
    rate: 90,
    status: "active"
  },
  { 
    id: 2, 
    name: "Adaora Nwosu",
    team: "Team Mary",
    role: "Sales Closer",
    present: 15,
    absent: 5,
    rate: 75,
    status: "active"
  },
  { 
    id: 3, 
    name: "Emeka Johnson",
    team: "Team Abigail",
    role: "Team Lead",
    present: 20,
    absent: 0,
    rate: 100,
    status: "active"
  },
  { 
    id: 4, 
    name: "Blessing Eze",
    team: "Team Deborah",
    role: "Sales Closer",
    present: 10,
    absent: 10,
    rate: 50,
    status: "warning"
  },
  { 
    id: 5, 
    name: "David Okonkwo",
    team: "Team Mary",
    role: "Sales Closer",
    present: 5,
    absent: 15,
    rate: 25,
    status: "inactive"
  },
]

export default function AttendanceManagementPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = attendanceData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.team.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalEmployees = attendanceData.length
  const avgPresent = Math.round(attendanceData.reduce((sum, item) => sum + item.present, 0) / totalEmployees)
  const avgAbsent = Math.round(attendanceData.reduce((sum, item) => sum + item.absent, 0) / totalEmployees)
  const avgRate = Math.round(attendanceData.reduce((sum, item) => sum + item.rate, 0) / totalEmployees)

  const getRateBadge = (rate: number) => {
    if (rate >= 80) return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">{rate}%</Badge>
    if (rate >= 50) return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">{rate}%</Badge>
    return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">{rate}%</Badge>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">Active</Badge>
      case "warning":
        return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">Warning</Badge>
      case "inactive":
        return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <AppShell userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Attendance Overview</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Monitor employee attendance across all teams</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Employees"
            value={totalEmployees.toString()}
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            label="Avg Days Present"
            value={avgPresent.toString()}
            icon={<UserCheck className="w-4 h-4" />}
          />
          <StatCard
            label="Avg Days Absent"
            value={avgAbsent.toString()}
            icon={<UserX className="w-4 h-4" />}
          />
          <StatCard
            label="Avg Attendance Rate"
            value={`${avgRate}%`}
            icon={<Calendar className="w-4 h-4" />}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
            <Input
              placeholder="Search employees..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Attendance Table */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Team</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Present</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Absent</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Rate</th>
                <th className="text-center text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-[#26262a] last:border-0 hover:bg-[#1f1f22] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#f5f5f5]">{item.name}</p>
                      <p className="text-xs text-[#8b8b8e]">{item.role}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#8b8b8e]">{item.team}</td>
                  <td className="px-4 py-3 text-sm text-[#10b981] text-center">{item.present}</td>
                  <td className="px-4 py-3 text-sm text-[#e5484d] text-center">{item.absent}</td>
                  <td className="px-4 py-3 text-center">{getRateBadge(item.rate)}</td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
