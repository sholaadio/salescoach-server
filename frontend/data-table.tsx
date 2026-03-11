"use client"

import { AppShell } from "@/components/app-shell"
import { PeriodFilter } from "@/components/period-filter"
import { useState } from "react"
import { 
  Trophy,
  Medal,
  TrendingUp,
  Users
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const teamsData = [
  { 
    rank: 1,
    name: "Team Abigail",
    lead: "Emeka Johnson",
    members: 3,
    delivered: "8/10",
    conversion: 80,
    avgScore: 25
  },
  { 
    rank: 2,
    name: "Team Mary",
    lead: "Grace Adeyemi",
    members: 3,
    delivered: "8/10",
    conversion: 80,
    avgScore: null
  },
  { 
    rank: 3,
    name: "Team Deborah",
    lead: "Samuel Okoro",
    members: 3,
    delivered: "0/0",
    conversion: 0,
    avgScore: null
  },
  { 
    rank: 4,
    name: "Follow-Up Team",
    lead: "Chioma Eze",
    members: 3,
    delivered: "0/0",
    conversion: 0,
    avgScore: null
  },
  { 
    rank: 5,
    name: "Social Media Team",
    lead: "Kemi Adeyemi",
    members: 1,
    delivered: "0/0",
    conversion: 0,
    avgScore: null
  },
]

const individualsData = [
  { 
    rank: 1,
    name: "Chukwuemeka Obi",
    team: "Team Abigail",
    delivered: "17/20",
    conversion: 85,
    avgScore: 78,
    commission: 12500
  },
  { 
    rank: 2,
    name: "Blessing Eze",
    team: "Team Deborah",
    delivered: "25/30",
    conversion: 83,
    avgScore: 72,
    commission: 10200
  },
  { 
    rank: 3,
    name: "Emeka Johnson",
    team: "Team Abigail",
    delivered: "18/20",
    conversion: 90,
    avgScore: 85,
    commission: 15000
  },
  { 
    rank: 4,
    name: "Adaora Nwosu",
    team: "Team Mary",
    delivered: "15/30",
    conversion: 50,
    avgScore: 45,
    commission: 3300
  },
]

export default function ManagementLeaderboardPage() {
  const [period, setPeriod] = useState("this-month")
  const [view, setView] = useState("teams")

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-[#f5a623]" />
    if (rank === 2) return <Medal className="w-5 h-5 text-[#8b8b8e]" />
    if (rank === 3) return <Medal className="w-5 h-5 text-[#cd7f32]" />
    return <span className="text-sm text-[#8b8b8e] font-medium">#{rank}</span>
  }

  const getConversionColor = (conversion: number) => {
    if (conversion >= 80) return "text-[#10b981]"
    if (conversion >= 50) return "text-[#f5a623]"
    return "text-[#e5484d]"
  }

  return (
    <AppShell userRole="ceo">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#f5f5f5]">Leaderboard</h1>
            <p className="text-sm text-[#8b8b8e] mt-1">Track performance across teams and individuals</p>
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>

        {/* View Toggle */}
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList className="bg-[#161618] border border-[#26262a]">
            <TabsTrigger 
              value="teams" 
              className="data-[state=active]:bg-[#5e6ad2] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Team Rankings
            </TabsTrigger>
            <TabsTrigger 
              value="individuals"
              className="data-[state=active]:bg-[#5e6ad2] data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Individual Rankings
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Teams View */}
        {view === "teams" && (
          <div className="space-y-3">
            {teamsData.map((team) => (
              <div
                key={team.rank}
                className={cn(
                  "rounded-lg border p-4 transition-colors hover:bg-[#1f1f22]",
                  team.rank <= 3 
                    ? "border-[#5e6ad2]/30 bg-[#5e6ad2]/5" 
                    : "border-[#26262a] bg-[#161618]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(team.rank)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-[#f5f5f5]">{team.name}</h3>
                      </div>
                      <p className="text-xs text-[#8b8b8e]">
                        {team.members} members - Lead: {team.lead}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className={cn("text-2xl font-bold", getConversionColor(team.conversion))}>
                        {team.conversion}%
                      </p>
                      <p className="text-xs text-[#8b8b8e]">conversion</p>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <p className="text-lg font-medium text-[#f5f5f5]">
                        {team.avgScore !== null ? team.avgScore : "-"}
                      </p>
                      <p className="text-xs text-[#8b8b8e]">avg score</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Individuals View */}
        {view === "individuals" && (
          <div className="space-y-3">
            {individualsData.map((person) => (
              <div
                key={person.rank}
                className={cn(
                  "rounded-lg border p-4 transition-colors hover:bg-[#1f1f22]",
                  person.rank <= 3 
                    ? "border-[#5e6ad2]/30 bg-[#5e6ad2]/5" 
                    : "border-[#26262a] bg-[#161618]"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(person.rank)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#f5f5f5]">{person.name}</h3>
                      <p className="text-xs text-[#8b8b8e]">{person.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-[#8b8b8e]">{person.delivered}</p>
                      <p className="text-xs text-[#8b8b8e]">delivered</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-2xl font-bold", getConversionColor(person.conversion))}>
                        {person.conversion}%
                      </p>
                      <p className="text-xs text-[#8b8b8e]">conversion</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-lg font-medium text-[#10b981]">
                        N{person.commission.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#8b8b8e]">commission</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
