"use client"

import { useState, useTransition } from "react"
import { adminSuspendUserAction, adminUnsuspendUserAction } from "@/app/actions/admin"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdminUserSuspendDialogProps {
  userId: string
  userEmail: string
  isSuspended: boolean
}

export function AdminUserSuspendDialog({ userId, userEmail, isSuspended }: AdminUserSuspendDialogProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"days" | "indefinite">("days")
  const [days, setDays] = useState(7)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSuspend = (formData: FormData) => {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const result = await adminSuspendUserAction(formData)
      if (!result.success) {
        setError(result.error || "Failed to suspend user")
        return
      }

      setSuccess(result.message || "User suspension updated")
      setTimeout(() => {
        setOpen(false)
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      }, 800)
    })
  }

  const handleReactivate = () => {
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append("userId", userId)

      const result = await adminUnsuspendUserAction(formData)
      if (!result.success) {
        setError(result.error || "Failed to reactivate user")
        return
      }

      setSuccess(result.message || "User reactivated")
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.reload()
        }
      }, 800)
    })
  }

  if (isSuspended) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="border-emerald-700/50 text-xs text-emerald-300 hover:bg-emerald-900/20"
        onClick={handleReactivate}
        disabled={isPending}
      >
        {isPending ? "Reactivating..." : "Reactivate"}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size="sm"
        variant="outline"
        className="border-amber-700/50 text-xs text-amber-300 hover:bg-amber-900/20"
        onClick={() => setOpen(true)}
      >
        Suspend/Deactivate
      </Button>
      <DialogContent className="bg-[#1a1b1f] border-[#2d2d32]">
        <DialogHeader>
          <DialogTitle className="text-white text-base">Suspend or deactivate user</DialogTitle>
          <DialogDescription className="text-xs text-[#9ca3af]">
            User: <span className="font-mono">{userEmail}</span>
          </DialogDescription>
        </DialogHeader>

        <form action={handleSuspend} className="space-y-4">
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="mode" value={mode} />

          <div className="space-y-2">
            <Label htmlFor="mode" className="text-xs text-[#e5e7eb]">
              Suspension type
            </Label>
            <Select value={mode} onValueChange={(value) => setMode(value as "days" | "indefinite")}>
              <SelectTrigger className="bg-[#111827] border-[#374151] text-sm text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111827] border-[#374151]">
                <SelectItem value="days" className="text-white">Suspend for number of days</SelectItem>
                <SelectItem value="indefinite" className="text-white">Deactivate indefinitely</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "days" && (
            <div className="space-y-2">
              <Label htmlFor="days" className="text-xs text-[#e5e7eb]">
                Duration (days)
              </Label>
              <Input
                id="days"
                name="days"
                type="number"
                min="1"
                max="3650"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-[#111827] border-[#374151] text-sm text-white placeholder:text-[#6b7280]"
                required
              />
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1">
              {success}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#374151] text-xs text-[#e5e7eb] hover:bg-[#374151]"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-xs" disabled={isPending}>
              {isPending ? "Saving..." : mode === "indefinite" ? "Deactivate" : "Suspend"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
