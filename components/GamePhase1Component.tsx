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

interface GamePhase1ComponentProps {
  onComplete: () => void
}

export default function GamePhase1Component({ onComplete }: GamePhase1ComponentProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [playerName, setPlayerName] = useState<string>("")
  const totalQuestions = questions.phase1.length

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load player name from localStorage
  useEffect(() => {
    if (!mounted) return

    const name = getLocalStorage<string>("playerName")
    if (name) {
      setPlayerName(name)
    } else {
      router.push("/login")
    }
  }, [mounted, router])

  // Load game progress from localStorage
  useEffect(() => {
    if (!mounted) return

    const savedPosition = getLocalStorage<number>("phase1Position")
    const savedQuestion = getLocalStorage<number>("phase1Question")
    const savedProgress = getLocalStorage<number>("phase1Progress")

    if (savedPosition !== null) setCurrentPosition(savedPosition)
    if (savedQuestion !== null) setCurrentQuestion(savedQuestion)
    if (savedProgress !== null) setProgress(savedProgress)
  }, [mounted])

  // Save game progress to localStorage
  useEffect(() => {
    if (!mounted) return

    setLocalStorage("phase1Position", currentPosition)
    setLocalStorage("phase1Question", currentQuestion)
    setLocalStorage("phase1Progress", progress)
  }, [currentPosition, currentQuestion, progress, mounted])

  // Handle checkpoint reached
  const handleCheckpointReached = (position: number) => {
    if (position > currentPosition) {
      setCurrentPosition(position)
      setProgress((position / totalQuestions) * 100)
      setShowQuestion(true)
    }
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setShowQuestion(false)
      setCurrentQuestion((prev) => prev + 1)
      if (currentQuestion >= totalQuestions - 1) {
        onComplete()
      }
    } else {
      setShowChatbot(true)
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    setCurrentQuestion((prev) => prev + 1)
  }

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading game...</div>
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