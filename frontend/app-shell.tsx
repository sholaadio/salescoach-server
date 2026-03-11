"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar, type UserRole } from "@/components/app-sidebar"

export interface SessionUser {
  id: string
  employeeId: string
  name: string
  role: UserRole
  teamId: string | null
}

interface AppShellProps {
  children: React.ReactNode
  title?: string
  description?: string
  icon?: React.ReactNode
  actions?: React.ReactNode
}

function getSessionUser(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem("sc_user")
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function AppShell({
  children,
  title,
  description,
  icon,
  actions,
}: AppShellProps) {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const u = getSessionUser()
    if (!u) {
      router.replace("/login")
    } else {
      setUser(u)
    }
    setChecked(true)
  }, [router])

  if (!checked) return null

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#5e6ad2] border-t-transparent" />
      </div>
    )
  }

  // Map teamId to team name (sidebar just needs the string)
  const sidebarUser = {
    name: user.name,
    role: user.role,
    employeeId: user.employeeId,
    team: user.teamId ?? undefined,
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      <AppSidebar user={sidebarUser} />
      <main className="ml-[220px] flex-1">
        {(title || actions) && (
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#1f1f22] bg-[#0a0a0b]/80 px-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {icon && <span className="text-[#5e6ad2]">{icon}</span>}
              <div>
                {title && (
                  <h1 className="text-sm font-semibold text-[#f5f5f5]">{title}</h1>
                )}
                {description && (
                  <p className="text-xs text-[#5b5b5e]">{description}</p>
                )}
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

// ─── Hook for pages to access the current user ────────────────────────────────

export function useSessionUser(): SessionUser | null {
  const [user, setUser] = useState<SessionUser | null>(null)
  useEffect(() => { setUser(getSessionUser()) }, [])
  return user
}
