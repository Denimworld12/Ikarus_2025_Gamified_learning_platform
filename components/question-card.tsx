"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle } from "lucide-react"

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: number
  subject: string
  text: string
  options: Option[]
  explanation: string
}

interface QuestionCardProps {
  question: Question
  onAnswer: (isCorrect: boolean) => void
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!selectedOption) return

    const selected = question.options.find((option) => option.id === selectedOption)
    const correct = selected?.isCorrect || false

    setIsCorrect(correct)
    setHasAnswered(true)

    // Delay to show feedback before moving on
    setTimeout(() => {
      onAnswer(correct)
      setSelectedOption(null)
      setHasAnswered(false)
    }, 2000)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">{question.subject}</span>
          {hasAnswered &&
            (isCorrect ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            ))}
        </div>
        <CardTitle className="text-xl">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
          className="space-y-3"
          disabled={hasAnswered}
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 rounded-md border p-3 ${
                hasAnswered && option.isCorrect ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""
              } ${
                hasAnswered && selectedOption === option.id && !option.isCorrect
                  ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                  : ""
              }`}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {hasAnswered && <div className="mt-4 p-3 bg-muted rounded-md text-sm">{question.explanation}</div>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!selectedOption || hasAnswered} className="w-full">
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  )
}

