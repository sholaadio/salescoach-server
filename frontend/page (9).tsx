"use client"

import * as React from "react"
import { LayoutDashboard, TrendingUp, Phone, Star, DollarSign, Target, Info } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const periods = ["Today", "This Week", "This Month", "This Year", "All Time"]

const stats = [
  { 
    label: "TOTAL CALLS", 
    value: "1", 
    color: "border-l-[#5e6ad2]",
    icon: Phone
  },
  { 
    label: "AVG AI SCORE", 
    value: "25", 
    color: "border-l-[#f5a623]",
    icon: Star
  },
  { 
    label: "PERIOD EARNINGS", 
    value: "₦3,000", 
    subtext: "Paid with salary",
    color: "border-l-[#26b5ce]",
    icon: DollarSign
  },
  { 
    label: "DELIVERY RATE", 
    value: "80%", 
    color: "border-l-[#10b981]",
    icon: Target
  },
]

const commissionRules = [
  { tier: "90%+", reward: "₦200/delivered", emoji: "🥇" },
  { tier: "65-89%", reward: "₦150", emoji: "🥈" },
  { tier: "50-64%", reward: "₦100", emoji: "🥉" },
  { tier: "Below 50%", reward: "₦0", emoji: "" },
]

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("This Month")

  return (
    <AppShell
      title="Dashboard"
      description="Your performance overview"
      icon={<LayoutDashboard className="h-4 w-4" />}
    >
      <TooltipProvider>
        <div className="space-y-6">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#f5f5f5]">
              Hey Chukwuemeka
            </h2>
            <p className="text-sm text-[#5b5b5e]">Team Abigail</p>
          </div>

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

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-lg border border-[#26262a] bg-[#161618] p-4 border-l-2",
                  stat.color
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                    {stat.label}
                  </p>
                  <stat.icon className="h-3.5 w-3.5 text-[#5b5b5e]" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-[#f5f5f5]">{stat.value}</p>
                {stat.subtext && (
                  <p className="mt-0.5 text-[11px] text-[#5b5b5e]">{stat.subtext}</p>
                )}
              </div>
            ))}
          </div>

          {/* Commission Rules */}
          <div className="rounded-lg border border-[#26262a] bg-[#161618] p-5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#f5f5f5]">Your Commission Rules</h3>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3.5 w-3.5 text-[#5b5b5e]" />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1c] border-[#26262a] text-[#f5f5f5]">
                  <p>Commission based on delivery rate</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {commissionRules.map((rule) => (
                <div key={rule.tier} className="flex items-center gap-1.5 text-sm">
                  {rule.emoji && <span>{rule.emoji}</span>}
                  <span className="text-[#8b8b8e]">{rule.tier}</span>
                  <span className="text-[#5b5b5e]">→</span>
                  <span className="text-[#f5f5f5]">{rule.reward}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 text-xs text-[#5b5b5e]">
              <span>⚡ Upsell ₦600 (only if delivery rate ≥50%)</span>
              <span>• Repeat ₦300</span>
              <span>• Referral ₦300</span>
            </div>
          </div>

          {/* Monthly Excellence Pool */}
          <div className="rounded-lg border border-[#26262a] bg-[#161618] p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-[#5e6ad2]">
                  <Trophy className="h-4 w-4" />
                  Monthly Excellence Pool
                </h3>
                <p className="mt-1 text-xs text-[#5b5b5e]">
                  Hit 90%+ delivery rate all month to qualify. Manager splits pool with salary.
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#f5a623]">80%</p>
                <span className="inline-flex items-center rounded-full bg-[#f5a623]/10 px-2 py-0.5 text-[10px] font-medium text-[#f5a623]">
                  Need 90%+
                </span>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#26262a]">
                <div 
                  className="h-full bg-gradient-to-r from-[#10b981] to-[#f5a623] transition-all" 
                  style={{ width: "80%" }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-[#5b5b5e]">
                <span>0%</span>
                <span className="text-[#10b981]">90% Target</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </AppShell>
  )
}

function Trophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
