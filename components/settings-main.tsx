"use client"

import { useState, useEffect, useRef } from "react"
import { updateUserProfile, changePassword, logoutUser, getProfile, updateNotificationSettings, uploadProfileImage } from "@/app/actions/settings"
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
  user: DashboardUser & { user_metadata?: Record<string, any> }
}

export function SettingsMain({ user }: SettingsMainProps) {
  const [profileData, setProfileData] = useState({
    name: user.user_metadata?.name || user.name || '',
    bio: '',
    location: '',
    profile_image: ''
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const [appearance, setAppearance] = useState({
    darkTheme: true
  })

  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      security: true,
      billing: true,
      updates: true,
      marketing: false
    },
    push: {
      enabled: false,
      chat: true,
      security: true
    },
    inApp: {
      enabled: true,
      chat: true,
      tips: true
    }
  })

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: '20:00',
    end: '08:00'
  })

  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const [notificationsMessage, setNotificationsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)

  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [imageMessage, setImageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const result = await getProfile()

      if (!isMounted) {
        return
      }

      if (result.success && result.data) {
        setProfileData((prev) => ({
          ...prev,
          bio: result.data.bio || '',
          location: result.data.location || '',
          profile_image: result.data.profile_image || ''
        }))

        // Set profile image URL if available
        if (result.data.profile_image) {
          // Construct the public URL for the image
          const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${result.data.profile_image}`
          setProfileImageUrl(imageUrl)
        }

        setNotifications((prev) => ({
          ...prev,
          email: {
            ...prev.email,
            enabled: result.data.email_notifications,
            security: result.data.security_alerts,
            billing: result.data.billing_notifications,
            updates: result.data.product_updates,
            marketing: result.data.marketing_updates
          },
          push: {
            ...prev.push,
            enabled: result.data.push_notifications,
            chat: result.data.chat_messages,
            security: result.data.security_push_alerts
          },
          inApp: {
            ...prev.inApp,
            enabled: result.data.in_app_notifications,
            chat: result.data.chat_notifications,
            tips: result.data.tips
          }
        }))

        setQuietHours((prev) => ({
          ...prev,
          enabled: result.data.quiet_hours,
          start: result.data.quiet_hours_start.substring(0, 5),
          end: result.data.quiet_hours_end.substring(0, 5)
        }))

        setAppearance({
          darkTheme: result.data.dark_theme
        })
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [])

  const handleProfileUpdate = async () => {
    setIsLoadingProfile(true)
    setProfileMessage(null)

    try {
      const formData = new FormData()
      formData.append('name', profileData.name)
      formData.append('bio', profileData.bio)
      formData.append('location', profileData.location)

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoadingImage(true)
    setImageMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadProfileImage(formData)

      if (result.success && result.data) {
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile_images/${result.data.profile_image}`
        setProfileImageUrl(imageUrl)
        setProfileData((prev) => ({ ...prev, profile_image: result.data.profile_image }))
        setImageMessage({ type: 'success', text: result.message || 'Profile image updated successfully' })
      } else {
        setImageMessage({ type: 'error', text: result.error || 'Failed to upload image' })
      }
    } catch (error) {
      setImageMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoadingImage(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleImageButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleNotificationToggle = async (category: string, subcategory: string) => {
    setNotificationsMessage(null)
    setIsLoadingNotifications(true)

    // Compute next value from current state
    const current = (notifications[category as keyof typeof notifications] as any)[subcategory]
    const nextValue = !current

    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [subcategory]: nextValue
      }
    }))

    const profileFieldMap: Record<string, Record<string, string>> = {
      email: {
        enabled: "email_notifications",
        security: "security_alerts",
        billing: "billing_notifications",
        updates: "product_updates",
        marketing: "marketing_updates"
      },
      push: {
        enabled: "push_notifications",
        chat: "chat_messages",
        security: "security_push_alerts"
      },
      inApp: {
        enabled: "in_app_notifications",
        chat: "chat_notifications",
        tips: "tips"
      }
    }

    const profileField = profileFieldMap[category]?.[subcategory]

    if (!profileField) {
      setIsLoadingNotifications(false)
      return
    }

    const result = await updateNotificationSettings({ [profileField]: nextValue })

    if (!result.success) {
      setNotifications((prev) => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [subcategory]: !nextValue
        }
      }))
      setNotificationsMessage({ type: 'error', text: result.error || 'Failed to update notifications' })
    } else {
      setNotificationsMessage({ type: 'success', text: 'Notification preferences updated' })
    }

    setIsLoadingNotifications(false)
  }

  const handleQuietHoursToggle = async () => {
    setNotificationsMessage(null)
    setIsLoadingNotifications(true)

    const nextEnabled = !quietHours.enabled
    setQuietHours((prev) => ({ ...prev, enabled: nextEnabled }))

    const result = await updateNotificationSettings({ quiet_hours: nextEnabled })

    if (!result.success) {
      setQuietHours((prev) => ({ ...prev, enabled: !nextEnabled }))
      setNotificationsMessage({ type: 'error', text: result.error || 'Failed to update quiet hours' })
    } else {
      setNotificationsMessage({ type: 'success', text: 'Quiet hours updated' })
    }

    setIsLoadingNotifications(false)
  }

  const handleQuietHoursChange = async (field: 'start' | 'end', value: string) => {
    setNotificationsMessage(null)
    const newQuietHours = { ...quietHours, [field]: value }
    setQuietHours(newQuietHours)

    const updates: any = {
      [field === 'start' ? 'quiet_hours_start' : 'quiet_hours_end']: value
    }

    const result = await updateNotificationSettings(updates)

    if (!result.success) {
      setQuietHours((prev) => ({ ...prev, [field]: quietHours[field] }))
      setNotificationsMessage({ type: 'error', text: result.error || 'Failed to update quiet hours' })
    }
  }

  const handleAppearanceToggle = async () => {
    setIsLoadingNotifications(true)
    setNotificationsMessage(null)

    const nextValue = !appearance.darkTheme
    setAppearance({ darkTheme: nextValue })

    const result = await updateNotificationSettings({ dark_theme: nextValue })

    if (!result.success) {
      setAppearance({ darkTheme: !nextValue })
      setNotificationsMessage({ type: 'error', text: result.error || 'Failed to update appearance' })
    } else {
      setNotificationsMessage({ type: 'success', text: 'Appearance settings updated' })
    }

    setIsLoadingNotifications(false)
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
                      {profileImageUrl ? (
                        <img 
                          src={profileImageUrl} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#8C5CF7]"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-[#8C5CF7] to-[#3B1F82] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-2xl">{(user.user_metadata?.name || user.name || 'U')?.[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <Button 
                        size="sm" 
                        onClick={handleImageButtonClick}
                        disabled={isLoadingImage}
                        className="absolute -bottom-1 -right-1 w-8 h-8 p-0 rounded-full bg-[#2D2D32] border border-[#3D3D42] hover:bg-[#3D3D42]"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user.user_metadata?.name || user.name || 'User'}</h3>
                      <p className="text-[#A0A0A8] text-sm">{user.email}</p>
                    </div>
                  </div>

                  {/* Image Upload Message */}
                  {imageMessage && (
                    <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                      imageMessage.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      {imageMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p className={imageMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {imageMessage.text}
                      </p>
                    </div>
                  )}

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
                      <div className="h-10 px-3 rounded-md bg-[#2D2D32] border border-[#3D3D42] text-[#A0A0A8] flex items-center">
                        {user.email}
                      </div>
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
                  {notificationsMessage && (
                    <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                      notificationsMessage.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      {notificationsMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p className={notificationsMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {notificationsMessage.text}
                      </p>
                    </div>
                  )}
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
                      variant={notifications.email.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("email", "enabled")}
                      disabled={isLoadingNotifications}
                      className={notifications.email.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email.enabled ? "On" : "Off"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <p className="text-[#A0A0A8] text-sm">Receive push notifications</p>
                    </div>
                    <Button
                      variant={notifications.push.enabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleNotificationToggle("push", "enabled")}
                      disabled={isLoadingNotifications}
                      className={notifications.push.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.push.enabled ? "On" : "Off"}
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
                  {notificationsMessage && (
                    <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                      notificationsMessage.type === 'success'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      {notificationsMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <p className={notificationsMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}>
                        {notificationsMessage.text}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Dark Theme</h4>
                      <p className="text-[#A0A0A8] text-sm">Use dark theme for the interface</p>
                    </div>
                    <Button
                      variant={appearance.darkTheme ? "default" : "outline"}
                      size="sm"
                      onClick={handleAppearanceToggle}
                      disabled={isLoadingNotifications}
                      className={appearance.darkTheme ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {appearance.darkTheme ? "On" : "Off"}
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
