"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Users,
  TrendingUp,
  Banknote,
  Package,
  Trophy,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

const teamMembers = [
  { 
    id: 1,
    name: "Chukwuemeka Obi",
    role: "Sales Closer",
    delivered: "17/20",
    rate: 85,
    commission: 4350,
    status: "active"
  },
  { 
    id: 2,
    name: "Adaora Nwosu",
    role: "Sales Closer",
    delivered: "15/30",
    rate: 50,
    commission: 3300,
    status: "active"
  },
  { 
    id: 3,
    name: "David Okonkwo",
    role: "Sales Closer",
    delivered: "5/15",
    rate: 33,
    commission: 1100,
    status: "warning"
  },
]

export default function TeamLeadDashboard() {
  const [period, setPeriod] = useState("this-month")

  const totalDelivered = 37
  const totalAssigned = 65
  const teamRate = Math.round((totalDelivered / totalAssigned) * 100)
  const totalCommission = teamMembers.reduce((sum, m) => sum + m.commission, 0)

  const getRateColor = (rate: number) => {
    if (rate >= 80) return "text-[#10b981]"
    if (rate >= 50) return "text-[#f5a623]"
    return "text-[#e5484d]"
  }

  return (
    <AppShell userRole="teamlead">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Team Abigail</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Manage your team performance</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Team Members"
            value={teamMembers.length.toString()}
            icon={<Users className="w-4 h-4" />}
          />
          <StatCard
            label="Delivery Rate"
            value={`${teamRate}%`}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            label="Orders Delivered"
            value={`${totalDelivered}/${totalAssigned}`}
            icon={<Package className="w-4 h-4" />}
          />
          <StatCard
            label="Team Earnings"
            value={`N${totalCommission.toLocaleString()}`}
            icon={<Banknote className="w-4 h-4" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Team Performance Target */}
        <div className="rounded-lg border border-[#26262a] bg-[#161618] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#5e6ad2]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#f5f5f5]">Team Excellence Target</h3>
                <p className="text-xs text-[#8b8b8e]">Hit 85% team delivery rate to qualify for bonus pool</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn("text-2xl font-bold", getRateColor(teamRate))}>{teamRate}%</p>
              <p className="text-xs text-[#8b8b8e]">Need 85%+</p>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#26262a]">
            <div 
              className={cn(
                "h-full transition-all",
                teamRate >= 85 ? "bg-[#10b981]" : teamRate >= 50 ? "bg-[#f5a623]" : "bg-[#e5484d]"
              )}
              style={{ width: `${Math.min(teamRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-[#f5f5f5]">Team Members</h2>
            <Trophy className="w-5 h-5 text-[#8b8b8e]" />
          </div>
          <div className="space-y-3">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={cn(
                  "rounded-lg border p-4 transition-colors hover:bg-[#1f1f22]",
                  index === 0 
                    ? "border-[#f5a623]/30 bg-[#f5a623]/5" 
                    : "border-[#26262a] bg-[#161618]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#5e6ad2] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-[#f5f5f5]">{member.name}</h3>
                        {index === 0 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#f5a623]/10 text-[#f5a623]">
                            Top Performer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8b8b8e]">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-[#8b8b8e]">{member.delivered}</p>
                      <p className="text-xs text-[#8b8b8e]">delivered</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xl font-bold", getRateColor(member.rate))}>
                        {member.rate}%
                      </p>
                      <p className="text-xs text-[#8b8b8e]">rate</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-medium text-[#10b981]">
                        N{member.commission.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#8b8b8e]">commission</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
