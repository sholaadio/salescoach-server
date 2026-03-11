"use client"

import { AppShell } from "@/components/app-shell"
import { StatCard } from "@/components/stat-card"
import { PeriodFilter } from "@/components/period-filter"
import { DataTable } from "@/components/data-table"
import { useState } from "react"
import { 
  LayoutDashboard, 
  AlertTriangle,
  TrendingUp,
  Users,
  Phone,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for demo
const mockTeams = [
  { id: "team1", name: "Team Abigail", type: "sales", members: 3, avgScore: 78, earnings: 45000, delivered: 24, rate: 80 },
  { id: "team2", name: "Team Mary", type: "sales", members: 3, avgScore: 72, earnings: 38000, delivered: 20, rate: 75 },
  { id: "team3", name: "Team Deborah", type: "sales", members: 3, avgScore: 65, earnings: 28000, delivered: 15, rate: 60 },
  { id: "team4", name: "Follow-Up Team", type: "followup", members: 3, avgScore: 81, earnings: 52000, delivered: 30, rate: 85 },
  { id: "team5", name: "Social Media Team", type: "socialmedia", members: 2, avgScore: 70, earnings: 35000, delivered: 18, rate: 72 },
]

const mockRedFlags = [
  { name: "Blessing Nwosu", team: "Follow-Up Team", weekRate: 45 },
  { name: "Tunde Bakare", team: "Team Deborah", weekRate: 52 },
]

const mockTopPerformers = [
  { name: "Chukwuemeka Obi", team: "Team Abigail", score: 92, rate: 95 },
  { name: "Fatima Aliyu", team: "Team Abigail", score: 88, rate: 90 },
  { name: "Segun Adeyemi", team: "Team Mary", score: 85, rate: 88 },
]

const user = {
  name: "Mr Shola Adio",
  role: "ceo" as const,
  employeeId: "MGT001"
}

export default function ManagementOverviewPage() {
  const [period, setPeriod] = useState("month")

  const totalCalls = 156
  const avgScore = 75
  const totalCommission = 198000
  const totalDelivered = 107
  const poolQualifiers = 4

  return (
    <AppShell 
      title="Management Overview"
      description="Company-wide performance dashboard"
      icon={<LayoutDashboard className="h-4 w-4" />}
      user={user}
    >
      <div className="space-y-6">
        {/* Period Filter */}
        <PeriodFilter value={period} onChange={setPeriod} />

        {/* Key Stats */}
        <div className="grid grid-cols-5 gap-4">
          <StatCard 
            label="Total Calls" 
            value={totalCalls}
            accentColor="#5e6ad2"
          />
          <StatCard 
            label="Avg AI Score" 
            value={avgScore}
            accentColor={avgScore >= 70 ? "#10b981" : avgScore >= 50 ? "#f5a623" : "#e5484d"}
          />
          <StatCard 
            label="Total Commission" 
            value={`N${totalCommission.toLocaleString()}`}
            subtext="Payable end of month"
            accentColor="#f5a623"
          />
          <StatCard 
            label="Orders Delivered" 
            value={totalDelivered}
            accentColor="#26b5ce"
          />
          <StatCard 
            label="Excellence Pool" 
            value={`${poolQualifiers} staff`}
            subtext="Qualifying at 90%+"
            accentColor="#10b981"
          />
        </div>

        {/* Red Flags */}
        {mockRedFlags.length > 0 && (
          <div className="rounded-lg border border-[#e5484d]/30 bg-[#e5484d]/5 p-4">
            <div className="flex items-center gap-2 text-[#e5484d]">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Performance Red Flags - This Week</span>
            </div>
            <p className="mt-1 text-xs text-[#ff9999]">
              {mockRedFlags.length} staff member(s) below 60% delivery rate this week:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {mockRedFlags.map((flag) => (
                <span 
                  key={flag.name}
                  className="rounded-full bg-[#e5484d]/10 px-3 py-1 text-xs font-medium text-[#e5484d]"
                >
                  {flag.name} ({flag.team}) - {flag.weekRate}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Teams Overview and Top Performers */}
        <div className="grid grid-cols-3 gap-4">
          {/* Teams */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[#f5f5f5]">
                <Users className="h-4 w-4 text-[#5e6ad2]" />
                Team Performance
              </h2>
            </div>
            <DataTable
              columns={[
                { 
                  header: "Team", 
                  cell: (row) => (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#f5f5f5]">{row.name}</span>
                      <span className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium",
                        row.type === "sales" && "bg-[#5e6ad2]/15 text-[#5e6ad2]",
                        row.type === "followup" && "bg-[#a78bfa]/15 text-[#a78bfa]",
                        row.type === "socialmedia" && "bg-[#ec4899]/15 text-[#ec4899]"
                      )}>
                        {row.type === "sales" ? "Sales" : row.type === "followup" ? "Follow-up" : "Social"}
                      </span>
                    </div>
                  )
                },
                { header: "Members", accessorKey: "members" as keyof typeof mockTeams[0] },
                { 
                  header: "Avg Score", 
                  cell: (row) => (
                    <span className={cn(
                      "font-medium",
                      row.avgScore >= 70 ? "text-[#10b981]" : row.avgScore >= 50 ? "text-[#f5a623]" : "text-[#e5484d]"
                    )}>
                      {row.avgScore}
                    </span>
                  )
                },
                { 
                  header: "Delivery Rate", 
                  cell: (row) => (
                    <span className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium",
                      row.rate >= 90 ? "bg-[#10b981]/15 text-[#10b981]" : 
                      row.rate >= 50 ? "bg-[#f5a623]/15 text-[#f5a623]" : 
                      "bg-[#e5484d]/15 text-[#e5484d]"
                    )}>
                      {row.rate}%
                    </span>
                  )
                },
                { 
                  header: "Earnings", 
                  cell: (row) => (
                    <span className="font-medium text-[#f5a623]">
                      N{row.earnings.toLocaleString()}
                    </span>
                  )
                },
              ]}
              data={mockTeams}
            />
          </div>

          {/* Top Performers */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-[#f5f5f5]">
              <TrendingUp className="h-4 w-4 text-[#10b981]" />
              Top Performers
            </h2>
            <div className="rounded-lg border border-[#26262a] bg-[#161618] p-4">
              <div className="space-y-3">
                {mockTopPerformers.map((performer, index) => (
                  <div 
                    key={performer.name}
                    className="flex items-center justify-between rounded-md bg-[#1f1f22] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        index === 0 && "bg-[#f5a623]/20 text-[#f5a623]",
                        index === 1 && "bg-[#9ca3af]/20 text-[#9ca3af]",
                        index === 2 && "bg-[#cd7c2f]/20 text-[#cd7c2f]"
                      )}>
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#f5f5f5]">{performer.name}</p>
                        <p className="text-[11px] text-[#5b5b5e]">{performer.team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#10b981]">{performer.score}</p>
                      <p className="text-[11px] text-[#5b5b5e]">{performer.rate}% rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg border border-[#26262a] bg-[#161618] p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5b5b5e]">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-between rounded-md bg-[#1f1f22] p-3 text-left transition-colors hover:bg-[#26262a]">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#5e6ad2]" />
                    <span className="text-sm text-[#c8c8c8]">View All Calls</span>
                  </div>
                  <span className="text-xs text-[#5b5b5e]">{totalCalls}</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-md bg-[#1f1f22] p-3 text-left transition-colors hover:bg-[#26262a]">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#f5a623]" />
                    <span className="text-sm text-[#c8c8c8]">Commission Report</span>
                  </div>
                  <span className="text-xs text-[#5b5b5e]">Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
