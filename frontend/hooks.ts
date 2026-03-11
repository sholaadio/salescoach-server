"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import * as api from "@/lib/api"

// ─── Generic fetcher hook ─────────────────────────────────────────────────────

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const counter = useRef(0)

  const run = useCallback(async () => {
    const id = ++counter.current
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      if (id === counter.current) setData(result)
    } catch (e) {
      if (id === counter.current)
        setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      if (id === counter.current) setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, isLoading, error, refetch: run }
}

// ─── Resource hooks ───────────────────────────────────────────────────────────

export function useUsers() {
  return useFetch(() => api.getUsers())
}

export function useTeams() {
  return useFetch(() => api.getTeams())
}

export function useReports() {
  return useFetch(() => api.getReports())
}

export function useDailyLogs() {
  return useFetch(() => api.getDailyLogs())
}

export function useNoAnswers() {
  return useFetch(() => api.getNoAnswers())
}

export function useGoals() {
  return useFetch(() => api.getGoals())
}

// ─── Combined app data hook ───────────────────────────────────────────────────
// Loads all resources in parallel — use this at the portal layout level

interface AppData {
  users: Record<string, api.User>
  teams: Record<string, api.Team>
  reports: api.CallReport[]
  logs: api.DailyLog[]
  noAnswers: api.NoAnswer[]
  goals: api.Goal[]
}

interface AppDataState {
  data: AppData | null
  isLoading: boolean
  error: string | null
  refresh: () => void
}

const EMPTY: AppData = { users: {}, teams: {}, reports: [], logs: [], noAnswers: [], goals: [] }

export function useAppData(): AppDataState {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const counter = useRef(0)

  const load = useCallback(async () => {
    const id = ++counter.current
    setIsLoading(true)
    setError(null)
    try {
      const [users, teams, reports, logs, noAnswers, goals] = await Promise.all([
        api.getUsers(),
        api.getTeams(),
        api.getReports(),
        api.getDailyLogs(),
        api.getNoAnswers(),
        api.getGoals(),
      ])
      if (id === counter.current) {
        setData({ users, teams, reports, logs, noAnswers, goals })
      }
    } catch (e) {
      if (id === counter.current) {
        setError(e instanceof Error ? e.message : "Failed to load data")
        setData(EMPTY)
      }
    } finally {
      if (id === counter.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { data, isLoading, error, refresh: load }
}

// ─── Mutation helpers ─────────────────────────────────────────────────────────

interface MutationState<T> {
  isLoading: boolean
  error: string | null
  execute: (arg: T) => Promise<boolean>
}

export function useSaveDailyLog(): MutationState<Omit<api.DailyLog, "id">> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return {
    isLoading,
    error,
    execute: async (log) => {
      setIsLoading(true)
      setError(null)
      try {
        await api.saveDailyLog(log)
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save log")
        return false
      } finally {
        setIsLoading(false)
      }
    },
  }
}

export function useAddReport(): MutationState<Omit<api.CallReport, "id">> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return {
    isLoading,
    error,
    execute: async (report) => {
      setIsLoading(true)
      setError(null)
      try {
        await api.addReport(report)
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save report")
        return false
      } finally {
        setIsLoading(false)
      }
    },
  }
}

export function useSaveGoal(): MutationState<Omit<api.Goal, "id">> {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return {
    isLoading,
    error,
    execute: async (goal) => {
      setIsLoading(true)
      setError(null)
      try {
        await api.saveGoal(goal)
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to save goal")
        return false
      } finally {
        setIsLoading(false)
      }
    },
  }
}
