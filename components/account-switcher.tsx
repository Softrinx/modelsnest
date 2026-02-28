"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAccount } from "@/contexts/accountContext"
import { ChevronDown, Building2, User } from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface Team {
  id: string
  name: string
  slug: string
  tier: string
  owner_id: string
}

interface AccountSwitcherProps {
  user: DashboardUser
}

export function AccountSwitcher({ user }: AccountSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const { accountType, teamId, teamName, setAccount } = useAccount()

  useEffect(() => {
    loadTeams()
  }, [user.id])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Get user's team memberships
      const { data: memberships, error: membershipError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .eq("status", "active")

      if (membershipError || !memberships) {
        setTeams([])
        return
      }

      const teamIds = Array.from(new Set(memberships.map((m) => m.team_id)))
      if (teamIds.length === 0) {
        setTeams([])
        return
      }

      // Get team details
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id, name, tier, owner_id")
        .in("id", teamIds)

      if (!teamError && teamData) {
        console.log("Loaded teams with owner_id:", teamData)
        setTeams(teamData as Team[])
      }
    } catch (error) {
      console.error("Failed to load teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPersonal = () => {
    setAccount("personal")
    setIsOpen(false)
  }

  const handleSelectTeam = (team: Team) => {
    console.log("Selecting team:", team.name, "owner_id:", team.owner_id)
    setAccount("team", team.id, team.name, team.owner_id)
    setIsOpen(false)
  }

  const displayText =
    accountType === "personal"
      ? user.name || user.email
      : teamName || "Team"

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors"
        style={{
          background: isOpen ? "rgba(255,255,255,0.08)" : "transparent",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {accountType === "personal" ? (
            <User size={16} />
          ) : (
            <Building2 size={16} />
          )}
          <span className="text-sm font-medium truncate max-w-[200px]">
            {displayText}
          </span>
        </div>
        <ChevronDown
          size={16}
          className="flex-shrink-0"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50"
          style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div className="p-2">
            {/* Personal Account */}
            <button
              onClick={handleSelectPersonal}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
              style={{
                background:
                  accountType === "personal"
                    ? "rgba(99, 102, 241, 0.2)"
                    : "transparent",
                color:
                  accountType === "personal" ? "var(--color-primary)" : "inherit",
              }}
            >
              <User size={16} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user.name || user.email}
                </div>
                <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Personal Account
                </div>
              </div>
              {accountType === "personal" && (
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: "var(--color-primary)" }}
                />
              )}
            </button>

            {/* Team Accounts */}
            {!loading && teams.length > 0 && (
              <>
                <div
                  className="px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Teams
                </div>
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleSelectTeam(team)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left"
                    style={{
                      background:
                        accountType === "team" && teamId === team.id
                          ? "rgba(99, 102, 241, 0.2)"
                          : "transparent",
                      color:
                        accountType === "team" && teamId === team.id
                          ? "var(--color-primary)"
                          : "inherit",
                    }}
                  >
                    <Building2 size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{team.name}</div>
                      <div
                        className="text-xs capitalize"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {team.tier === "free" ? "Free" : team.tier === "pro" ? "Pro" : "Enterprise"}
                      </div>
                    </div>
                    {accountType === "team" && teamId === team.id && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "var(--color-primary)" }}
                      />
                    )}
                  </button>
                ))}
              </>
            )}

            {loading && (
              <div
                className="px-3 py-2 text-center text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Loading teams...
              </div>
            )}

            {!loading && teams.length === 0 && (
              <div
                className="px-3 py-2 text-center text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                No teams yet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside handler */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
