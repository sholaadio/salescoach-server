"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Delete } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<"id" | "pin">("id")
  const [employeeId, setEmployeeId] = React.useState("")
  const [pin, setPin] = React.useState("")

  const handleIdSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (employeeId.trim()) {
      setStep("pin")
    }
  }

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      if (newPin.length === 4) {
        // Auto-submit on 4 digits
        setTimeout(() => {
          router.push("/dashboard")
        }, 300)
      }
    }
  }

  const handleDeleteDigit = () => {
    setPin(pin.slice(0, -1))
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0b] px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-2xl font-bold text-white shadow-lg shadow-orange-500/20">
          S
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#f5f5f5]">
          Shoppyrex
        </h1>
        <h2 className="text-2xl font-bold tracking-tight text-[#f5f5f5]">
          SalesCoach
        </h2>
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[#5e6ad2]">
          Powered by Shoppyrex
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-xl border border-[#26262a] bg-[#161618] p-6 shadow-xl">
        {step === "id" ? (
          <form onSubmit={handleIdSubmit}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-[#f5f5f5]">Welcome</h3>
              <p className="mt-1 text-sm text-[#5b5b5e]">
                Enter your Employee ID to sign in
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="e.g. SC001"
                className="h-12 border-[#26262a] bg-[#1f1f22] text-center text-lg text-[#f5f5f5] placeholder:text-[#5b5b5e] focus-visible:ring-[#5e6ad2]"
                autoFocus
              />
              <Button
                type="submit"
                className="h-12 w-full bg-[#5e6ad2] text-white hover:bg-[#6b77db]"
                disabled={!employeeId.trim()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <button
              onClick={() => {
                setStep("id")
                setPin("")
              }}
              className="mb-4 text-sm text-[#5b5b5e] hover:text-[#f5f5f5]"
            >
              ← Back
            </button>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#5e6ad2] text-lg font-semibold text-white">
                {employeeId.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-[#f5f5f5]">
                Hi, {employeeId}
              </h3>
              <p className="mt-1 text-xs text-[#5b5b5e]">
                {employeeId.toUpperCase()} · Sales Closer
              </p>
              <p className="text-sm text-[#5b5b5e]">Enter your 4-digit PIN</p>
            </div>

            {/* PIN dots */}
            <div className="mt-6 flex justify-center gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    i < pin.length ? "bg-[#5e6ad2]" : "bg-[#26262a]"
                  }`}
                />
              ))}
            </div>

            {/* Number pad */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", null, "0", "delete"].map(
                (key, i) => {
                  if (key === null) {
                    return <div key={i} />
                  }
                  if (key === "delete") {
                    return (
                      <button
                        key={i}
                        onClick={handleDeleteDigit}
                        className="flex h-14 items-center justify-center rounded-lg bg-[#e5484d]/10 text-[#e5484d] transition-colors hover:bg-[#e5484d]/20"
                      >
                        <Delete className="h-5 w-5" />
                      </button>
                    )
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handlePinDigit(key)}
                      className="flex h-14 items-center justify-center rounded-lg bg-[#1f1f22] text-xl font-medium text-[#f5f5f5] transition-colors hover:bg-[#26262a]"
                    >
                      {key}
                    </button>
                  )
                }
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-[#5b5b5e]">
        Shoppyrex SalesCoach · Private & Secure
      </p>
    </div>
  )
}
