"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { Building2, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

const mockTeamsData = [
  {
    id: "team1",
    name: "Team Abigail",
    type: "sales",
    lead: "Lady Abigail",
    members: [
      { id: "c001", name: "Chukwuemeka Obi", role: "closer", avgScore: 92, rate: 95, earnings: 18000, weekRate: 92 },
      { id: "c002", name: "Fatima Aliyu", role: "closer", avgScore: 88, rate: 90, earnings: 15000, weekRate: 88 },
      { id: "tl001", name: "Lady Abigail", role: "teamlead", avgScore: 80, rate: 85, earnings: 12000, weekRate: 85 },
    ]
  },
  {
    id: "team2",
    name: "Team Mary",
    type: "sales",
    lead: "Lady Mary",
    members: [
      { id: "c003", name: "Segun Adeyemi", role: "closer", avgScore: 85, rate: 88, earnings: 14000, weekRate: 86 },
      { id: "c004", name: "Ngozi Eze", role: "closer", avgScore: 72, rate: 75, earnings: 9000, weekRate: 70 },
      { id: "tl002", name: "Lady Mary", role: "teamlead", avgScore: 78, rate: 80, earnings: 11000, weekRate: 80 },
    ]
  },
  {
    id: "team4",
    name: "Follow-Up Team",
    type: "followup",
    lead: "Lady Tiwalade",
    members: [
      { id: "c007", name: "Blessing Nwosu", role: "closer", avgScore: 60, rate: 55, earnings: 6000, weekRate: 45 },
      { id: "c008", name: "Emeka Eze", role: "closer", avgScore: 75, rate: 78, earnings: 10000, weekRate: 75 },
      { id: "tl004", name: "Lady Tiwalade", role: "teamlead", avgScore: 82, rate: 85, earnings: 13000, weekRate: 85 },
    ]
  },
  {
    id: "team5",
    name: "Social Media Team",
    type: "socialmedia",
    lead: "Mr Kelvin",
    members: [
      { id: "tl005", name: "Mr Kelvin", role: "teamlead", avgScore: 70, rate: 72, earnings: 17500, weekRate: 72 },
    ]
  },
]

const user = {
  name: "Mr Shola Adio",
  role: "ceo" as const,
  employeeId: "MGT001"
}

export default function ManagementTeamsPage() {
  const [period, setPeriod] = useState("month")

  const getTeamTypeColor = (type: string) => {
    switch(type) {
      case "sales": return "#5e6ad2"
      case "followup": return "#a78bfa"
      case "socialmedia": return "#ec4899"
      default: return "#5e6ad2"
    }
  }

  const getTeamTypeLabel = (type: string) => {
    switch(type) {
      case "sales": return "Sales"
      case "followup": return "Follow-up"
      case "socialmedia": return "Social Media"
      default: return type
    }
  }

  return (
    <AppShell 
      title="Teams"
      description="All teams and their members"
      icon={<Building2 className="h-4 w-4" />}
      user={user}
    >
      <div className="space-y-6">
        <PeriodFilter value={period} onChange={setPeriod} />

        {mockTeamsData.map((team) => {
          const color = getTeamTypeColor(team.type)
          return (
            <div 
              key={team.id}
              className="overflow-hidden rounded-lg border border-[#26262a] bg-[#161618]"
            >
              {/* Team Header */}
              <div className="flex items-center justify-between border-b border-[#26262a] px-4 py-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[#f5f5f5]">{team.name}</h3>
                  <span 
                    className="rounded px-2 py-0.5 text-[10px] font-medium"
                    style={{ 
                      backgroundColor: `${color}15`,
                      color: color
                    }}
                  >
                    {getTeamTypeLabel(team.type)}
                  </span>
                </div>
                <p className="text-xs text-[#5b5b5e]">
                  Lead: <span className="text-[#c8c8c8]">{team.lead}</span>
                </p>
              </div>

              {/* Team Info for Social Media */}
              {team.type === "socialmedia" && (
                <div className="border-b border-[#26262a] bg-[#ec4899]/5 px-4 py-2">
                  <p className="text-xs text-[#ec4899]">
                    Commission is pooled and split equally among all team members. 
                    Individual earnings shown as share of team pool.
                  </p>
                </div>
              )}

              {team.type === "followup" && (
                <div className="border-b border-[#26262a] bg-[#a78bfa]/5 px-4 py-2">
                  <p className="text-xs text-[#a78bfa]">
                    Rate = Delivered / Calls Through (not total calls made). 
                    Upsell bonus always active.
                  </p>
                </div>
              )}

              {/* Members Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#26262a] bg-[#0f0f10]">
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Name</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Role</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">AI Score</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">
                      {team.type === "followup" ? "Calls Through Rate" : "Delivery Rate"}
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Earnings</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Week Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {team.members.map((member) => (
                    <tr 
                      key={member.id}
                      className="border-b border-[#1f1f22] last:border-0 hover:bg-[#1a1a1c]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
                            style={{ 
                              backgroundColor: `${color}15`,
                              color: color
                            }}
                          >
                            {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-[#f5f5f5]">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-medium",
                          member.role === "teamlead" 
                            ? "bg-[#f5a623]/15 text-[#f5a623]" 
                            : "bg-[#5e6ad2]/15 text-[#5e6ad2]"
                        )}>
                          {member.role === "teamlead" ? "Team Lead" : "Closer"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "font-medium",
                          member.avgScore >= 70 ? "text-[#10b981]" : 
                          member.avgScore >= 50 ? "text-[#f5a623]" : 
                          "text-[#e5484d]"
                        )}>
                          {member.avgScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "rounded px-2 py-0.5 text-xs font-medium",
                          member.rate >= 90 ? "bg-[#10b981]/15 text-[#10b981]" : 
                          member.rate >= 50 ? "bg-[#f5a623]/15 text-[#f5a623]" : 
                          "bg-[#e5484d]/15 text-[#e5484d]"
                        )}>
                          {member.rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-[#f5a623]">
                          N{member.earnings.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {member.weekRate >= member.rate ? (
                            <TrendingUp className="h-3.5 w-3.5 text-[#10b981]" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-[#e5484d]" />
                          )}
                          <span className={cn(
                            "text-xs font-medium",
                            member.weekRate >= 60 ? "text-[#10b981]" : "text-[#e5484d]"
                          )}>
                            {member.weekRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
