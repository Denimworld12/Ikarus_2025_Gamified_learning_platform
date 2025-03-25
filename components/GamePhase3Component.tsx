"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, SkipForward } from "lucide-react"
import ZeroGravityNavigation from "@/components/zero-gravity-navigation"
import AsteroidDeflectionGame from "@/components/asteroid-deflection-game"
import OrbitalMechanicsPuzzle from "@/components/orbital-mechanics-puzzle"
import FuelOptimizationGame from "@/components/fuel-optimization-game"
import ChatbotModal from "@/components/chatbot-modal"
import SkipDialog from "@/components/skip-dialog"
import ProfileIcon from "@/components/profile-icon"

export default function GamePhase3Component() {
  const router = useRouter()
  const [showChatbot, setShowChatbot] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [currentSubject, setCurrentSubject] = useState("physics")
  const [activeTab, setActiveTab] = useState("navigation")
  const [playerName, setPlayerName] = useState("Explorer")
  const [completedGames, setCompletedGames] = useState({
    navigation: false,
    asteroid: false,
    orbital: false,
    fuel: false,
  })

  // Safe to access localStorage here because the component will only be rendered client-side
  useEffect(() => {
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      setPlayerName(storedName)
    }
  }, [])

  const handleGameComplete = (game: keyof typeof completedGames) => {
    setCompletedGames((prev) => ({
      ...prev,
      [game]: true,
    }))

    // Check if all games are completed
    const allCompleted = Object.values({
      ...completedGames,
      [game]: true,
    }).every(Boolean)

    if (allCompleted) {
      setTimeout(() => {
        router.push("/game/phase3-complete")
      }, 1500)
    }
  }

  const getSubjectForGame = (game: string) => {
    switch (game) {
      case "navigation":
        return "physics"
      case "asteroid":
        return "mathematics"
      case "orbital":
        return "astronomy"
      case "fuel":
        return "chemistry"
      default:
        return "physics"
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    router.push("/game/phase3-complete")
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Phase 3: Space Journey</h1>
            <div className="flex items-center gap-4">
              <div className="text-white font-bold">{playerName}</div>
              <ProfileIcon />
            </div>
          </div>
          <p className="text-blue-100 mb-4">
            Navigate through the challenges of deep space using physics, mathematics, and coding skills.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-blue-900/30 text-white border-blue-700/50">
              <CardHeader>
                <CardTitle>Deep Space Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-blue-800/50">
                    <TabsTrigger
                      value="navigation"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Zero-Gravity Navigation
                      {completedGames.navigation && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="asteroid"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Asteroid Deflection
                      {completedGames.asteroid && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="orbital"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Orbital Mechanics
                      {completedGames.orbital && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="fuel"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Fuel Optimization
                      {completedGames.fuel && " ✓"}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="navigation">
                    <ZeroGravityNavigation onComplete={() => handleGameComplete("navigation")} />
                  </TabsContent>

                  <TabsContent value="asteroid">
                    <AsteroidDeflectionGame onComplete={() => handleGameComplete("asteroid")} />
                  </TabsContent>

                  <TabsContent value="orbital">
                    <OrbitalMechanicsPuzzle onComplete={() => handleGameComplete("orbital")} />
                  </TabsContent>

                  <TabsContent value="fuel">
                    <FuelOptimizationGame onComplete={() => handleGameComplete("fuel")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-blue-900/30 text-white border-blue-700/50">
              <CardHeader>
                <CardTitle>Mission Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Mission Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Zero-Gravity Navigation</span>
                      <span>{completedGames.navigation ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asteroid Deflection</span>
                      <span>{completedGames.asteroid ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Orbital Mechanics</span>
                      <span>{completedGames.orbital ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fuel Optimization</span>
                      <span>{completedGames.fuel ? "✓" : "Pending"}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                  onClick={() => {
                    setShowChatbot(true)
                    setCurrentSubject(getSubjectForGame(activeTab))
                  }}
                >
                  <MessageCircle size={18} />
                  Ask Icarus for help
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-white border-blue-500 bg-blue-900/50 hover:bg-blue-800"
            onClick={handleSkip}
          >
            <SkipForward size={16} />
            Developer Skip
          </Button>
        </div>
      </div>

      {showChatbot && (
        <ChatbotModal isOpen={showChatbot} onClose={() => setShowChatbot(false)} currentSubject={currentSubject} />
      )}

      <SkipDialog isOpen={showSkipDialog} onClose={() => setShowSkipDialog(false)} onConfirm={confirmSkip} />
    </div>
  )
} 