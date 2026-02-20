"use client"

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface TokenResponse {
  success: boolean
  message: string
  code: string
  token_info?: {
    id: number
    name: string
    user_id: string
    user_email: string
    user_name: string
    last_used_at: string
  }
  timestamp?: string
}

interface TokenError {
  error: string
  code: string
  message: string
}

export default function TestTokenPage() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<TokenResponse | TokenError | null>(null)
  const [error, setError] = useState<string | null>(null)

  const testToken = async () => {
    if (!token.trim()) {
      setError('Please enter an API token')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError('Failed to verify token. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin" />
    if (!response) return null
    
    if ('success' in response && response.success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = () => {
    if (!response) return null
    
    if ('success' in response && response.success) {
      return <Badge variant="default" className="bg-green-500">Valid Token</Badge>
    }
    
    return <Badge variant="destructive">Invalid Token</Badge>
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/api-docs" className="text-muted-foreground hover:text-foreground">
            ← Back to API Docs
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Test Your API Token</h1>
        <p className="text-muted-foreground mt-2">
          Verify if your API token is valid and see detailed information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Token Verification</CardTitle>
            <CardDescription>
              Enter your API token to verify its validity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-sm font-medium">
                API Token
              </label>
              <Input
                id="token"
                type="password"
                placeholder="ptr_your_api_token_here"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your token should start with "ptr_" followed by a long string of characters
              </p>
            </div>

            <Button 
              onClick={testToken} 
              disabled={loading || !token.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Token'
              )}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Results
              {getStatusIcon()}
            </CardTitle>
            <CardDescription>
              Token verification results and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!response ? (
              <div className="text-center py-8 text-muted-foreground">
                Enter a token and click verify to see results
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge()}
                </div>

                {('success' in response && response.success) ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">{response.message}</p>
                    </div>
                    
                    {response.token_info && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Token Information:</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-mono">{response.token_info.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">User:</span>
                            <span className="font-mono">{response.token_info.user_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="font-mono">{response.token_info.user_email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Used:</span>
                            <span className="font-mono">
                              {response.token_info.last_used_at ? 
                                new Date(response.token_info.last_used_at).toLocaleString() : 
                                'Never'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="space-y-2">
                      <p className="text-sm text-red-700 font-medium">{"error" in response ? response.error : "Unknown error"}</p>
                      <p className="text-xs text-red-600">{response.message}</p>
                      <Badge variant="outline" className="text-xs">
                        Error Code: {response.code}
                      </Badge>
                    </div>
                  </div>
                )}

                {"timestamp" in response && response.timestamp && (
                  <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                    Verified at: {new Date(response.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Learn more about API tokens and authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Getting Your API Token</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Log in to your Outsoor dashboard</li>
                <li>Navigate to the API section</li>
                <li>Create a new API token</li>
                <li>Copy the generated token</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Token Format</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Starts with "ptr_"</li>
                <li>• Followed by 64 hexadecimal characters</li>
                <li>• Example: ptr_a1b2c3d4...</li>
                <li>• Keep tokens secure and private</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
