"use client"

import type React from "react"

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
import { useState } from "react"

interface Token {
  id: string
  name: string
  token: string
  created_at: string
}

interface TokenActionDialogProps {
  token: Token
  trigger: React.ReactNode
}

export function TokenActionDialog({ token, trigger }: TokenActionDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit API token</DialogTitle>
          <DialogDescription className="text-gray-400">Update the name of your API token.</DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div>
            <Label htmlFor="edit-name" className="text-gray-300">
              Token name
            </Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={token.name}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
