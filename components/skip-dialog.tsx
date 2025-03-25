"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SkipDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function SkipDialog({ isOpen, onClose, onConfirm }: SkipDialogProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (password === "1234") {
      onConfirm()
      setPassword("")
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-blue-900 border-blue-700 text-white">
        <DialogHeader>
          <DialogTitle>Developer Skip</DialogTitle>
          <DialogDescription className="text-blue-300">
            Enter the developer password to skip this level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-blue-800 border-blue-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-blue-800 hover:bg-blue-700 text-white border-blue-600"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Skip Level
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

