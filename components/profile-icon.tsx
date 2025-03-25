"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserRoundIcon as UserRoundPen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getLocalStorage } from '../lib/storage'

export default function ProfileIcon() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("Explorer")

  useEffect(() => {
    const storedName = getLocalStorage('playerName', 'Explorer')
    setPlayerName(storedName)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-blue-900/50 hover:bg-blue-800 text-white border border-blue-700"
        >
          <UserRoundPen className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-blue-900 border-blue-700 text-white">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{playerName}</span>
            <span className="text-xs text-blue-300">Level 42</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem className="cursor-pointer hover:bg-blue-800" onClick={() => router.push("/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-blue-800" onClick={() => router.push("/achievements")}>
          Achievements
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-blue-800" onClick={() => router.push("/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-blue-700" />
        <DropdownMenuItem
          className="cursor-pointer text-red-400 hover:bg-red-900/50 hover:text-red-300"
          onClick={() => router.push("/")}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

