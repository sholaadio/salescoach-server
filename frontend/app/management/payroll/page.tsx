"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Banknote,
  Users,
  TrendingUp,
  CheckCircle2,
  Download,
  Filter,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const payrollData = [
  { 
    id: 1, 
    name: "Chukwuemeka Obi", 
    team: "Team Abigail", 
    role: "Sales Closer",
    baseSalary: 50000,
    commission: 12500,
    bonus: 5000,
    deductions: 2500,
    netPay: 65000,
    status: "paid"
  },
  { 
    id: 2, 
    name: "Adaora Nwosu", 
    team: "Team Mary", 
    role: "Sales Closer",
    baseSalary: 50000,
    commission: 8750,
    bonus: 0,
    deductions: 2500,
    netPay: 56250,
    status: "pending"
  },
  { 
    id: 3, 
    name: "Emeka Johnson", 
    team: "Team Abigail", 
    role: "Team Lead",
    baseSalary: 75000,
    commission: 15000,
    bonus: 10000,
    deductions: 5000,
    netPay: 95000,
    status: "paid"
  },
  { 
    id: 4, 
    name: "Blessing Eze", 
    team: "Team Deborah", 
    role: "Sales Closer",
    baseSalary: 50000,
    commission: 0,
    bonus: 0,
    deductions: 2500,
    netPay: 47500,
    status: "pending"
  },
]

export default function PayrollPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData = payrollData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.team.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPayroll = payrollData.reduce((sum, item) => sum + item.netPay, 0)
  const totalCommissions = payrollData.reduce((sum, item) => sum + item.commission, 0)
  const totalBonuses = payrollData.reduce((sum, item) => sum + item.bonus, 0)
  const paidCount = payrollData.filter(item => item.status === "paid").length

  return (
    <AppShell userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Payroll</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Manage employee compensation and payments</p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodFilter value={period} onChange={setPeriod} />
            <Button className="bg-[#5e6ad2] hover:bg-[#6b77db] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Payroll"
            value={`N${totalPayroll.toLocaleString()}`}
            icon={<Banknote className="w-4 h-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Total Commissions"
            value={`N${totalCommissions.toLocaleString()}`}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Total Bonuses"
            value={`N${totalBonuses.toLocaleString()}`}
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            label="Paid"
            value={`${paidCount}/${payrollData.length}`}
            icon={<CheckCircle2 className="w-4 h-4" />}
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payroll Table */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Team</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Base</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Commission</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Bonus</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Deductions</th>
                <th className="text-right text-xs font-medium text-[#8b8b8e] uppercase tracking-wider px-4 py-3">Net Pay</th>
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
                  <td className="px-4 py-3 text-sm text-[#f5f5f5] text-right">N{item.baseSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#10b981] text-right">+N{item.commission.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#5e6ad2] text-right">+N{item.bonus.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-[#e5484d] text-right">-N{item.deductions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#f5f5f5] text-right">N{item.netPay.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge 
                      variant="outline" 
                      className={item.status === "paid" 
                        ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]" 
                        : "border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]"
                      }
                    >
                      {item.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
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
