"use client"

import { AppShell, useSessionUser } from "@/components/app-shell"
import { useAppData } from "@/lib/hooks"
import { LayoutDashboard, AlertTriangle, TrendingUp, Users, Phone, DollarSign } from "lucide-react"
import { useState } from "react"

// ─── Helpers (mirror index.html logic) ───────────────────────────────────────

type Period = "day" | "week" | "month" | "year" | "all"

function filterByPeriod<T extends Record<string, unknown>>(
  items: T[],
  field: string,
  period: Period
): T[] {
  const now = new Date()
  return items.filter((item) => {
    const d = new Date(item[field] as string)
    if (period === "all") return true
    if (period === "day") return d.toDateString() === now.toDateString()
    if (period === "week") {
      const w = new Date(now)
      w.setDate(now.getDate() - 7)
      return d >= w
    }
    if (period === "month")
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    if (period === "year") return d.getFullYear() === now.getFullYear()
    return true
  })
}

function fmtNaira(n: number) {
  return `₦${Number(n || 0).toLocaleString()}`
}

function calcSalesCommission(
  assigned: number,
  delivered: number,
  upsells = 0,
  repeats = 0,
  referrals = 0
): number {
  const a = Math.max(assigned, 0)
  const d = delivered
  const rate = a > 0 ? Math.round((d / a) * 100) : 0
  const perOrder = rate >= 90 ? 200 : rate >= 65 ? 150 : rate >= 50 ? 100 : 0
  const upsellLocked = rate < 50
  const base = d * perOrder
  const upsellBonus = upsellLocked ? 0 : upsells * 600
  return base + upsellBonus + repeats * 300 + referrals * 300
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  accent,
}: {
  label: string
  value: string
  icon: React.ElementType
  sub?: string
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-[#1f1f22] bg-[#0f0f10] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#5b5b5e]">{label}</span>
        <div className="rounded-md bg-[#1f1f22] p-1.5">
          <Icon className="h-3.5 w-3.5 text-[#5b5b5e]" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#f5f5f5]" style={accent ? { color: accent } : {}}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-[#5b5b5e]">{sub}</p>}
    </div>
  )
}

function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const options: { v: Period; l: string }[] = [
    { v: "day", l: "Today" },
    { v: "week", l: "This Week" },
    { v: "month", l: "This Month" },
    { v: "year", l: "This Year" },
    { v: "all", l: "All Time" },
  ]
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === o.v
              ? "bg-[#5e6ad2]/15 text-[#5e6ad2]"
              : "text-[#5b5b5e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagementOverviewPage() {
  const sessionUser = useSessionUser()
  const { data, isLoading, error } = useAppData()
  const [period, setPeriod] = useState<Period>("month")

  if (isLoading) {
    return (
      <AppShell title="Management Overview" description="Company-wide performance" icon={<LayoutDashboard className="h-4 w-4" />}>
        <div className="flex h-64 items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#5e6ad2] border-t-transparent" />
        </div>
      </AppShell>
    )
  }

  if (error || !data) {
    return (
      <AppShell title="Management Overview" description="Company-wide performance" icon={<LayoutDashboard className="h-4 w-4" />}>
        <div className="flex h-64 items-center justify-center text-sm text-red-400">
          ⚠️ {error ?? "Failed to load data"}
        </div>
      </AppShell>
    )
  }

  const { users, teams, reports, logs } = data

  // Filter by period
  const filteredReports = filterByPeriod(reports as unknown as Record<string, unknown>[], "createdAt", period) as typeof reports
  const filteredLogs = filterByPeriod(logs as unknown as Record<string, unknown>[], "date", period) as typeof logs
  const approvedLogs = filteredLogs.filter((l) => l.status === "approved")

  // Stats
  const totalCalls = filteredReports.length
  const avgScore = totalCalls > 0
    ? Math.round(filteredReports.reduce((s, r) => s + (r.analysis?.overallScore ?? 0), 0) / totalCalls)
    : 0
  const totalDelivered = approvedLogs.reduce((s, l) => s + (l.delivered ?? 0), 0)

  const totalCommission = approvedLogs.reduce((sum, log) => {
    if (!log.teamId) return sum
    const team = teams[log.teamId]
    if (team?.type === "sales") {
      return sum + calcSalesCommission(log.assigned ?? 0, log.delivered ?? 0, log.upsells, log.repeats, log.referrals)
    }
    return sum
  }, 0)

  // Red flags: closers with week delivery rate < 65%
  const weekLogs = filterByPeriod(logs as unknown as Record<string, unknown>[], "date", "week") as typeof logs
  const closerWeekMap = new Map<string, { assigned: number; delivered: number }>()
  weekLogs.filter((l) => l.status === "approved").forEach((l) => {
    const prev = closerWeekMap.get(l.closerId) ?? { assigned: 0, delivered: 0 }
    closerWeekMap.set(l.closerId, {
      assigned: prev.assigned + (l.assigned ?? l.callsThrough ?? 0),
      delivered: prev.delivered + (l.delivered ?? 0),
    })
  })
  const redFlags = Array.from(closerWeekMap.entries())
    .map(([closerId, stats]) => {
      const rate = stats.assigned > 0 ? Math.round((stats.delivered / stats.assigned) * 100) : 0
      return { closerId, rate }
    })
    .filter((x) => x.rate < 65 && x.rate > 0)
    .map((x) => {
      const u = users[x.closerId]
      const teamName = u?.teamId ? teams[u.teamId]?.name : "—"
      return { name: u?.name ?? x.closerId, team: teamName ?? "—", weekRate: x.rate }
    })

  // Top performers
  const closerScoreMap = new Map<string, number[]>()
  filteredReports.forEach((r) => {
    const arr = closerScoreMap.get(r.closerId) ?? []
    arr.push(r.analysis?.overallScore ?? 0)
    closerScoreMap.set(r.closerId, arr)
  })
  const topPerformers = Array.from(closerScoreMap.entries())
    .map(([closerId, scores]) => ({
      closerId,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)
    .map((x) => {
      const u = users[x.closerId]
      const teamName = u?.teamId ? teams[u.teamId]?.name : "—"
      return { name: u?.name ?? x.closerId, team: teamName ?? "—", avg: x.avg }
    })

  // Team summary
  const teamSummary = Object.values(teams).map((team) => {
    const teamLogs = approvedLogs.filter((l) => l.teamId === team.id)
    const teamReports = filteredReports.filter((r) => r.teamId === team.id)
    const delivered = teamLogs.reduce((s, l) => s + (l.delivered ?? 0), 0)
    const assigned = teamLogs.reduce((s, l) => s + (l.assigned ?? l.callsThrough ?? 0), 0)
    const rate = assigned > 0 ? Math.round((delivered / assigned) * 100) : 0
    const avgTeamScore =
      teamReports.length > 0
        ? Math.round(teamReports.reduce((s, r) => s + (r.analysis?.overallScore ?? 0), 0) / teamReports.length)
        : 0
    const memberCount = Object.values(users).filter((u) => u.teamId === team.id && u.role === "closer").length
    return { team, delivered, rate, avgTeamScore, memberCount }
  })

  return (
    <AppShell
      title="Management Overview"
      description="Company-wide performance dashboard"
      icon={<LayoutDashboard className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Greeting */}
        {sessionUser && (
          <div>
            <h2 className="text-lg font-semibold text-[#f5f5f5]">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
              {sessionUser.name.split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-[#5b5b5e]">Here's how the team is performing</p>
          </div>
        )}

        {/* Period filter */}
        <PeriodFilter value={period} onChange={setPeriod} />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Calls" value={String(totalCalls)} icon={Phone} sub={`${period === "day" ? "today" : period === "week" ? "this week" : "this month"}`} />
          <StatCard label="Avg AI Score" value={`${avgScore}/100`} icon={TrendingUp} accent={avgScore >= 75 ? "#00e5a0" : avgScore >= 60 ? "#fbbf24" : "#ef4444"} />
          <StatCard label="Total Delivered" value={String(totalDelivered)} icon={Users} />
          <StatCard label="Total Commission" value={fmtNaira(totalCommission)} icon={DollarSign} accent="#f97316" />
        </div>

        {/* Red flags */}
        {redFlags.length > 0 && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                Performance Alerts ({redFlags.length})
              </span>
            </div>
            <div className="space-y-2">
              {redFlags.map((f) => (
                <div key={f.name} className="flex items-center justify-between rounded-lg bg-[#0f0f10] px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{f.name}</p>
                    <p className="text-xs text-[#5b5b5e]">{f.team}</p>
                  </div>
                  <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
                    {f.weekRate}% rate
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Team summary */}
          <div className="rounded-xl border border-[#1f1f22] bg-[#0f0f10] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#f5f5f5]">Team Performance</h3>
            <div className="space-y-2">
              {teamSummary.map(({ team, delivered, rate, avgTeamScore, memberCount }) => (
                <div key={team.id} className="flex items-center justify-between rounded-lg bg-[#1a1a1c] px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-[#f5f5f5]">{team.name}</p>
                    <p className="text-xs text-[#5b5b5e]">{memberCount} closers · {delivered} delivered</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${rate >= 65 ? "text-[#00e5a0]" : "text-red-400"}`}>
                      {rate}%
                    </p>
                    <p className="text-xs text-[#5b5b5e]">score {avgTeamScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top performers */}
          <div className="rounded-xl border border-[#1f1f22] bg-[#0f0f10] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#f5f5f5]">Top Performers</h3>
            {topPerformers.length === 0 ? (
              <p className="text-sm text-[#5b5b5e]">No call data for this period</p>
            ) : (
              <div className="space-y-2">
                {topPerformers.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3 rounded-lg bg-[#1a1a1c] px-3 py-2.5">
                    <span className="text-sm font-bold text-[#5b5b5e]">#{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#f5f5f5]">{p.name}</p>
                      <p className="text-xs text-[#5b5b5e]">{p.team}</p>
                    </div>
                    <span className="text-sm font-bold text-[#f97316]">{p.avg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
