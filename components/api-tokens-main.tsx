"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserTokens, getUserIntegrations } from "@/app/actions/api-tokens"
import { generateUserId } from "@/lib/api-utils"
import { ApiTokensList } from "@/components/api-tokens-list"
import { CreateTokenDialog } from "@/components/create-token-dialog"
import { UserIdSection } from "@/components/user-id-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface ApiTokensMainProps {
  user: DashboardUser
}

export function ApiTokensMain({ user }: ApiTokensMainProps) {
  const [tokens, setTokens] = useState<any[]>([])
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokensData, integrationsData] = await Promise.all([
          getUserTokens(),
          getUserIntegrations()
        ])
        setTokens(tokensData)
        setIntegrations(integrationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const userId = generateUserId(user.email, user.id)

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C5CF7] mx-auto mb-4"></div>
          <p className="text-[#A0A0A8]">Loading API tokens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8C5CF7] via-[#C85CFA] to-[#5567F7] bg-clip-text text-transparent">
              API Tokens & Integrations
            </h1>
            <p className="text-[#A0A0A8] mt-2">
              Manage your API access tokens and third-party integrations.{" "}
              <span className="text-[#EF4444] font-medium">Keep your tokens secure!</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/models">
              <Button variant="outline" size="sm" className="border-[#202126] text-[#A0A0A8] hover:bg-[#202126] hover:text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentation
              </Button>
            </Link>
            <CreateTokenDialog />
          </div>
        </div>

        {/* User ID Section */}
        <UserIdSection userId={userId} />

        {/* Personal API Tokens */}
        <Card className="bg-[#1A1B1F] border-[#202126] shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#8C5CF7] rounded-full"></div>
                  Personal API Tokens
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[#A0A0A8] hover:text-white hover:bg-[#202126] p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {tokens.length > 0 ? (
              <>
                <p className="text-[#A0A0A8] text-sm mb-4">Default API token created on sign up.</p>
                <ApiTokensList tokens={tokens} />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#A0A0A8] mb-4">No API tokens created yet.</p>
                <CreateTokenDialog />
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Usage Documentation */}
        <Card className="bg-[#1A1B1F] border-[#202126] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-[#8C5CF7] rounded-full"></div>
              Token Deduction API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-[#A0A0A8] text-sm">
                You can use your API token to programmatically deduct credits from your account. 
                Each successful request will deduct <span className="text-white font-medium">$1.00 USD</span> from your balance.
              </p>
              
              <div className="bg-[#121214] border border-[#202126] rounded-md p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#5567F7]">cURL Example</span>
                  <span className="text-xs text-[#A0A0A8]">POST /api/deduct-credits</span>
                </div>
                <code className="text-sm font-mono text-gray-300 block whitespace-pre">
                  curl -X POST {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/deduct-credits \<br/>
                  &nbsp;&nbsp;-H "Authorization: Bearer ptr_YOUR_API_TOKEN"
                </code>
              </div>

              <div className="flex gap-4 text-xs text-[#A0A0A8]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Success: 200 OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>Insufficient Funds: 402</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>Invalid Token: 401</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Section */}
        <Card className="bg-[#1A1B1F] border-[#202126] shadow-lg">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-[#5567F7] rounded-full"></div>
              Applications with Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-[#A0A0A8]">No connected 3rd party apps.</p>
            </div>
          </CardContent>
        </Card>

        {/* Connected Third-party Accounts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#C85CFA] rounded-full"></div>
            Connected Third-party Accounts
          </h2>

          <Card className="bg-[#1A1B1F] border-[#202126] mb-6 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#C85CFA] rounded-full"></div>
                    Account-level Integrations
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#A0A0A8] hover:text-white hover:bg-[#202126] p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <IntegrationsSection integrations={integrations} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
