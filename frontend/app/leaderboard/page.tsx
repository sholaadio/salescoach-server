"use client"

import * as React from "react"
import { Trophy, Users, Medal } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const periods = ["Today", "This Week", "This Month", "This Year", "All Time"]

const teams = [
  {
    rank: 1,
    name: "Team Abigail",
    members: 3,
    delivered: "8/10",
    conversion: 80,
    avgScore: 25,
    isUserTeam: true,
  },
  {
    rank: 2,
    name: "Team Mary",
    members: 3,
    delivered: "8/10",
    conversion: 80,
    avgScore: null,
  },
  {
    rank: 3,
    name: "Team Deborah",
    members: 3,
    delivered: "0/0",
    conversion: 0,
    avgScore: null,
  },
  {
    rank: 4,
    name: "Follow-Up Team",
    members: 3,
    delivered: "0/0",
    conversion: 0,
    avgScore: null,
  },
  {
    rank: 5,
    name: "Social Media Team",
    members: 1,
    delivered: "0/0",
    conversion: 0,
    avgScore: null,
  },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <span className="text-lg">🥇</span>
  if (rank === 2) return <span className="text-lg">🥈</span>
  if (rank === 3) return <span className="text-lg">🥉</span>
  return <span className="text-sm font-medium text-[#5b5b5e]">#{rank}</span>
}

function getConversionColor(conversion: number) {
  if (conversion >= 80) return "text-[#10b981]"
  if (conversion >= 50) return "text-[#f5a623]"
  return "text-[#e5484d]"
}

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("This Month")

  return (
    <AppShell
      title="Leaderboard"
      description="See how all teams are doing & where your team ranks"
      icon={<Trophy className="h-4 w-4" />}
    >
      <div className="space-y-6">
        {/* Period selector */}
        <div className="flex gap-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                selectedPeriod === period
                  ? "bg-[#5e6ad2] text-white"
                  : "text-[#8b8b8e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
              )}
            >
              {period}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-md bg-[#5e6ad2]/15 px-3 py-1.5 text-xs font-medium text-[#5e6ad2]">
            <Users className="h-3.5 w-3.5" />
            Team Rankings
          </button>
        </div>

        {/* Teams list */}
        <div className="space-y-2">
          {teams.map((team) => (
            <div
              key={team.name}
              className={cn(
                "group flex items-center justify-between rounded-lg border bg-[#161618] p-4 transition-colors hover:bg-[#1a1a1c]",
                team.isUserTeam
                  ? "border-[#5e6ad2]/40"
                  : "border-[#26262a]"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center">
                  {getRankIcon(team.rank)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#f5f5f5]">{team.name}</span>
                    {team.isUserTeam && (
                      <Badge 
                        variant="outline" 
                        className="border-[#5e6ad2]/40 bg-[#5e6ad2]/10 text-[10px] text-[#5e6ad2]"
                      >
                        YOUR TEAM
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#5b5b5e]">
                    {team.members} members · {team.delivered} delivered
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className={cn("text-xl font-bold", getConversionColor(team.conversion))}>
                    {team.conversion}%
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-[#5b5b5e]">conversion</p>
                </div>
                <div className="w-16 text-right">
                  {team.avgScore !== null ? (
                    <>
                      <p className="text-xl font-bold text-[#f5f5f5]">{team.avgScore}</p>
                      <p className="text-[10px] uppercase tracking-wide text-[#5b5b5e]">avg score</p>
                    </>
                  ) : (
                    <span className="text-xl text-[#5b5b5e]">—</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
