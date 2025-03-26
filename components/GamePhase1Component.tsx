"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, SkipForward } from "lucide-react"
import GameMap from "@/components/game-map"
import QuestionCard from "@/components/question-card"
import ChatbotModal from "@/components/chatbot-modal"
import { questions } from "@/lib/questions"
import SkipDialog from "@/components/skip-dialog"
import ProfileIcon from "@/components/profile-icon"
import { getLocalStorage, setLocalStorage } from "@/lib/storage"

export default function GamePhase1Component() {
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [playerName, setPlayerName] = useState("Explorer")
  const totalQuestions = questions.phase1.length

  // Handle hydration
  useEffect(() => {
    setHydrated(true)
  }, [])

  // Load saved state from localStorage
  useEffect(() => {
    if (!hydrated) return

    const savedPosition = getLocalStorage('phase1Position', 0)
    const savedProgress = getLocalStorage('phase1Progress', 0)
    const savedName = getLocalStorage('playerName', 'Explorer')

    setCurrentPosition(savedPosition)
    setProgress(savedProgress)
    setPlayerName(savedName)
  }, [hydrated])

  // Save progress to localStorage
  useEffect(() => {
    if (!hydrated) return

    setLocalStorage('phase1Position', currentPosition)
    setLocalStorage('phase1Progress', progress)
  }, [currentPosition, progress, hydrated])

  // Handle checkpoint reached
  const handleCheckpointReached = (position: number) => {
    setCurrentPosition(position)
    setProgress((position / totalQuestions) * 100)
    setShowQuestion(true)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setShowQuestion(false)

      if (currentQuestion + 1 >= totalQuestions) {
        setTimeout(() => {
          router.push("/game/phase1-complete")
        }, 2000)
      }
    } else {
      setShowChatbot(true)
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    router.push("/game/phase1-complete")
  }

  // Don't render until hydration is complete
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Phase 1: Journey to the Launchpad</h1>
            <div className="flex items-center gap-4">
              <div className="text-white font-bold">{playerName}</div>
              <ProfileIcon />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Progress value={progress} className="h-2" />
            <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GameMap
              currentPosition={currentPosition}
              totalPositions={totalQuestions}
              onCheckpointReached={handleCheckpointReached}
            />
          </div>

          <div className="space-y-4">
            {showQuestion && <QuestionCard question={questions.phase1[currentQuestion]} onAnswer={handleAnswer} />}

            <Card className="p-4 bg-blue-800/30 border border-blue-500/30">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                onClick={() => setShowChatbot(true)}
              >
                <MessageCircle size={18} />
                Ask Icarus for help
              </Button>
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
        <ChatbotModal
          isOpen={showChatbot}
          onClose={() => setShowChatbot(false)}
          currentSubject={questions.phase1[currentQuestion].subject}
        />
      )}

      <SkipDialog isOpen={showSkipDialog} onClose={() => setShowSkipDialog(false)} onConfirm={confirmSkip} />
    </div>
  )
} 