"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getUsers, updateUser, type User, type UserRole } from "@/lib/api"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  employeeId: string
  name: string
  role: UserRole
  teamId: string | null
  permissions?: Record<string, boolean>
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  login: (employeeId: string, pin: string) => Promise<void>
  logout: () => void
  updatePin: (newPin: string) => Promise<void>
  clearError: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

const SESSION_KEY = "sc_user"

function getPortalPath(role: UserRole): string {
  if (["ceo", "gm", "head_sales", "head_creative", "hr"].includes(role)) {
    return "/management"
  }
  if (role === "teamlead") return "/team-lead"
  return "/dashboard"
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser
        setUser(parsed)
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (employeeId: string, pin: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const users = await getUsers()
      const match = Object.values(users).find(
        (u: User) =>
          u.employeeId?.toLowerCase() === employeeId.trim().toLowerCase() &&
          u.pin === pin.trim()
      )
      if (!match) {
        setError("Invalid Employee ID or PIN. Please try again.")
        return
      }
      const authUser: AuthUser = {
        id: match.id,
        employeeId: match.employeeId,
        name: match.name,
        role: match.role,
        teamId: match.teamId,
        permissions: match.permissions,
      }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser))
      setUser(authUser)
      router.replace(getPortalPath(match.role))
    } catch (e) {
      setError("Could not connect to server. Please try again.")
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
    router.replace("/login")
  }, [router])

  const updatePin = useCallback(async (newPin: string) => {
    if (!user) throw new Error("Not logged in")
    await updateUser(user.id, { pin: newPin })
    // Session doesn't store PIN so no update needed there
  }, [user])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, updatePin, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

export function isManagement(role: UserRole): boolean {
  return ["ceo", "gm", "head_sales", "head_creative", "hr"].includes(role)
}

export function isTeamLead(role: UserRole): boolean {
  return role === "teamlead"
}

export function isCloser(role: UserRole): boolean {
  return role === "closer"
}

export function canApprove(role: UserRole): boolean {
  return isManagement(role) || isTeamLead(role)
}

export function canViewAllTeams(role: UserRole): boolean {
  return isManagement(role)
}

export function canManageStaff(role: UserRole): boolean {
  return ["ceo", "gm", "hr"].includes(role)
}

export function canViewCommission(role: UserRole): boolean {
  return ["ceo", "gm", "head_sales"].includes(role)
}
