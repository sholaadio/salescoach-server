"use client"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { UserCog, Plus, Trash2, Edit2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ROLE_LABELS: Record<string, string> = {
  ceo: "CEO",
  gm: "General Manager",
  head_sales: "Head of Sales",
  head_creative: "Head of Creative",
  hr: "HR Manager",
  teamlead: "Team Lead",
  closer: "Sales Closer"
}

const mockUsers = [
  { id: "ceo001", name: "Mr Shola Adio", employeeId: "MGT001", role: "ceo", teamId: null, pin: "0001" },
  { id: "gm001", name: "Mr Samuel Amuda", employeeId: "MGT002", role: "gm", teamId: null, pin: "0002" },
  { id: "hos001", name: "Lady Victory Friday", employeeId: "MGT003", role: "head_sales", teamId: null, pin: "0003" },
  { id: "hr001", name: "Lady Victoria", employeeId: "MGT005", role: "hr", teamId: null, pin: "0005" },
  { id: "tl001", name: "Lady Abigail", employeeId: "TL001", role: "teamlead", teamId: "team1", pin: "1001" },
  { id: "tl002", name: "Lady Mary", employeeId: "TL002", role: "teamlead", teamId: "team2", pin: "1002" },
  { id: "c001", name: "Chukwuemeka Obi", employeeId: "SC001", role: "closer", teamId: "team1", pin: "2001" },
  { id: "c002", name: "Fatima Aliyu", employeeId: "SC002", role: "closer", teamId: "team1", pin: "2002" },
  { id: "c003", name: "Segun Adeyemi", employeeId: "SC003", role: "closer", teamId: "team2", pin: "2003" },
]

const mockTeams = [
  { id: "team1", name: "Team Abigail" },
  { id: "team2", name: "Team Mary" },
  { id: "team3", name: "Team Deborah" },
  { id: "team4", name: "Follow-Up Team" },
  { id: "team5", name: "Social Media Team" },
]

const user = {
  name: "Mr Shola Adio",
  role: "ceo" as const,
  employeeId: "MGT001"
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    ceo: "#f5a623",
    gm: "#a78bfa",
    head_sales: "#5e6ad2",
    head_creative: "#26b5ce",
    hr: "#ec4899",
    teamlead: "#f5a623",
    closer: "#5e6ad2"
  }
  return colors[role] || "#5e6ad2"
}

export default function ManagementAccountsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newPin, setNewPin] = useState("")
  const [newRole, setNewRole] = useState("closer")
  const [newTeam, setNewTeam] = useState("team1")

  return (
    <AppShell 
      title="Manage Accounts"
      description={`${mockUsers.length} total accounts`}
      icon={<UserCog className="h-4 w-4" />}
      user={user}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#5e6ad2]/30 bg-transparent text-[#5e6ad2] hover:bg-[#5e6ad2]/10"
          >
            Bulk Add
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#5e6ad2] text-white hover:bg-[#6b77db]"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add One
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Add Form */}
        {showAddForm && (
          <div className="rounded-lg border border-[#10b981]/30 bg-[#10b981]/5 p-4">
            <h3 className="mb-4 text-sm font-semibold text-[#10b981]">New Account</h3>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  Full Name
                </label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full name"
                  className="border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  4-Digit PIN
                </label>
                <Input
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="e.g. 2009"
                  maxLength={4}
                  className="border-[#26262a] bg-[#1f1f22] text-[#f5f5f5] placeholder:text-[#5b5b5e]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  Role
                </label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="border-[#26262a] bg-[#1f1f22] text-[#f5f5f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                    <SelectItem value="closer">Sales Closer</SelectItem>
                    <SelectItem value="teamlead">Team Lead</SelectItem>
                    <SelectItem value="head_sales">Head of Sales</SelectItem>
                    <SelectItem value="hr">HR Manager</SelectItem>
                    <SelectItem value="gm">General Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-[#5b5b5e]">
                  Team
                </label>
                <Select value={newTeam} onValueChange={setNewTeam} disabled={!["closer", "teamlead"].includes(newRole)}>
                  <SelectTrigger className="border-[#26262a] bg-[#1f1f22] text-[#f5f5f5]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#26262a] bg-[#1a1a1c]">
                    {mockTeams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-[#10b981] text-white hover:bg-[#0d9668]">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-hidden rounded-lg border border-[#26262a] bg-[#161618]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#26262a]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Employee ID</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Role</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Team</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">PIN</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#5b5b5e]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u) => {
                const color = getRoleColor(u.role)
                const team = mockTeams.find(t => t.id === u.teamId)
                return (
                  <tr 
                    key={u.id}
                    className="border-b border-[#1f1f22] last:border-0 hover:bg-[#1a1a1c]"
                  >
                    <td className="px-4 py-3">
                      <span 
                        className="rounded px-2 py-1 font-mono text-xs font-medium"
                        style={{ 
                          backgroundColor: `${color}15`,
                          color: color
                        }}
                      >
                        {u.employeeId}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold"
                          style={{ 
                            backgroundColor: `${color}15`,
                            color: color
                          }}
                        >
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-sm font-medium text-[#f5f5f5]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="rounded px-2 py-0.5 text-[10px] font-medium"
                        style={{ 
                          backgroundColor: `${color}15`,
                          color: color
                        }}
                      >
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8b8b8e]">
                      {team?.name || "-"}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm tracking-wider text-[#5b5b5e]">
                      {u.pin}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="rounded-md border border-[#26262a] bg-[#1f1f22] p-1.5 text-[#8b8b8e] transition-colors hover:bg-[#26262a] hover:text-[#f5f5f5]">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        {u.role !== "ceo" && (
                          <button className="rounded-md border border-[#e5484d]/30 bg-transparent p-1.5 text-[#e5484d] transition-colors hover:bg-[#e5484d]/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}
