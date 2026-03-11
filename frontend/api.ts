const SERVER = process.env.NEXT_PUBLIC_API_URL ?? "https://salescoach-server.onrender.com"
const TIMEOUT_MS = 12000

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "ceo" | "gm" | "head_sales" | "head_creative" | "hr" | "teamlead" | "closer"

export interface User {
  id: string
  employeeId: string
  name: string
  pin: string
  role: UserRole
  teamId: string | null
  permissions?: Record<string, boolean>
}

export interface Team {
  id: string
  name: string
  type: "sales" | "followup" | "socialmedia"
  leadId?: string
}

export interface CallReport {
  id: string
  closerId: string
  closerName: string
  teamId: string
  teamType: string
  callType: "phone" | "whatsapp"
  callOutcome: "confirmed" | "cancelled" | "followup" | "callback" | "switchedoff" | "unknown"
  product: string
  transcript: string
  analysis: {
    overallScore: number
    verdict: string
    callDuration?: string
    closingRate?: string
    metrics: { label: string; score: number }[]
    strengths: string[]
    improvements: string[]
    keyMoments?: string[]
    resources?: { type: string; title: string; url: string }[]
  }
  status: "pending" | "approved"
  createdAt: string
}

export interface DailyLog {
  id: string
  closerId: string
  teamId: string
  date: string
  status: "pending" | "approved" | "rejected"
  // Sales team fields
  assigned?: number
  delivered?: number
  upsells?: number
  repeats?: number
  referrals?: number
  // Follow-up team fields
  callsMade?: number
  callsThrough?: number
  // Social media fields
  leadsContacted?: number
  leadsConfirmed?: number
  notes?: string
}

export interface NoAnswer {
  id: string
  closerId: string
  teamId: string
  date: string
  count: number
  names?: string
}

export interface Goal {
  id: string
  teamId?: string
  closerId?: string
  type: "team" | "individual"
  metric: string
  target: number
  period: string
  createdAt: string
}

export interface SummaryAnalysis {
  overallScore: number
  grade: string
  headline: string
  totalCalls: number
  avgScore: number
  topStrengths: string[]
  criticalWeaknesses: string[]
  actionPlan: string[]
  tomorrowFocus: string
  motivationalNote: string
}

// ─── Core fetch ───────────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string, opts: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...opts, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetchWithTimeout(`${SERVER}/${path}`)
  if (!res.ok) throw new Error(`GET /${path} failed: ${res.status}`)
  return res.json()
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${SERVER}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST /${path} failed: ${res.status}`)
  return res.json()
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchWithTimeout(`${SERVER}/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT /${path} failed: ${res.status}`)
  return res.json()
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<Record<string, User>> {
  const arr = await apiGet<User[]>("users")
  if (!Array.isArray(arr)) return (arr as Record<string, User>) ?? {}
  return Object.fromEntries(arr.map((u) => [u.id, u]))
}

export async function saveUsers(users: Record<string, User>): Promise<void> {
  await apiPost("users/bulk", Object.values(users))
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiPut<User>(`users/${id}`, data)
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function getTeams(): Promise<Record<string, Team>> {
  const arr = await apiGet<Team[]>("teams")
  if (!Array.isArray(arr)) return (arr as Record<string, Team>) ?? {}
  return Object.fromEntries(arr.map((t) => [t.id, t]))
}

export async function saveTeams(teams: Record<string, Team>): Promise<void> {
  await apiPost("teams/bulk", Object.values(teams))
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function getReports(): Promise<CallReport[]> {
  const arr = await apiGet<CallReport[]>("reports")
  return Array.isArray(arr) ? arr : []
}

export async function addReport(report: Omit<CallReport, "id">): Promise<CallReport> {
  return apiPost<CallReport>("reports", report)
}

// ─── Logs ─────────────────────────────────────────────────────────────────────

export async function getDailyLogs(): Promise<DailyLog[]> {
  const arr = await apiGet<DailyLog[]>("logs")
  return Array.isArray(arr) ? arr : []
}

export async function saveDailyLog(log: Omit<DailyLog, "id">): Promise<DailyLog> {
  return apiPost<DailyLog>("logs", log)
}

// ─── No Answers ───────────────────────────────────────────────────────────────

export async function getNoAnswers(): Promise<NoAnswer[]> {
  const arr = await apiGet<NoAnswer[]>("noanswers")
  return Array.isArray(arr) ? arr : []
}

export async function addNoAnswer(record: Omit<NoAnswer, "id">): Promise<NoAnswer> {
  return apiPost<NoAnswer>("noanswers", record)
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function getGoals(): Promise<Goal[]> {
  const arr = await apiGet<Goal[]>("goals")
  return Array.isArray(arr) ? arr : []
}

export async function saveGoal(goal: Omit<Goal, "id">): Promise<Goal> {
  return apiPost<Goal>("goals", goal)
}

// ─── AI endpoints ─────────────────────────────────────────────────────────────

export async function transcribeAudio(audioFile: File): Promise<string> {
  const formData = new FormData()
  formData.append("audio", audioFile, audioFile.name)
  const res = await fetchWithTimeout(`${SERVER}/transcribe`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? "Transcription failed")
  }
  const data = await res.json()
  if (!data.transcript) throw new Error("No transcript returned")
  return data.transcript
}

export async function analyzeCall(params: {
  transcript: string
  closerName: string
  callType: string
  callOutcome: string
  product: string
  teamType: string
}): Promise<CallReport["analysis"]> {
  const res = await fetchWithTimeout(`${SERVER}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error ?? "Analysis failed")
  }
  const data = await res.json()
  if (!data.analysis) throw new Error("No analysis returned")
  return data.analysis
}

export async function analyzeSummary(params: {
  userId: string
  reports: CallReport[]
  logs: DailyLog[]
  period: string
  dateFrom?: string
  dateTo?: string
}): Promise<SummaryAnalysis> {
  const res = await fetchWithTimeout(`${SERVER}/analyze-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  if (!res.ok) throw new Error("Summary analysis failed")
  return res.json()
}
