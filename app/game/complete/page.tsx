"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Flag } from "lucide-react"
import Confetti from "@/components/confetti"
import ProfileIcon from "@/components/profile-icon"
import { getLocalStorage } from "@/lib/storage"

export default function GameComplete() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)
  const [playerName, setPlayerName] = useState("Explorer")

  useEffect(() => {
    // Get player name from localStorage
    const storedName = getLocalStorage('playerName', 'Explorer')
    setPlayerName(storedName)

    // Trigger confetti after component mounts
    setShowConfetti(true)

    // Clean up confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900">
      <div className="absolute top-4 right-4">
        <ProfileIcon />
      </div>
      {showConfetti && <Confetti />}

      <div className="text-center max-w-3xl mx-auto p-8 bg-blue-900/70 rounded-lg text-white border border-blue-500/30">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
            <Flag className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Mission Accomplished!</h1>
        <p className="text-xl mb-8 text-blue-100">
          Congratulations, {playerName}! You've successfully completed all phases of the space mission. You've mastered
          concepts in mathematics, physics, chemistry, biology, and coding to navigate through space and land safely on
          a distant planet.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
            <h3 className="font-bold text-white">Phase 1</h3>
            <p className="text-sm text-blue-200">Journey to the Launchpad</p>
          </div>
          <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
            <h3 className="font-bold text-white">Phase 2</h3>
            <p className="text-sm text-blue-200">Building the Spaceship</p>
          </div>
          <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
            <h3 className="font-bold text-white">Phase 3</h3>
            <p className="text-sm text-blue-200">Space Journey</p>
          </div>
          <div className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
            <h3 className="font-bold text-white">Phase 4</h3>
            <p className="text-sm text-blue-200">Planet Landing</p>
          </div>
        </div>

        <Button
          size="lg"
          className="text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push("/")}
        >
          Return to Home
        </Button>
      </div>
    </div>
  )
}

