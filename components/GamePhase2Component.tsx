"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageCircle, SkipForward } from "lucide-react"
import SpaceshipBuilder from "@/components/spaceship-builder"
import QuestionCard from "@/components/question-card"
import ChatbotModal from "@/components/chatbot-modal"
import { questions } from "@/lib/questions"
import SkipDialog from "@/components/skip-dialog"
import ProfileIcon from "@/components/profile-icon"
import { getLocalStorage, setLocalStorage } from "@/lib/storage"

export default function GamePhase2Component() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showQuestion, setShowQuestion] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [playerName, setPlayerName] = useState<string>("")
  const totalQuestions = questions.phase2.length + 1 // +1 for the builder itself

  // Handle mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load player name and progress from localStorage
  useEffect(() => {
    if (!mounted) return

    const name = getLocalStorage<string>("playerName")
    const savedProgress = getLocalStorage<number>("phase2Progress")

    if (name) {
      setPlayerName(name)
    } else {
      router.push("/login")
    }

    if (savedProgress !== null) {
      setProgress(savedProgress)
    }
  }, [mounted, router])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // If all questions answered correctly, show spaceship builder
      if (currentQuestion + 1 >= questions.phase2.length) {
        setShowQuestion(false)
        setShowBuilder(true)
        setProgress(80) // Show progress at 80% when builder appears
        setLocalStorage("phase2Progress", 80)
      } else {
        // Move to next question
        setCurrentQuestion(currentQuestion + 1)
        const newProgress = ((currentQuestion + 1) / totalQuestions) * 100
        setProgress(newProgress)
        setLocalStorage("phase2Progress", newProgress)
      }
    } else {
      // Show chatbot on wrong answer
      setShowChatbot(true)
    }
  }

  const handleBuilderComplete = () => {
    setProgress(100)
    setLocalStorage("phase2Progress", 100)
    setTimeout(() => {
      router.push("/game/phase3")
    }, 1500)
  }

  const handleSkip = () => {
    setShowSkipDialog(true)
  }

  const confirmSkip = () => {
    router.push("/game/phase3")
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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Phase 2: Building the Spaceship</h1>
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
            {showBuilder ? (
              <SpaceshipBuilder onComplete={handleBuilderComplete} />
            ) : (
              <div className="bg-blue-800/30 rounded-lg p-6 h-full flex items-center justify-center border border-blue-500/30">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4 text-white">Spaceship Laboratory</h2>
                  <p className="text-blue-100">
                    Answer the questions correctly to collect materials and build your spaceship.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {showQuestion && <QuestionCard question={questions.phase2[currentQuestion]} onAnswer={handleAnswer} />}

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
          currentSubject={showQuestion ? questions.phase2[currentQuestion].subject : "engineering"}
        />
      )}

      <SkipDialog isOpen={showSkipDialog} onClose={() => setShowSkipDialog(false)} onConfirm={confirmSkip} />
    </div>
  )
} 