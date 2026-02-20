"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare, 
  Globe, 
  Shield, 
  CreditCard,
  CheckCircle,
  Clock,
  Settings,
  Volume2,
  VolumeX
} from "lucide-react"
import type { DashboardUser } from "@/types/dashboard-user"

interface NotificationsMainProps {
  user: DashboardUser
}

export function NotificationsMain({ user }: NotificationsMainProps) {
  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      marketing: false,
      updates: true,
      security: true,
      billing: true
    },
    push: {
      enabled: false,
      chat: true,
      updates: true,
      security: true
    },
    inApp: {
      enabled: true,
      chat: true,
      updates: true,
      tips: false
    }
  })

  const [quietHours, setQuietHours] = useState({
    enabled: false,
    start: '22:00',
    end: '08:00'
  })

  const [notificationHistory] = useState([
    { id: 1, type: 'chat', message: 'New message from AI Assistant', time: '2 minutes ago', read: false },
    { id: 2, type: 'security', message: 'Login from new device detected', time: '1 hour ago', read: true },
    { id: 3, type: 'billing', message: 'Payment successful for Pro plan', time: '2 hours ago', read: true },
    { id: 4, type: 'update', message: 'New features available', time: '1 day ago', read: true }
  ])

  const toggleNotification = (category: string, subcategory: string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [subcategory]: !(prev[category as keyof typeof prev] as any)[subcategory]
      }
    }))
  }

  const toggleQuietHours = () => {
    setQuietHours(prev => ({ ...prev, enabled: !prev.enabled }))
  }

  const markAsRead = (id: number) => {
    // Handle mark as read logic
    console.log('Marked as read:', id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageSquare className="w-4 h-4 text-[#8C5CF7]" />
      case 'security': return <Shield className="w-4 h-4 text-[#EF4444]" />
      case 'billing': return <CreditCard className="w-4 h-4 text-[#4ADE80]" />
      case 'update': return <Globe className="w-4 h-4 text-[#FACC15]" />
      default: return <Bell className="w-4 h-4 text-[#A0A0A8]" />
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0D0D0F] via-[#121214] to-[#1A1B1F]">
      {/* Header */}
      <header className="p-6 border-b border-[#2D2D32] bg-[#1A1B1F]/80 backdrop-blur-sm">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-[#A0A0A8]">
            Manage your notification preferences and stay informed about what matters to you.
          </p>
        </div>
      </header>

      {/* Notifications Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Email Notifications */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Notifications
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Control which emails you receive from us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#2D2D32] rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#8C5CF7]" />
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-[#A0A0A8] text-sm">Receive notifications via email</p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleNotification('email', 'enabled')}
                  variant={notifications.email.enabled ? "default" : "outline"}
                  size="sm"
                  className={notifications.email.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                >
                  {notifications.email.enabled ? "On" : "Off"}
                </Button>
              </div>
              
              {notifications.email.enabled && (
                <div className="space-y-3 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Security Alerts</h5>
                      <p className="text-[#A0A0A8] text-xs">Important security notifications</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('email', 'security')}
                      variant={notifications.email.security ? "default" : "outline"}
                      size="sm"
                      className={notifications.email.security ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email.security ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Billing Updates</h5>
                      <p className="text-[#A0A0A8] text-xs">Payment confirmations and invoices</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('email', 'billing')}
                      variant={notifications.email.billing ? "default" : "outline"}
                      size="sm"
                      className={notifications.email.billing ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email.billing ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Product Updates</h5>
                      <p className="text-[#A0A0A8] text-xs">New features and improvements</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('email', 'updates')}
                      variant={notifications.email.updates ? "default" : "outline"}
                      size="sm"
                      className={notifications.email.updates ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email.updates ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Marketing</h5>
                      <p className="text-[#A0A0A8] text-xs">Promotional content and offers</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('email', 'marketing')}
                      variant={notifications.email.marketing ? "default" : "outline"}
                      size="sm"
                      className={notifications.email.marketing ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.email.marketing ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Push Notifications
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Control push notifications on your devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#2D2D32] rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-[#8C5CF7]" />
                  <div>
                    <h4 className="text-white font-medium">Push Notifications</h4>
                    <p className="text-[#A0A0A8] text-sm">Receive notifications on your devices</p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleNotification('push', 'enabled')}
                  variant={notifications.push.enabled ? "default" : "outline"}
                  size="sm"
                  className={notifications.push.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                >
                  {notifications.push.enabled ? "On" : "Off"}
                </Button>
              </div>
              
              {notifications.push.enabled && (
                <div className="space-y-3 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Chat Messages</h5>
                      <p className="text-[#A0A0A8] text-xs">New messages from AI Assistant</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('push', 'chat')}
                      variant={notifications.push.chat ? "default" : "outline"}
                      size="sm"
                      className={notifications.push.chat ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.push.chat ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Security Alerts</h5>
                      <p className="text-[#A0A0A8] text-xs">Important security notifications</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('push', 'security')}
                      variant={notifications.push.security ? "default" : "outline"}
                      size="sm"
                      className={notifications.push.security ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.push.security ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* In-App Notifications */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                In-App Notifications
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Control notifications that appear within the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#2D2D32] rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#8C5CF7]" />
                  <div>
                    <h4 className="text-white font-medium">In-App Notifications</h4>
                    <p className="text-[#A0A0A8] text-sm">Show notifications within the app</p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleNotification('inApp', 'enabled')}
                  variant={notifications.inApp.enabled ? "default" : "outline"}
                  size="sm"
                  className={notifications.inApp.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                >
                  {notifications.inApp.enabled ? "On" : "Off"}
                </Button>
              </div>
              
              {notifications.inApp.enabled && (
                <div className="space-y-3 pl-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Chat Notifications</h5>
                      <p className="text-[#A0A0A8] text-xs">Show chat-related notifications</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('inApp', 'chat')}
                      variant={notifications.inApp.chat ? "default" : "outline"}
                      size="sm"
                      className={notifications.inApp.chat ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.inApp.chat ? "On" : "Off"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm">Tips & Hints</h5>
                      <p className="text-[#A0A0A8] text-xs">Show helpful tips and suggestions</p>
                    </div>
                    <Button
                      onClick={() => toggleNotification('inApp', 'tips')}
                      variant={notifications.inApp.tips ? "default" : "outline"}
                      size="sm"
                      className={notifications.inApp.tips ? "bg-[#4ADE80]" : "border-[#2D2D32] text-[#A0A0A8]"}
                    >
                      {notifications.inApp.tips ? "On" : "Off"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Quiet Hours
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                Set specific times when you don't want to receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#2D2D32] rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#8C5CF7]" />
                  <div>
                    <h4 className="text-white font-medium">Quiet Hours</h4>
                    <p className="text-[#A0A0A8] text-sm">Pause notifications during specific hours</p>
                  </div>
                </div>
                <Button
                  onClick={toggleQuietHours}
                  variant={quietHours.enabled ? "default" : "outline"}
                  size="sm"
                  className={quietHours.enabled ? "bg-[#8C5CF7]" : "border-[#2D2D32] text-[#A0A0A8]"}
                >
                  {quietHours.enabled ? "On" : "Off"}
                </Button>
              </div>
              
              {quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4 pl-8">
                  <div>
                    <label className="text-sm font-medium text-white">Start Time</label>
                    <input
                      type="time"
                      value={quietHours.start}
                      onChange={(e) => setQuietHours({...quietHours, start: e.target.value})}
                      className="mt-1 w-full bg-[#2D2D32] border border-[#3D3D42] text-white rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white">End Time</label>
                    <input
                      type="time"
                      value={quietHours.end}
                      onChange={(e) => setQuietHours({...quietHours, end: e.target.value})}
                      className="mt-1 w-full bg-[#2D2D32] border border-[#3D3D42] text-white rounded px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="bg-[#1A1B1F] border-[#2D2D32]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
              <CardDescription className="text-[#A0A0A8]">
                View your recent notification history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notificationHistory.map((notification) => (
                  <div key={notification.id} className={`flex items-center justify-between p-3 rounded-lg border ${
                    notification.read 
                      ? 'bg-[#2D2D32] border-[#3D3D42]' 
                      : 'bg-[#1A1B1F] border-[#8C5CF7]'
                  }`}>
                    <div className="flex items-center gap-3">
                      {getNotificationIcon(notification.type)}
                      <div>
                        <p className={`font-medium text-sm ${notification.read ? 'text-[#A0A0A8]' : 'text-white'}`}>
                          {notification.message}
                        </p>
                        <p className="text-[#8C8C96] text-xs">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#8C5CF7] rounded-full" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-[#A0A0A8] hover:text-white hover:bg-[#2D2D32]"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
