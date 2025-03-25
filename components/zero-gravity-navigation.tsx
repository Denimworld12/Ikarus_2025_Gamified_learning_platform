"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Flame, RotateCcw } from "lucide-react"

interface ZeroGravityNavigationProps {
  onComplete: () => void
}

export default function ZeroGravityNavigation({ onComplete }: ZeroGravityNavigationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rocketRef = useRef({
    x: 250,
    y: 250,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
    fuel: 100,
    isThrusting: false,
  })
  const targetRef = useRef({
    x: 500,
    y: 100,
    reached: false,
  })
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameStats, setGameStats] = useState({
    fuel: 100,
    velocityX: 0,
    velocityY: 0,
    rotation: 0,
  })
  const animationFrameRef = useRef<number>()

  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 600
  const THRUST_POWER = 0.5
  const ROTATION_SPEED = 3
  const FRICTION = 0.99
  const TARGET_RADIUS = 30

  // Draw the game scene
  const drawScene = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw starry background
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = "rgba(255,255,255,0.5)"
      ctx.beginPath()
      ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random(), 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw target
    ctx.beginPath()
    ctx.arc(targetRef.current.x, targetRef.current.y, TARGET_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = targetRef.current.reached ? "rgba(0, 255, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"
    ctx.fill()
    ctx.strokeStyle = targetRef.current.reached ? "green" : "red"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw target center
    ctx.beginPath()
    ctx.arc(targetRef.current.x, targetRef.current.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = targetRef.current.reached ? "green" : "red"
    ctx.fill()

    // Draw rocket
    ctx.save()
    ctx.translate(rocketRef.current.x, rocketRef.current.y)
    ctx.rotate((rocketRef.current.rotation * Math.PI) / 180)

    // Rocket body
    ctx.beginPath()
    ctx.moveTo(0, -30) // Nose
    ctx.lineTo(-15, 30) // Left wing
    ctx.lineTo(15, 30) // Right wing
    ctx.closePath()
    ctx.fillStyle = "silver"
    ctx.fill()
    ctx.strokeStyle = "gray"
    ctx.stroke()

    // Thrust flame when active
    if (rocketRef.current.isThrusting && rocketRef.current.fuel > 0) {
      ctx.beginPath()
      ctx.moveTo(0, 35)
      ctx.lineTo(-10, 50 + Math.random() * 20)
      ctx.lineTo(10, 50 + Math.random() * 20)
      ctx.closePath()
      ctx.fillStyle = `rgba(255, ${100 + Math.random() * 155}, 0, 0.8)`
      ctx.fill()
    }

    ctx.restore()

    // Draw instructions
    ctx.fillStyle = "white"
    ctx.font = "14px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Use arrow keys or buttons to navigate to the red target", 10, 20)
  }

  // Game loop
  const gameLoop = () => {
    if (gameCompleted) return

    // Update position with current velocity
    rocketRef.current.x = (rocketRef.current.x + rocketRef.current.velocityX + CANVAS_WIDTH) % CANVAS_WIDTH
    rocketRef.current.y = (rocketRef.current.y + rocketRef.current.velocityY + CANVAS_HEIGHT) % CANVAS_HEIGHT

    // Apply friction
    rocketRef.current.velocityX *= FRICTION
    rocketRef.current.velocityY *= FRICTION
    rocketRef.current.isThrusting = false

    // Check if rocket reached target
    const distance = Math.sqrt(
      Math.pow(rocketRef.current.x - targetRef.current.x, 2) + Math.pow(rocketRef.current.y - targetRef.current.y, 2),
    )

    if (distance < TARGET_RADIUS && !targetRef.current.reached) {
      targetRef.current.reached = true
      setGameCompleted(true)
      setTimeout(() => {
        onComplete()
      }, 1500)
    }

    // Update UI stats (less frequently to avoid too many renders)
    setGameStats({
      fuel: Math.round(rocketRef.current.fuel),
      velocityX: Number.parseFloat(rocketRef.current.velocityX.toFixed(2)),
      velocityY: Number.parseFloat(rocketRef.current.velocityY.toFixed(2)),
      rotation: Number.parseFloat(rocketRef.current.rotation.toFixed(2)),
    })

    // Draw the scene
    drawScene()

    // Continue the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }

  // Initialize and clean up the game loop
  useEffect(() => {
    // Start the game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop)

    // Clean up on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameCompleted])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (rocketRef.current.fuel <= 0 || gameCompleted) return

      switch (e.key) {
        case "ArrowLeft":
          rocketRef.current.rotation -= ROTATION_SPEED
          rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 0.5)
          break
        case "ArrowRight":
          rocketRef.current.rotation += ROTATION_SPEED
          rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 0.5)
          break
        case "ArrowUp":
          // More precise thrust calculation
          const radians = ((rocketRef.current.rotation - 90) * Math.PI) / 180
          rocketRef.current.velocityX += Math.cos(radians) * THRUST_POWER
          rocketRef.current.velocityY += Math.sin(radians) * THRUST_POWER
          rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 1)
          rocketRef.current.isThrusting = true
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        rocketRef.current.isThrusting = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameCompleted])

  const resetRocket = () => {
    rocketRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
      fuel: 100,
      isThrusting: false,
    }
    targetRef.current.reached = false
    setGameCompleted(false)
    setGameStats({
      fuel: 100,
      velocityX: 0,
      velocityY: 0,
      rotation: 0,
    })
  }

  const handleRotateLeft = () => {
    if (rocketRef.current.fuel <= 0 || gameCompleted) return
    rocketRef.current.rotation -= ROTATION_SPEED
    rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 0.5)
  }

  const handleRotateRight = () => {
    if (rocketRef.current.fuel <= 0 || gameCompleted) return
    rocketRef.current.rotation += ROTATION_SPEED
    rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 0.5)
  }

  const handleThrust = () => {
    if (rocketRef.current.fuel <= 0 || gameCompleted) return
    const radians = ((rocketRef.current.rotation - 90) * Math.PI) / 180
    rocketRef.current.velocityX += Math.cos(radians) * THRUST_POWER
    rocketRef.current.velocityY += Math.sin(radians) * THRUST_POWER
    rocketRef.current.fuel = Math.max(0, rocketRef.current.fuel - 1)
    rocketRef.current.isThrusting = true

    // Reset thrusting state after a short delay
    setTimeout(() => {
      rocketRef.current.isThrusting = false
    }, 100)
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-white">
      <h2 className="text-2xl mb-4">Zero-Gravity Rocket Navigation</h2>
      <Card className="bg-black border-blue-700">
        <CardContent className="p-0">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2 border-blue-600" />
        </CardContent>
      </Card>
      <div className="mt-4 flex space-x-4 text-white">
        <div>Fuel: {gameStats.fuel}%</div>
        <div>Velocity X: {gameStats.velocityX}</div>
        <div>Velocity Y: {gameStats.velocityY}</div>
        <div>Rotation: {gameStats.rotation}°</div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          onClick={handleRotateLeft}
          disabled={gameStats.fuel <= 0 || gameCompleted}
        >
          <Rocket className="h-4 w-4" /> Rotate Left
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          onClick={handleRotateRight}
          disabled={gameStats.fuel <= 0 || gameCompleted}
        >
          <Rocket className="h-4 w-4" /> Rotate Right
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
          onClick={handleThrust}
          disabled={gameStats.fuel <= 0 || gameCompleted}
        >
          <Flame className="h-4 w-4" /> Thrust
        </Button>
        <Button variant="destructive" className="flex items-center gap-1 text-white" onClick={resetRocket}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {gameCompleted && (
        <div className="mt-4 p-4 bg-green-900/50 rounded-md text-center">
          <h3 className="text-xl font-bold text-green-400">Mission Accomplished!</h3>
          <p>You've successfully navigated to the target.</p>
        </div>
      )}

      {gameStats.fuel <= 0 && !gameCompleted && (
        <div className="mt-4 p-4 bg-red-900/50 rounded-md text-center">
          <h3 className="text-xl font-bold text-red-400">Out of Fuel!</h3>
          <p>Reset the rocket to try again.</p>
        </div>
      )}
    </div>
  )
}

