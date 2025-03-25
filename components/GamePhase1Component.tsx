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

export default function GamePhase1Component() {
  const router = useRouter()
  const [currentPosition, setCurrentPosition] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [playerName, setPlayerName] = useState("Explorer")
  const totalQuestions = questions.phase1.length

  // Now safe to access localStorage because this component will only be rendered client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("playerName")
      if (storedName) {
        setPlayerName(storedName)
      }
    }
  }, [])

  // Handle checkpoint reached
  const handleCheckpointReached = (position: number) => {
    setCurrentPosition(position)
    
    // Save progress to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("phase1Position", position.toString())
      } catch (error) {
        console.error("Error saving position to localStorage:", error)
      }
    }

    // Set progress percentage based on position
    setProgress((position / totalQuestions) * 100)

    // Show question when a checkpoint is reached
    setShowQuestion(true)
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // Hide question on correct answer
      setShowQuestion(false)

      // Check if we've completed all questions
      if (currentQuestion + 1 >= totalQuestions) {
        // Phase complete animation and redirect
        setTimeout(() => {
          router.push("/game/phase1-complete")
        }, 2000)
      }
    } else {
      // Show chatbot on wrong answer
      setShowChatbot(true)
    }
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    router.push("/game/phase1-complete")
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