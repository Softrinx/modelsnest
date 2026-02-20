import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { CodeBlock } from '@/components/ui/code-block'
import Link from 'next/link'

// Force dynamic rendering to prevent prerendering issues with Client Components
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'API Documentation - Outsoor',
  description: 'Complete API documentation for Outsoor platform',
}

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Complete guide to integrating with the Outsoor platform
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn how to authenticate and make requests to the Outsoor API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <CodeBlock code="https://outsoor.com/api" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Rate Limits</h3>
                <p className="text-sm text-muted-foreground">
                  API requests are limited to 1000 requests per hour per API token.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Response Format</h3>
                <p className="text-sm text-muted-foreground">
                  All API responses are returned in JSON format with appropriate HTTP status codes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Token Authentication</CardTitle>
              <CardDescription>
                Secure your API requests using API tokens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Getting Your API Token</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Log in to your Outsoor dashboard</li>
                  <li>Navigate to the API section</li>
                  <li>Create a new API token</li>
                  <li>Copy the generated token (starts with &quot;ptr_&quot;)</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Using Your API Token</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Include your API token in the Authorization header:
                </p>
                <CodeBlock code={`Authorization: Bearer ptr_your_token_here`} />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Token Security</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Keep your API tokens secure and never share them publicly</li>
                  <li>Tokens can be regenerated if compromised</li>
                  <li>Each token is tied to your user account</li>
                  <li>Tokens can be deactivated at any time</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Available API endpoints and their usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Token Verification Endpoint */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Public</Badge>
                  </div>
                  <CodeBlock code={`POST /api/verify-token`} language="http" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Verify if an API token is valid and get token information
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Quick Request</h4>
                  <CodeBlock
                    code={`curl -X POST https://outsoor.com/api/verify-token \\
  -H "Content-Type: application/json" \\
  -d '{"token":"ptr_your_api_token_here"}'`}
                    language="bash"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Request Body</h4>
                  <CodeBlock 
                    code={`{
  "token": "ptr_your_api_token_here"
}`}
                    language="json"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Success Response (200)</h4>
                  <CodeBlock 
                    code={`{
  "success": true,
  "message": "API token is valid",
  "token_info": {
    "id": 123,
    "name": "My API Token",
    "user_id": "uuid-here",
    "user_email": "user@example.com",
    "user_name": "John Doe",
    "last_used_at": "2024-01-15T10:30:00Z"
  }
}`}
                    language="json"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Error Responses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Badge variant="destructive" className="mb-2">400</Badge>
                      <CodeBlock 
                        code={`{
  "error": "API token is required"
}`}
                        language="json"
                      />
                    </div>
                    <div>
                      <Badge variant="destructive" className="mb-2">401</Badge>
                      <CodeBlock 
                        code={`{
  "error": "Invalid or expired API token"
}`}
                        language="json"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Chat API Endpoint */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Protected</Badge>
                  </div>
                  <CodeBlock code={`POST /api/chat`} language="http" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Send messages to the AI chat system
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Quick Request</h4>
                  <CodeBlock
                    code={`curl -X POST https://outsoor.com/api/chat \\
  -H "Authorization: Bearer ptr_your_api_token_here" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Your message here"}'`}
                    language="bash"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Headers Required</h4>
                  <CodeBlock 
                    code={`Authorization: Bearer ptr_your_api_token_here
Content-Type: application/json`}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Request Body</h4>
                  <CodeBlock 
                    code={`{
  "message": "Your message here",
  "context": "optional context information"
}`}
                    language="json"
                  />
                </div>
              </div>

              <Separator />

              {/* User Info Endpoint */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Protected</Badge>
                  </div>
                  <CodeBlock code={`GET /api/auth/me`} language="http" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Get current user information
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium">Quick Request</h4>
                  <CodeBlock
                    code={`curl -X GET https://outsoor.com/api/auth/me \\
  -H "Authorization: Bearer ptr_your_api_token_here"`}
                    language="bash"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Headers Required</h4>
                  <CodeBlock 
                    code={`Authorization: Bearer ptr_your_api_token_here`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Practical examples in different programming languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <h3 className="font-semibold">JavaScript/Node.js</h3>
                <CodeBlock 
                  code={`// Verify API token
const verifyToken = async (token) => {
  const response = await fetch('/api/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token })
  });
  
  const data = await response.json();
  return data;
};

// Usage
const token = 'ptr_your_token_here';
const result = await verifyToken(token);
console.log(result);`}
                  language="javascript"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Python</h3>
                <CodeBlock 
                  code={`import requests

def verify_token(token):
    url = 'https://outsoor.com/api/verify-token'
    payload = {'token': token}
    
    response = requests.post(url, json=payload)
    return response.json()

# Usage
token = 'ptr_your_token_here'
result = verify_token(token)
print(result)`}
                  language="python"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">cURL</h3>
                <CodeBlock 
                  code={`# Verify API token
curl -X POST https://outsoor.com/api/verify-token \\
  -H "Content-Type: application/json" \\
  -d '{"token": "ptr_your_token_here"}'

# Make authenticated request
curl -X GET https://outsoor.com/api/auth/me \\
  -H "Authorization: Bearer ptr_your_token_here"`}
                  language="bash"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">PHP</h3>
                <CodeBlock 
                  code={`<?php
function verifyToken($token) {
    $url = 'https://outsoor.com/api/verify-token';
    $data = json_encode(['token' => $token]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Usage
$token = 'ptr_your_token_here';
$result = verifyToken($token);
var_dump($result);
?>`}
                  language="php"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Your API Integration</CardTitle>
              <CardDescription>
                Interactive tools to test and verify your API tokens and endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Token Verification Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Test if your API token is valid and see detailed information about it.
                </p>
                <Link href="/api-docs/test-token">
                  <Button>
                    Test Your Token
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">API Testing Tips</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Always test your tokens in a safe environment first</li>
                  <li>Use the verification endpoint to check token validity</li>
                  <li>Monitor your API usage and rate limits</li>
                  <li>Keep your tokens secure and rotate them regularly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
