"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface SecurityMainProps {
  user: DashboardUser
}

export function SecurityMain({ user }: SecurityMainProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginHistory] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', time: '2 hours ago', status: 'success' },
    { id: 2, device: 'Safari on iPhone', location: 'London, UK', time: '1 day ago', status: 'success' },
    { id: 3, device: 'Firefox on Mac', location: 'Unknown', time: '3 days ago', status: 'failed' }
  ])

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!')
      return
    }
    // Handle password change logic
    console.log('Password changed:', passwords)
    setPasswords({ current: '', new: '', confirm: '' })
  }

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    // Handle 2FA toggle logic
    console.log('2FA toggled:', !twoFactorEnabled)
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      {/* Header */}
      <header className="p-6 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-2">Security</h1>
          <p className="text-[#A0A0A8]">
            Manage your account security, passwords, and authentication settings.
          </p>
        </div>
      </header>

      {/* Security Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Password Management */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96] pr-10"
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-[#A0A0A8] hover:text-white"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96] pr-10"
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-[#A0A0A8] hover:text-white"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96] pr-10"
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-[#A0A0A8] hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={handlePasswordChange} className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#2D2D32] rounded-lg border border-[#3D3D42]">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#8C5CF7]" />
                  <div>
                    <h4 className="text-white font-medium">Authenticator App</h4>
                    <p className="text-[#A0A0A8] text-sm">Use an app like Google Authenticator</p>
                  </div>
                </div>
                <Button
                  onClick={toggleTwoFactor}
                  variant={twoFactorEnabled ? "default" : "outline"}
                  className={twoFactorEnabled ? "bg-[#4ADE80] hover:bg-[#22C55E] text-white" : "border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"}
                >
                  {twoFactorEnabled ? "Enabled" : "Enable"}
                </Button>
              </div>
              
              {twoFactorEnabled && (
                <div className="p-4 bg-[#1A1B1F] rounded-lg border border-[#4ADE80]">
                  <div className="flex items-center gap-2 text-[#4ADE80] mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">2FA is now active</span>
                  </div>
                  <p className="text-[#A0A0A8] text-sm">
                    Your account is now protected with two-factor authentication. 
                    You'll need to enter a code from your authenticator app when signing in.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Recent Login Activity
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Monitor your account access and detect any suspicious activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-3 bg-[#2D2D32] rounded-lg border border-[#3D3D42]">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${login.status === 'success' ? 'bg-[#4ADE80]' : 'bg-[#EF4444]'}`} />
                      <div>
                        <p className="text-white font-medium text-sm">{login.device}</p>
                        <p className="text-[#A0A0A8] text-xs">{login.location} • {login.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {login.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                      )}
                      <span className={`text-xs ${login.status === 'success' ? 'text-[#4ADE80]' : 'text-[#EF4444]'}`}>
                        {login.status === 'success' ? 'Successful' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Recommendations */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Recommendations
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Follow these best practices to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-[#2D2D32] rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#4ADE80] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Use a strong password</h4>
                  <p className="text-[#A0A0A8] text-xs">Include uppercase, lowercase, numbers, and special characters</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#2D2D32] rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#4ADE80] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Enable two-factor authentication</h4>
                  <p className="text-[#A0A0A8] text-xs">Add an extra layer of security to your account</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-[#2D2D32] rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#4ADE80] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium text-sm">Monitor login activity</h4>
                  <p className="text-[#A0A0A8] text-xs">Regularly check for any suspicious login attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
