"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import Confetti from "@/components/confetti"
import ProfileIcon from "@/components/profile-icon"

export default function Phase1Complete() {
  const router = useRouter()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti after component mounts
    setShowConfetti(true)

    // Clean up confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-blue-200 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute top-4 right-4">
        <ProfileIcon />
      </div>
      {showConfetti && <Confetti />}

      <div className="text-center max-w-3xl mx-auto p-8">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Rocket className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Launchpad Reached!</h1>
        <p className="text-xl mb-8">
          Congratulations! You've successfully completed Phase 1 and reached the launchpad. Now it's time to build your
          spaceship and prepare for launch.
        </p>

        <Button size="lg" className="text-lg px-8" onClick={() => router.push("/game/phase2")}>
          Continue to Phase 2
        </Button>
      </div>
    </div>
  )
}

