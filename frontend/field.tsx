"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Mic,
  FileText,
  PhoneMissed,
  History,
  CalendarDays,
  Trophy,
  Sparkles,
  LogOut,
  Lock,
  ChevronDown,
  Users,
  Building2,
  BarChart3,
  DollarSign,
  ClipboardList,
  Settings,
  UserCog,
  Target,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type UserRole = "ceo" | "gm" | "head_sales" | "head_creative" | "hr" | "teamlead" | "closer"

const ROLE_LABELS: Record<UserRole, string> = {
  ceo: "CEO",
  gm: "General Manager",
  head_sales: "Head of Sales",
  head_creative: "Head of Creative",
  hr: "HR Manager",
  teamlead: "Team Lead",
  closer: "Sales Closer"
}

const closerNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Call", href: "/upload", icon: Mic },
  { name: "Daily Log", href: "/daily-log", icon: FileText },
  { name: "No Answer", href: "/no-answer", icon: PhoneMissed },
  { name: "History", href: "/history", icon: History },
  { name: "Attendance", href: "/attendance", icon: CalendarDays },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "AI Summary", href: "/ai-summary", icon: Sparkles },
]

const teamLeadNavigation = [
  { name: "My Team", href: "/team-lead", icon: Users },
  { name: "AI Analyses", href: "/team-lead/analyses", icon: Sparkles },
  { name: "Approvals", href: "/team-lead/approvals", icon: CheckCircle },
  { name: "Leaderboard", href: "/team-lead/leaderboard", icon: Trophy },
  { name: "My Calls", href: "/team-lead/my-calls", icon: Mic },
  { name: "My Log", href: "/team-lead/my-log", icon: FileText },
  { name: "Attendance", href: "/team-lead/attendance", icon: CalendarDays },
  { name: "AI Summary", href: "/team-lead/summary", icon: Sparkles },
  { name: "Goals", href: "/team-lead/goals", icon: Target },
]

const managementNavigation = [
  { name: "Overview", href: "/management", icon: LayoutDashboard },
  { name: "Teams", href: "/management/teams", icon: Building2 },
  { name: "AI Analyses", href: "/management/analyses", icon: Sparkles },
  { name: "Leaderboard", href: "/management/leaderboard", icon: Trophy },
  { name: "Commission", href: "/management/commission", icon: DollarSign },
  { name: "Reports", href: "/management/reports", icon: BarChart3 },
  { name: "Accounts", href: "/management/accounts", icon: UserCog },
  { name: "Attendance", href: "/management/attendance", icon: CalendarDays },
  { name: "AI Summary", href: "/management/summary", icon: Sparkles },
  { name: "Goals", href: "/management/goals", icon: Target },
  { name: "Settings", href: "/management/settings", icon: Settings },
]

function getNavigation(role: UserRole) {
  if (["ceo", "gm", "head_sales", "head_creative", "hr"].includes(role)) {
    return managementNavigation
  }
  if (role === "teamlead") {
    return teamLeadNavigation
  }
  return closerNavigation
}

function getRoleAccentColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    ceo: "#f5a623",
    gm: "#a78bfa",
    head_sales: "#5e6ad2",
    head_creative: "#26b5ce",
    hr: "#ec4899",
    teamlead: "#5e6ad2",
    closer: "#5e6ad2"
  }
  return colors[role] || "#5e6ad2"
}

interface AppSidebarProps {
  user?: {
    name: string
    role: UserRole
    team?: string
    employeeId?: string
  }
}

export function AppSidebar({ 
  user = { 
    name: "Chukwuemeka Obi", 
    role: "closer", 
    team: "Team Abigail",
    employeeId: "SC001"
  } 
}: AppSidebarProps) {
  const pathname = usePathname()
  const navigation = getNavigation(user.role)
  const accentColor = getRoleAccentColor(user.role)
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2)
  const roleLabel = ROLE_LABELS[user.role]

  const isManagement = ["ceo", "gm", "head_sales", "head_creative", "hr"].includes(user.role)
  const isTeamLead = user.role === "teamlead"

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-[#1f1f22] bg-[#0f0f10]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-[#1f1f22] px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold text-white">
          S
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[#f5f5f5]">SalesCoach</span>
          <span className="text-[10px]" style={{ color: accentColor }}>
            {isManagement ? roleLabel : (user.team || roleLabel)}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#5e6ad2]/15 text-[#5e6ad2]"
                  : "text-[#8b8b8e] hover:bg-[#1f1f22] hover:text-[#f5f5f5]"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4",
                isActive ? "text-[#5e6ad2]" : "text-[#5b5b5e] group-hover:text-[#8b8b8e]"
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[#1f1f22] p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-[#1f1f22]">
              <Avatar className="h-7 w-7 border border-[#26262a]">
                <AvatarFallback 
                  className="text-[10px] font-medium text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-[#f5f5f5]">{user.name}</span>
                <span className="truncate text-[11px] text-[#5b5b5e]">{roleLabel}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#5b5b5e]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1c] border-[#26262a]">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-[#f5f5f5]">{user.name}</p>
              <p className="text-xs text-[#5b5b5e]">{user.employeeId} - {roleLabel}</p>
            </div>
            <DropdownMenuSeparator className="bg-[#26262a]" />
            <DropdownMenuItem className="text-[#8b8b8e] focus:bg-[#26262a] focus:text-[#f5f5f5]">
              <Lock className="mr-2 h-4 w-4" />
              Change PIN
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#26262a]" />
            <DropdownMenuItem asChild>
              <Link href="/login" className="text-[#e5484d] focus:bg-[#26262a] focus:text-[#e5484d]">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
