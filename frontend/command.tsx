"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  User
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const teamMembers = [
  { 
    id: 1,
    name: "Chukwuemeka Obi",
    employeeId: "SC001",
    role: "Sales Closer",
    phone: "+234 801 234 5678",
    email: "chukwuemeka@shoppyrex.com",
    joinDate: "2025-06-15",
    delivered: "17/20",
    rate: 85,
    status: "active"
  },
  { 
    id: 2,
    name: "Adaora Nwosu",
    employeeId: "SC002",
    role: "Sales Closer",
    phone: "+234 802 345 6789",
    email: "adaora@shoppyrex.com",
    joinDate: "2025-08-20",
    delivered: "15/30",
    rate: 50,
    status: "active"
  },
  { 
    id: 3,
    name: "David Okonkwo",
    employeeId: "SC003",
    role: "Sales Closer",
    phone: "+234 803 456 7890",
    email: "david@shoppyrex.com",
    joinDate: "2026-01-10",
    delivered: "5/15",
    rate: 33,
    status: "probation"
  },
]

export default function TeamMembersPage() {
  const [period, setPeriod] = useState("this-month")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRateColor = (rate: number) => {
    if (rate >= 80) return "text-[#10b981]"
    if (rate >= 50) return "text-[#f5a623]"
    return "text-[#e5484d]"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]">Active</Badge>
      case "probation":
        return <Badge variant="outline" className="border-[#f5a623]/30 bg-[#f5a623]/10 text-[#f5a623]">Probation</Badge>
      case "inactive":
        return <Badge variant="outline" className="border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d]">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <AppShell userRole="teamlead">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Team Members</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Manage and view your team</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8e]" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#161618] border-[#26262a] text-[#f5f5f5] placeholder:text-[#8b8b8e]"
          />
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-lg border border-[#26262a] bg-[#161618] p-5 hover:border-[#5e6ad2]/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#5e6ad2] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#f5f5f5]">{member.name}</h3>
                    <p className="text-xs text-[#8b8b8e]">{member.employeeId}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-[#8b8b8e] hover:text-[#f5f5f5] hover:bg-[#26262a]">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1a1a1c] border-[#26262a]">
                    <DropdownMenuItem className="text-[#f5f5f5] focus:bg-[#26262a]">View Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#f5f5f5] focus:bg-[#26262a]">View Performance</DropdownMenuItem>
                    <DropdownMenuItem className="text-[#f5f5f5] focus:bg-[#26262a]">Send Message</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#8b8b8e]">
                  <User className="w-3 h-3" />
                  <span>{member.role}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8b8b8e]">
                  <Phone className="w-3 h-3" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8b8b8e]">
                  <Mail className="w-3 h-3" />
                  <span>{member.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#26262a] flex items-center justify-between">
                <div>
                  <p className={cn("text-lg font-bold", getRateColor(member.rate))}>{member.rate}%</p>
                  <p className="text-xs text-[#8b8b8e]">{member.delivered} delivered</p>
                </div>
                {getStatusBadge(member.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
