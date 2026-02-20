"use client"

import { useState } from "react"
import { updateUserProfile, changePassword, logoutUser } from "@/app/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Key, 
  Globe, 
  Save,
  Camera,
  Edit3,
  ArrowRight,
  LogOut,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import type { DashboardUser } from "@/types/dashboard-user"

interface SettingsMainProps {
  user: { id: string; name?: string; email?: string; user_metadata?: Record<string, any> }
}

export function SettingsMain({ user }: SettingsMainProps) {
  const [profileData, setProfileData] = useState({
    name: user.user_metadata?.name || user.name || '',
    email: user.email || '',
    bio: '',
    location: ''
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    chat: true,
    updates: true
  })

  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)

  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleProfileUpdate = async () => {
    setIsLoadingProfile(true)
    setProfileMessage(null)

    try {
      const formData = new FormData()
      formData.append('name', profileData.name)
      formData.append('email', profileData.email)

      const result = await updateUserProfile(formData)

      if (result.success) {
        setProfileMessage({ type: 'success', text: result.message || 'Profile updated successfully' })
      } else {
        setProfileMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsLoadingPassword(true)
    setPasswordMessage(null)

    try {
      const formData = new FormData()
      formData.append('newPassword', passwordData.newPassword)
      formData.append('confirmPassword', passwordData.confirmPassword)

      const result = await changePassword(formData)

      if (result.success) {
        setPasswordMessage({ type: 'success', text: result.message || 'Password changed successfully' })
        setPasswordData({ newPassword: '', confirmPassword: '' })
      } else {
        setPasswordMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const handleLogout = async () => {
    setIsLoadingLogout(true)
    try {
      await logoutUser()
    } catch (error) {
      setIsLoadingLogout(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      {/* Header */}
      <header className="p-6 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[#A0A0A8]">
            Manage your account preferences, profile information, and security settings.
          </p>
        </div>
      </header>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-[#1A1B1F] border border-[#2D2D32]">
              <TabsTrigger value="profile" className="data-[state=active]:bg-[#8C5CF7] data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#8C5CF7] data-[state=active]:text-white">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-[#8C5CF7] data-[state=active]:text-white">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-[#8C5CF7] data-[state=active]:text-white">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-[#1A1B1F] border-[#2D2D32]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-[#A0A0A8]">
                    Update your personal information and profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Messages */}
                  {profileMessage && (
                    <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                      profileMessage.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      {profileMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p className={profileMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {profileMessage.text}
                      </p>
                    </div>
                  )}

                  {/* Avatar Section */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#8C5CF7] to-[#3B1F82] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-2xl">{(user.user_metadata?.name || user.name || 'U')?.[0]?.toUpperCase()}</span>
                      </div>
                      <Button size="sm" className="absolute -bottom-1 -right-1 w-8 h-8 p-0 rounded-full bg-[#2D2D32] border border-[#3D3D42] hover:bg-[#3D3D42]">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user.user_metadata?.name || user.name || 'User'}</h3>
                      <p className="text-[#A0A0A8] text-sm">{user.email}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Full Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Email</label>
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Bio</label>
                      <Input
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Location</label>
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                        placeholder="Where are you located?"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={isLoadingProfile}
                    className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-[#1A1B1F] border-[#2D2D32]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-[#A0A0A8]">
                    Manage your password and security preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Messages */}
                  {passwordMessage && (
                    <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                      passwordMessage.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      {passwordMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p className={passwordMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {passwordMessage.text}
                      </p>
                    </div>
                  )}

                  {/* Change Password Section */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">New Password</label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                          placeholder="Enter new password (min 8 characters)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Confirm Password</label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="bg-[#2D2D32] border-[#3D3D42] text-white placeholder-[#8C8C96]"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={isLoadingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      variant="outline" 
                      className="w-full border-[#2D2D32] text-[#A0A0A8] hover:bg-[#2D2D32] hover:text-white"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      {isLoadingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>

                  <div className="p-4 bg-[#2D2D32] rounded-lg border border-[#3D3D42]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Advanced Security</h4>
                        <p className="text-[#A0A0A8] text-sm">Access detailed security settings and monitoring</p>
                      </div>
                      <Link href="/dashboard/security">
                        <Button className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                          Manage Security
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button 
                    onClick={handleLogout}
                    disabled={isLoadingLogout}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isLoadingLogout ? 'Logging out...' : 'Logout'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-[#1A1B1F] border-[#2D2D32]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-[#A0A0A8]">
                    Choose how you want to be notified about updates and activities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-[#2D2D32] rounded-lg border border-[#3D3D42]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Advanced Notifications</h4>
                        <p className="text-[#A0A0A8] text-sm">Access detailed notification settings and history</p>
                      </div>
                      <Link href="/dashboard/notifications">
                        <Button className="bg-[#8C5CF7] hover:bg-[#7C4CF7] text-white">
                          Manage Notifications
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-[#A0A0A8] text-sm">Receive updates via email</p>
                    </div>
                    <Button
                      variant={notifications.email ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotifications({...notifications, email: !notifications.email})}
                      className={notifications.email ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <p className="text-[#A0A0A8] text-sm">Receive push notifications</p>
                    </div>
                    <Button
                      variant={notifications.push ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotifications({...notifications, push: !notifications.push})}
                      className={notifications.push ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.push ? "On" : "Off"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-[#1A1B1F] border-[#2D2D32]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription className="text-[#A0A0A8]">
                    Customize the look and feel of your interface.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Dark Theme</h4>
                      <p className="text-[#A0A0A8] text-sm">Use dark theme (always enabled)</p>
                    </div>
                    <Button variant="default" size="sm" className="bg-[#8C5CF7]" disabled>
                      On
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
