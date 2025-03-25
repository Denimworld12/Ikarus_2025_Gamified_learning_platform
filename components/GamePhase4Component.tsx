"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, SkipForward } from "lucide-react"
import AtmosphericEntryChallenge from "@/components/atmospheric-entry-challenge"
import ParachuteDeploymentGame from "@/components/parachute-deployment-game"
import LandingControlChallenge from "@/components/landing-control-challenge"
import PlanetaryAnalysisChallenge from "@/components/planetary-analysis-challenge"
import ChatbotModal from "@/components/chatbot-modal"
import SkipDialog from "@/components/skip-dialog"
import ProfileIcon from "@/components/profile-icon"
import { getLocalStorage, setLocalStorage } from "@/lib/storage"

export default function GamePhase4Component() {
  const router = useRouter()
  const [showChatbot, setShowChatbot] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [currentSubject, setCurrentSubject] = useState("physics")
  const [activeTab, setActiveTab] = useState("atmospheric")
  const [playerName, setPlayerName] = useState("Explorer")
  const [completedGames, setCompletedGames] = useState({
    atmospheric: false,
    parachute: false,
    landing: false,
    analysis: false,
  })

  // Safe to access localStorage here because the component will only be rendered client-side
  useEffect(() => {
    const storedName = getLocalStorage('playerName', 'Explorer')
    setPlayerName(storedName)
  }, [])

  const handleGameComplete = (game: keyof typeof completedGames) => {
    setCompletedGames((prev) => ({
      ...prev,
      [game]: true,
    }))

    // Save completed games to localStorage
    const updatedGames = {
      ...completedGames,
      [game]: true,
    };
    setLocalStorage('phase4CompletedGames', updatedGames);

    // Check if all games are completed
    const allCompleted = Object.values({
      ...completedGames,
      [game]: true,
    }).every(Boolean)

    if (allCompleted) {
      setTimeout(() => {
        router.push("/game/complete")
      }, 1500)
    }
  }

  const getSubjectForGame = (game: string) => {
    switch (game) {
      case "atmospheric":
        return "thermodynamics"
      case "parachute":
        return "aerodynamics"
      case "landing":
        return "propulsion"
      case "analysis":
        return "exobiology"
      default:
        return "physics"
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    router.push("/game/complete")
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Phase 4: Planet Landing</h1>
            <div className="flex items-center gap-4">
              <div className="text-white font-bold">{playerName}</div>
              <ProfileIcon />
            </div>
          </div>
          <p className="text-blue-100 mb-4">The final challenge: safely land on the planet's surface.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-blue-900/30 text-white border-blue-700/50">
              <CardHeader>
                <CardTitle>Landing Sequence</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-blue-800/50">
                    <TabsTrigger
                      value="atmospheric"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Atmospheric Entry
                      {completedGames.atmospheric && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="parachute"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Parachute Deployment
                      {completedGames.parachute && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="landing"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Landing Control
                      {completedGames.landing && " ✓"}
                    </TabsTrigger>
                    <TabsTrigger
                      value="analysis"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Planetary Analysis
                      {completedGames.analysis && " ✓"}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="atmospheric">
                    <AtmosphericEntryChallenge onComplete={() => handleGameComplete("atmospheric")} />
                  </TabsContent>

                  <TabsContent value="parachute">
                    <ParachuteDeploymentGame onComplete={() => handleGameComplete("parachute")} />
                  </TabsContent>

                  <TabsContent value="landing">
                    <LandingControlChallenge onComplete={() => handleGameComplete("landing")} />
                  </TabsContent>

                  <TabsContent value="analysis">
                    <PlanetaryAnalysisChallenge onComplete={() => handleGameComplete("analysis")} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-blue-900/30 text-white border-blue-700/50">
              <CardHeader>
                <CardTitle>Landing Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Mission Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Atmospheric Entry</span>
                      <span>{completedGames.atmospheric ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Parachute Deployment</span>
                      <span>{completedGames.parachute ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Landing Control</span>
                      <span>{completedGames.landing ? "✓" : "Pending"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planetary Analysis</span>
                      <span>{completedGames.analysis ? "✓" : "Pending"}</span>
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