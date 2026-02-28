"use client"

import { useAccount } from "@/contexts/accountContext"
import { useEffect, useState } from "react"

export interface AccountInfo {
  type: "personal" | "team"
  id: string
  name: string
  email?: string
  description?: string
  tier?: string
  ownerId?: string
  userRole?: string
  createdAt?: string
}

export function useAccountInfo() {
  const { accountType, teamId } = useAccount()
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        const url =
          accountType === "team" && teamId
            ? `/api/team/info?teamId=${teamId}`
            : `/api/team/info`

        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          setAccountInfo(data.account)
        } else {
          setError(data.error || "Failed to fetch account info")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchAccountInfo()
  }, [accountType, teamId])

  return {
    accountInfo,
    loading,
    error,
    isPersonal: accountType === "personal",
    isTeam: accountType === "team" && teamId !== null,
  }
}

/**
 * Get team-specific API keys
 */
export function useTeamApiKeys(teamId: string | null) {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canManage, setCanManage] = useState(false)

  const fetchTokens = async () => {
    if (!teamId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/team/${teamId}/api-keys`)
      const data = await response.json()

      if (data.success) {
        setTokens(data.tokens || [])
        setCanManage(data.canManage)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [teamId])

  return {
    tokens,
    loading,
    error,
    canManage,
    refresh: fetchTokens,
  }
}

/**
 * Get team members and settings
 */
export function useTeamSettings(teamId: string | null) {
  const [team, setTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canManage, setCanManage] = useState(false)

  const fetchSettings = async () => {
    if (!teamId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/team/${teamId}/settings`)
      const data = await response.json()

      if (data.success) {
        setTeam(data.team)
        setMembers(data.members)
        setCanManage(data.canManage)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const updateTeam = async (updates: { name?: string; description?: string }) => {
    if (!teamId || !canManage) return false

    try {
      const response = await fetch(`/api/team/${teamId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      const data = await response.json()
      if (data.success) {
        setTeam(data.team)
        return true
      } else {
        setError(data.error)
        return false
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      return false
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [teamId])

  return {
    team,
    members,
    loading,
    error,
    canManage,
    refresh: fetchSettings,
    updateTeam,
  }
}
