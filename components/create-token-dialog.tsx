"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Check } from "lucide-react"
import { useState } from "react"
import { createApiToken } from "@/app/actions/api-tokens"

interface CreateTokenDialogProps {
  onTokenCreated?: () => void | Promise<void>
}

export function CreateTokenDialog({ onTokenCreated }: CreateTokenDialogProps) {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsCreating(true)
    try {
      const result = await createApiToken(formData)
      if (result.success && typeof result.token === "string") {
        setNewToken(result.token)
        await onTokenCreated?.()
      }
    } catch (error) {
      console.error("Failed to create token:", error)
      alert("Failed to create token")
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setNewToken(null)
    setCopied(false)
  }

  const handleCopy = async () => {
    if (newToken) {
      await navigator.clipboard.writeText(newToken)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-[#8C5CF7] to-[#C85CFA] hover:from-[#7C4CF7] hover:to-[#B84CFA] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            Create a new token
          </Button>
        </DialogTrigger>
      <DialogContent className="bg-[#1A1B1F] border-[#2D2D32] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#8C5CF7] via-[#C85CFA] to-[#5567F7] bg-clip-text text-transparent">
            Create new API token
          </DialogTitle>
          <DialogDescription className="text-[#A0A0A8] text-base">
            Create a new API token to access your account programmatically.
          </DialogDescription>
        </DialogHeader>

        {newToken ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#0D0D0F] border border-[#00ff88]/20 rounded-lg">
              <h4 className="text-[#00ff88] font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                Token created successfully!
              </h4>
              <p className="text-sm text-[#A0A0A8] mb-3">
                Please copy your new token now. You won't be able to see it again!
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-[#0D0D0F] border border-[#2D2D32] rounded-lg text-sm font-mono text-[#E0E0E8] break-all">
                  {newToken}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50 transition-colors duration-200"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button 
              onClick={handleClose} 
              className="w-full bg-gradient-to-r from-[#8C5CF7] to-[#C85CFA] hover:from-[#7C4CF7] hover:to-[#B84CFA] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Done
            </Button>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#E0E0E8] font-medium">
                Token name (optional)
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="My API token"
                className="bg-[#0D0D0F] border-[#2D2D32] text-[#E0E0E8] placeholder-[#6B6B7A] focus:border-[#8C5CF7] focus:ring-[#8C5CF7]/20 transition-colors duration-200"
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-[#2D2D32] text-[#A0A0A8] bg-transparent hover:bg-[#2D2D32] hover:text-white hover:border-[#3D3D42] transition-colors duration-200"
              >
                Cancel
              </Button>
                             <Button 
                 type="submit" 
                 disabled={isCreating} 
                 className="flex-1 bg-gradient-to-r from-[#8C5CF7] to-[#C85CFA] hover:from-[#7C4CF7] hover:to-[#B84CFA] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isCreating ? "Creating..." : "Create token"}
               </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
