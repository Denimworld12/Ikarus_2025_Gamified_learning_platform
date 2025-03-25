"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AsteroidDeflectionGameProps {
  onComplete: () => void
}

interface Asteroid {
  x: number
  y: number
  radius: number
  mass: number
}

interface Vector {
  x: number
  y: number
}

export default function AsteroidDeflectionGame({ onComplete }: AsteroidDeflectionGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rocket, setRocket] = useState({
    x: 50,
    y: 50,
    vx: 0,
    vy: 0,
    fuel: 100,
  })
  const [target, setTarget] = useState({
    x: 450,
    y: 450,
  })
  const [asteroids, setAsteroids] = useState<Asteroid[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  // Constants
  const GRID_SIZE = 500
  const MAX_VELOCITY = 5
  const GRAVITY_CONSTANT = 0.1
  const FRICTION = 0.99
  const THRUST_POWER = 0.5

  const generateAsteroids = (count: number) =>
    Array.from({ length: count }, () => ({
      x: 150 + Math.random() * 200,
      y: 150 + Math.random() * 200,
      radius: 10 + Math.random() * 30,
      mass: 50 + Math.random() * 100,
    }))

  // Generate asteroids
  useEffect(() => {
    setAsteroids(generateAsteroids(5))
  }, [])

  // Utility functions
  const calculateDistance = (a: Vector, b: Vector) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

  const calculateAngle = (a: Vector, b: Vector) => Math.atan2(b.y - a.y, b.x - a.x)

  // Game loop
  useEffect(() => {
    if (gameOver || won) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      if (gameOver || won) return

      // Clear canvas
      ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE)

      // Draw background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE)

      // Draw stars
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(Math.random() * GRID_SIZE, Math.random() * GRID_SIZE, Math.random() * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw target
      ctx.beginPath()
      ctx.arc(target.x, target.y, 20, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)"
      ctx.fill()
      ctx.strokeStyle = "red"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw asteroids
      asteroids.forEach((asteroid) => {
        ctx.beginPath()
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(128, 128, 128, 0.7)"
        ctx.fill()
        ctx.strokeStyle = "gray"
        ctx.lineWidth = 2
        ctx.stroke()
      })

      // Draw rocket
      ctx.beginPath()
      ctx.arc(rocket.x, rocket.y, 10, 0, Math.PI * 2)
      ctx.fillStyle = "green"
      ctx.fill()
      ctx.strokeStyle = "lightgreen"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw velocity vector
      ctx.beginPath()
      ctx.moveTo(rocket.x, rocket.y)
      ctx.lineTo(rocket.x + rocket.vx * 10, rocket.y + rocket.vy * 10)
      ctx.strokeStyle = "yellow"
      ctx.lineWidth = 2
      ctx.stroke()

      // Asteroid gravitational effects
      let newVx = rocket.vx
      let newVy = rocket.vy

      asteroids.forEach((asteroid) => {
        const distance = calculateDistance(rocket, asteroid)
        if (distance < asteroid.radius + 10) {
          setGameOver(true)
          return
        }

        // Gravitational pull calculation
        const angle = calculateAngle(rocket, asteroid)
        const gravitationalForce = (GRAVITY_CONSTANT * asteroid.mass) / (distance * distance)

        newVx += Math.cos(angle) * gravitationalForce
        newVy += Math.sin(angle) * gravitationalForce
      })

      // Apply friction
      newVx *= FRICTION
      newVy *= FRICTION

      // Update rocket position
      const newX = rocket.x + newVx
      const newY = rocket.y + newVy

      // Check if rocket reached target
      if (calculateDistance({ x: newX, y: newY }, target) < 20) {
        setWon(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
        return
      }

      // Boundary checks
      const boundedX = Math.max(0, Math.min(GRID_SIZE, newX))
      const boundedY = Math.max(0, Math.min(GRID_SIZE, newY))

      // Update rocket state less frequently to avoid re-renders
      setRocket((prev) => ({
        ...prev,
        x: boundedX,
        y: boundedY,
        vx: newVx,
        vy: newVy,
        fuel: Math.max(0, prev.fuel - 0.1),
      }))

      if (!gameOver && !won) {
        setTimeout(gameLoop, 50)
      }
    }

    const timeoutId = setTimeout(gameLoop, 50)
    return () => clearTimeout(timeoutId)
  }, [gameOver, won, rocket, asteroids, onComplete, target])

  const applyThrust = (angle: number) => {
    if (rocket.fuel <= 0 || gameOver || won) return

    setRocket((prev) => ({
      ...prev,
      vx: prev.vx + Math.cos(angle) * THRUST_POWER,
      vy: prev.vy + Math.sin(angle) * THRUST_POWER,
      fuel: Math.max(0, prev.fuel - 1),
    }))
  }

  const resetGame = () => {
    setRocket({
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      fuel: 100,
    })
    setGameOver(false)
    setWon(false)
    setAsteroids(generateAsteroids(5))
  }

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-2xl mb-4">Asteroid Deflection Challenge</h2>

      <Card className="bg-black border-blue-700 mb-4">
        <CardContent className="p-0">
          <canvas ref={canvasRef} width={GRID_SIZE} height={GRID_SIZE} className="border-2 border-blue-600" />
        </CardContent>
      </Card>

      {gameOver && (
        <div className="p-4 bg-red-900/50 rounded-md text-center mb-4">
          <h3 className="text-xl font-bold text-red-400">Game Over!</h3>
          <p>You crashed into an asteroid.</p>
          <Button
            variant="outline"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
            onClick={resetGame}
          >
            Try Again
          </Button>
        </div>
      )}

      {won && (
        <div className="p-4 bg-green-900/50 rounded-md text-center mb-4">
          <h3 className="text-xl font-bold text-green-400">Mission Accomplished!</h3>
          <p>You successfully navigated to the target!</p>
        </div>
      )}

      {!gameOver && !won && (
        <>
          <div className="mb-4">
            <p>Fuel: {rocket.fuel.toFixed(1)}</p>
            <p>Velocity: {Math.sqrt(rocket.vx * rocket.vx + rocket.vy * rocket.vy).toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              0,
              Math.PI / 4,
              Math.PI / 2,
              (3 * Math.PI) / 4,
              Math.PI,
              (5 * Math.PI) / 4,
              (3 * Math.PI) / 2,
              (7 * Math.PI) / 4,
            ].map((angle) => (
              <Button
                key={angle}
                onClick={() => applyThrust(angle)}
                variant="outline"
                disabled={rocket.fuel <= 0}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
              >
                Thrust {((angle * 180) / Math.PI).toFixed(0)}°
              </Button>
            ))}
            <Button variant="destructive" onClick={resetGame} className="col-span-3 text-white">
              Reset
            </Button>
          </div>
        </>
      )}

      <div className="text-sm text-blue-300">
        <p>Navigate through the asteroid field to reach the red target.</p>
        <p>Be careful of gravitational pull from asteroids!</p>
      </div>
    </div>
  )
}

