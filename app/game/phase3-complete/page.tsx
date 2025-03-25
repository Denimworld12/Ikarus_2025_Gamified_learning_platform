"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import Confetti from "@/components/confetti"
import ProfileIcon from "@/components/profile-icon"

export default function Phase3Complete() {
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
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/placeholder.svg?height=1080&width=1920')", // Replace with your space background
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-4 right-4">
        <ProfileIcon />
      </div>
      {showConfetti && <Confetti />}

      <div className="text-center max-w-3xl mx-auto p-8 bg-black/70 rounded-lg text-white">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <Rocket className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Deep Space Navigation Complete!</h1>
        <p className="text-xl mb-8">
          Congratulations! You've successfully navigated through the challenges of deep space. Now it's time for the
          final challenge: landing on the planet.
        </p>

        <Button size="lg" className="text-lg px-8" onClick={() => router.push("/game/phase4")}>
          Continue to Phase 4: Planet Landing
        </Button>
      </div>
    </div>
  )
}

