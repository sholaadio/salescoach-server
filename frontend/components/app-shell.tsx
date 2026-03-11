"use client"

import * as React from "react"
import { AppSidebar, type UserRole } from "@/components/app-sidebar"

interface AppShellProps {
  children: React.ReactNode
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
  user?: {
    name: string
    role: UserRole
    team?: string
    employeeId?: string
  }
}

export function AppShell({ 
  children, 
  title, 
  description, 
  icon, 
  actions,
  user = {
    name: "Chukwuemeka Obi",
    role: "closer",
    team: "Team Abigail",
    employeeId: "SC001"
  }
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      <AppSidebar user={user} />
      <main className="ml-[220px] flex-1">
        {(title || actions) && (
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#1f1f22] bg-[#0a0a0b]/80 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {icon && <span className="text-[#5e6ad2]">{icon}</span>}
              <div>
                {title && <h1 className="text-sm font-semibold text-[#f5f5f5]">{title}</h1>}
                {description && <p className="text-xs text-[#5b5b5e]">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </header>
        )}
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
