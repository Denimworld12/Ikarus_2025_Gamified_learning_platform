"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FuelOptimizationGameProps {
  onComplete: () => void
}

interface BurnRecord {
  fuel: number
  efficiency: string
  distance: string
}

export default function FuelOptimizationGame({ onComplete }: FuelOptimizationGameProps) {
  // Game state variables
  const [fuel, setFuel] = useState(1000)
  const [distance, setDistance] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [burnHistory, setBurnHistory] = useState<BurnRecord[]>([])
  const [totalScore, setTotalScore] = useState(0)
  const [targetReached, setTargetReached] = useState(false)

  // Configuration parameters
  const MAX_FUEL = 1000
  const BURN_EFFICIENCY_RANGE = [1, 3]
  const DIFFICULTY_MULTIPLIER = 1.2
  const TARGET_DISTANCE = 5000

  // Burn action with randomized efficiency
  const performBurn = (burnAmount: number) => {
    if (fuel < burnAmount || gameOver) return

    const efficiencyFactor =
      Math.random() * (BURN_EFFICIENCY_RANGE[1] - BURN_EFFICIENCY_RANGE[0]) + BURN_EFFICIENCY_RANGE[0]

    const distanceTraveled = burnAmount * efficiencyFactor

    setFuel((prevFuel) => prevFuel - burnAmount)
    setDistance((prevDistance) => prevDistance + distanceTraveled)

    setBurnHistory((prev) => [
      ...prev,
      {
        fuel: burnAmount,
        efficiency: efficiencyFactor.toFixed(2),
        distance: distanceTraveled.toFixed(2),
      },
    ])

    // Randomly increase difficulty
    if (Math.random() < 0.3) {
      setFuel((prevFuel) => prevFuel * (1 - Math.random() * 0.1))
    }

    // Check if target reached
    if (distance + distanceTraveled >= TARGET_DISTANCE) {
      setTargetReached(true)
      endGame()
    } else if (fuel - burnAmount <= 0) {
      endGame()
    }
  }

  const endGame = () => {
    setGameOver(true)
    setTotalScore(Math.floor(distance * DIFFICULTY_MULTIPLIER))

    if (targetReached) {
      setTimeout(() => {
        onComplete()
      }, 2000)
    }
  }

  const resetGame = () => {
    setFuel(MAX_FUEL)
    setDistance(0)
    setGameOver(false)
    setBurnHistory([])
    setTotalScore(0)
    setTargetReached(false)
  }

  return (
    <Card className="bg-blue-900/50 border-blue-700 text-white">
      <CardHeader>
        <CardTitle>Spacecraft Fuel Optimization Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <strong>Fuel Remaining:</strong> {fuel.toFixed(2)} units
            </div>
            <div>
              <strong>Distance:</strong> {distance.toFixed(2)} / {TARGET_DISTANCE} km
            </div>
          </div>

          <div className="w-full bg-blue-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${Math.min(100, (distance / TARGET_DISTANCE) * 100)}%` }}
            ></div>
          </div>

          {!gameOver ? (
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 200].map((burnAmount) => (
                <Button
                  key={burnAmount}
                  onClick={() => performBurn(burnAmount)}
                  disabled={fuel < burnAmount}
                  variant="outline"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                >
                  Burn {burnAmount}
                </Button>
              ))}
            </div>
          ) : (
            <AlertDialog open={gameOver}>
              <AlertDialogContent className="bg-blue-900 text-white border border-blue-700">
                <AlertDialogHeader>
                  <AlertDialogTitle>{targetReached ? "Mission Complete!" : "Out of Fuel!"}</AlertDialogTitle>
                  <AlertDialogDescription className="text-blue-300">
                    {targetReached
                      ? `Congratulations! You reached the target distance of ${TARGET_DISTANCE} km.`
                      : `You ran out of fuel after traveling ${distance.toFixed(2)} km.`}
                    <br />
                    Total Score: {totalScore}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction asChild>
                    <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Play Again
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="mt-4">
            <h3 className="font-bold mb-2">Burn History</h3>
            <div className="max-h-40 overflow-y-auto border border-blue-700 rounded p-2">
              {burnHistory.length === 0 ? (
                <p className="text-blue-300 text-sm">No burns recorded yet</p>
              ) : (
                burnHistory.map((burn, index) => (
                  <div key={index} className="text-sm">
                    Burn: {burn.fuel} | Efficiency: {burn.efficiency} | Distance: {burn.distance} km
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-blue-300">
          Optimize your fuel burns to reach {TARGET_DISTANCE} km with limited fuel!
        </p>
      </CardFooter>
    </Card>
  )
}

