"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUsers } from "@/lib/api"
import type { UserRole } from "@/lib/api"

const ROLE_PORTALS: Record<UserRole, string> = {
  ceo: "/management",
  gm: "/management",
  head_sales: "/management",
  head_creative: "/management",
  hr: "/management",
  teamlead: "/team-lead",
  closer: "/dashboard",
}

export default function LoginPage() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState("")
  const [pin, setPin] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [phase, setPhase] = useState<"id" | "pin">("id")
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const idRef = useRef<HTMLInputElement>(null)

  useEffect(() => { idRef.current?.focus() }, [])

  function handleIdSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!employeeId.trim()) return
    setError("")
    setPhase("pin")
    setTimeout(() => pinRefs[0].current?.focus(), 50)
  }

  function handlePinChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...pin]
    next[index] = value.slice(-1)
    setPin(next)
    if (value && index < 3) {
      pinRefs[index + 1].current?.focus()
    }
    if (next.every(Boolean) && next.length === 4) {
      handleLogin(next.join(""))
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus()
    }
    if (e.key === "Enter" && pin.every(Boolean)) {
      handleLogin(pin.join(""))
    }
  }

  async function handleLogin(pinValue: string) {
    setIsLoading(true)
    setError("")
    try {
      const users = await getUsers()
      const match = Object.values(users).find(
        (u) =>
          u.employeeId?.toLowerCase() === employeeId.trim().toLowerCase() &&
          u.pin === pinValue
      )
      if (!match) {
        setError("Invalid Employee ID or PIN")
        setPin(["", "", "", ""])
        setIsLoading(false)
        setTimeout(() => pinRefs[0].current?.focus(), 50)
        return
      }
      // Store minimal session in cookie for middleware
      const session = { id: match.id, role: match.role, employeeId: match.employeeId, name: match.name, teamId: match.teamId }
      document.cookie = `sc_session=${JSON.stringify(session)}; path=/; SameSite=Strict`
      // Also store full user in sessionStorage for client access
      sessionStorage.setItem("sc_user", JSON.stringify(session))
      router.replace(ROLE_PORTALS[match.role])
    } catch {
      setError("Could not connect to server. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0b] overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm px-6">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20">
            <span className="text-lg font-black text-white">S</span>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-[#f5f5f5]">
              Shoppyrex SalesCoach
            </h1>
            <p className="mt-1 text-sm text-[#5b5b5e]">Sign in to continue</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#1f1f22] bg-[#0f0f10] p-6 shadow-xl">
          {phase === "id" ? (
            <form onSubmit={handleIdSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#8b8b8e]">
                  Employee ID
                </label>
                <input
                  ref={idRef}
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                  placeholder="e.g. SC001 or MGT001"
                  className="w-full rounded-lg border border-[#26262a] bg-[#1a1a1c] px-4 py-3 text-sm font-mono text-[#f5f5f5] placeholder-[#3a3a3e] outline-none transition-colors focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={!employeeId.trim()}
                className="w-full rounded-lg bg-[#5e6ad2] py-3 text-sm font-semibold text-white transition-all hover:bg-[#6872db] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div>
                <button
                  onClick={() => { setPhase("id"); setPin(["","","",""]); setError("") }}
                  className="mb-3 flex items-center gap-1.5 text-xs text-[#5b5b5e] hover:text-[#8b8b8e] transition-colors"
                >
                  ← Back
                </button>
                <p className="text-sm font-medium text-[#f5f5f5]">
                  Enter PIN for{" "}
                  <span className="font-mono text-[#5e6ad2]">{employeeId}</span>
                </p>
                <p className="mt-0.5 text-xs text-[#5b5b5e]">Your 4-digit PIN</p>
              </div>

              {/* PIN boxes */}
              <div className="flex justify-center gap-3">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={pinRefs[i]}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    className="h-14 w-14 rounded-xl border border-[#26262a] bg-[#1a1a1c] text-center text-2xl font-bold text-[#f5f5f5] outline-none transition-all focus:border-[#5e6ad2] focus:ring-1 focus:ring-[#5e6ad2]/30"
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-xs text-red-400">{error}</p>
              )}

              {isLoading && (
                <div className="flex justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#5e6ad2] border-t-transparent" />
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#3a3a3e]">
          Shoppyrex Internal Platform · v2
        </p>
      </div>
    </div>
  )
}
