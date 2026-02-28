"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export type AccountType = "personal" | "team"

export interface AccountContextType {
  accountType: AccountType
  teamId: string | null
  teamName: string | null
  teamOwnerId: string | null // ID of team owner for fetching their credits
  setAccount: (type: AccountType, teamId?: string, teamName?: string, teamOwnerId?: string) => void
  isPersonal: boolean
  isTeam: boolean
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accountType, setAccountType] = useState<AccountType>("personal")
  const [teamId, setTeamId] = useState<string | null>(null)
  const [teamName, setTeamName] = useState<string | null>(null)
  const [teamOwnerId, setTeamOwnerId] = useState<string | null>(null)

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("activeAccount")
    if (saved) {
      try {
        const { type, teamId, teamName, teamOwnerId } = JSON.parse(saved)
        setAccountType(type)
        setTeamId(teamId || null)
        setTeamName(teamName || null)
        setTeamOwnerId(teamOwnerId || null)
      } catch {
        // Invalid saved state, use defaults
      }
    }
  }, [])

  const setAccount = (type: AccountType, newTeamId?: string, newTeamName?: string, newTeamOwnerId?: string) => {
    setAccountType(type)
    setTeamId(newTeamId || null)
    setTeamName(newTeamName || null)
    setTeamOwnerId(newTeamOwnerId || null)

    // Save to localStorage
    localStorage.setItem(
      "activeAccount",
      JSON.stringify({
        type,
        teamId: newTeamId || null,
        teamName: newTeamName || null,
        teamOwnerId: newTeamOwnerId || null,
      })
    )
  }

  const value: AccountContextType = {
    accountType,
    teamId,
    teamName,
    teamOwnerId,
    setAccount,
    isPersonal: accountType === "personal",
    isTeam: accountType === "team",
  }

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
