"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface PlanetaryAnalysisChallengeProps {
  onComplete: () => void
}

export default function PlanetaryAnalysisChallenge({ onComplete }: PlanetaryAnalysisChallengeProps) {
  const [selectedAnswers, setSelectedAnswers] = useState({
    atmosphere: "",
    temperature: "",
    water: "",
    life: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const questions = [
    {
      id: "atmosphere",
      question: "What is the composition of the planet's atmosphere?",
      options: [
        { id: "a", text: "Mostly nitrogen and oxygen, similar to Earth", isCorrect: false },
        { id: "b", text: "Primarily carbon dioxide with traces of nitrogen", isCorrect: true },
        { id: "c", text: "Hydrogen and helium, like gas giants", isCorrect: false },
        { id: "d", text: "Methane and ammonia", isCorrect: false },
      ],
    },
    {
      id: "temperature",
      question: "What is the average surface temperature of the planet?",
      options: [
        { id: "a", text: "-50°C, too cold for human survival without protection", isCorrect: false },
        { id: "b", text: "20°C, comfortable for humans", isCorrect: false },
        { id: "c", text: "150°C, dangerously hot", isCorrect: true },
        { id: "d", text: "500°C, extreme heat", isCorrect: false },
      ],
    },
    {
      id: "water",
      question: "Is there evidence of water on the planet?",
      options: [
        { id: "a", text: "No water detected", isCorrect: false },
        { id: "b", text: "Frozen water at the poles", isCorrect: true },
        { id: "c", text: "Liquid oceans covering most of the surface", isCorrect: false },
        { id: "d", text: "Water vapor in the atmosphere only", isCorrect: false },
      ],
    },
    {
      id: "life",
      question: "Is the planet suitable for human habitation?",
      options: [
        { id: "a", text: "Yes, immediately habitable", isCorrect: false },
        { id: "b", text: "No, conditions are too hostile", isCorrect: true },
        { id: "c", text: "Yes, with minimal terraforming", isCorrect: false },
        { id: "d", text: "Unknown, more data needed", isCorrect: false },
      ],
    },
  ]

  const handleSubmit = () => {
    // Check if all questions are answered
    const allAnswered = Object.values(selectedAnswers).every((answer) => answer !== "")

    if (!allAnswered) {
      alert("Please answer all questions before submitting")
      return
    }

    // Calculate score
    let newScore = 0
    questions.forEach((question) => {
      const selectedOption = question.options.find(
        (option) => option.id === selectedAnswers[question.id as keyof typeof selectedAnswers],
      )
      if (selectedOption?.isCorrect) {
        newScore++
      }
    })

    setScore(newScore)
    setSubmitted(true)

    // Complete challenge if score is high enough
    if (newScore >= 3) {
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const resetQuiz = () => {
    setSelectedAnswers({
      atmosphere: "",
      temperature: "",
      water: "",
      life: "",
    })
    setSubmitted(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col p-4 text-white">
      <h2 className="text-2xl mb-4">Planetary Analysis Challenge</h2>

      <Card className="bg-blue-900/50 border-blue-700 mb-4">
        <CardHeader>
          <CardTitle className="text-white">Analyze Planetary Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium text-white">{question.question}</h3>
                <RadioGroup
                  value={selectedAnswers[question.id as keyof typeof selectedAnswers]}
                  onValueChange={(value) =>
                    setSelectedAnswers((prev) => ({
                      ...prev,
                      [question.id]: value,
                    }))
                  }
                  disabled={submitted}
                >
                  {question.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-2 rounded-md border p-3 text-white ${
                        submitted && option.isCorrect ? "border-green-500 bg-green-900/20" : ""
                      } ${
                        submitted &&
                        selectedAnswers[question.id as keyof typeof selectedAnswers] === option.id &&
                        !option.isCorrect
                          ? "border-red-500 bg-red-900/20"
                          : ""
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                      <Label htmlFor={`${question.id}-${option.id}`} className="flex-1 cursor-pointer text-white">
                        {option.text}
                      </Label>
                      {submitted && option.isCorrect && <Check className="h-5 w-5 text-green-500" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="mt-6">
              <div className={`p-4 rounded-md ${score >= 3 ? "bg-green-900/50" : "bg-red-900/50"}`}>
                <h3 className="font-bold text-lg">{score >= 3 ? "Analysis Complete!" : "Analysis Incomplete"}</h3>
                <p className="text-white">
                  You correctly analyzed {score} out of {questions.length} planetary conditions.
                </p>
                {score >= 3 ? (
                  <p className="mt-2 text-white">
                    Your analysis confirms this planet is not suitable for immediate human habitation. Special equipment
                    and shelters will be required.
                  </p>
                ) : (
                  <p className="mt-2 text-white">
                    Your analysis contains too many errors. Please review the correct answers and try again.
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                onClick={resetQuiz}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
              >
                Restart Analysis
              </Button>
            </div>
          ) : (
            <Button onClick={handleSubmit} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">
              Submit Analysis
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

