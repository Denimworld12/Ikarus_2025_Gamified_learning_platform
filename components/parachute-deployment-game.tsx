"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ParachuteDeploymentGameProps {
  onComplete: () => void
}

export default function ParachuteDeploymentGame({ onComplete }: ParachuteDeploymentGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [altitude, setAltitude] = useState(5000)
  const [velocity, setVelocity] = useState(100)
  const [parachuteDeployed, setParachuteDeployed] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")

  // Constants
  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 600
  const GRAVITY = 9.8
  const AIR_DENSITY = 0.8
  const PARACHUTE_DRAG = 20
  const SPACECRAFT_DRAG = 0.5
  const SAFE_LANDING_VELOCITY = 10
  const GROUND_LEVEL = 50

  // Create refs to track state without triggering re-renders
  const altitudeRef = useRef(altitude)
  const velocityRef = useRef(velocity)
  const parachuteDeployedRef = useRef(parachuteDeployed)
  const gameOverRef = useRef(gameOver)
  const successRef = useRef(success)

  useEffect(() => {
    altitudeRef.current = altitude
  }, [altitude])

  useEffect(() => {
    velocityRef.current = velocity
  }, [velocity])

  useEffect(() => {
    parachuteDeployedRef.current = parachuteDeployed
  }, [parachuteDeployed])

  useEffect(() => {
    gameOverRef.current = gameOver
  }, [gameOver])

  useEffect(() => {
    successRef.current = success
  }, [success])

  const resetGame = () => {
    setAltitude(5000)
    setVelocity(100)
    setParachuteDeployed(false)
    setGameStarted(false)
    setGameOver(false)
    setSuccess(false)
    setMessage("")
  }

  const startGame = () => {
    setGameStarted(true)
  }

  const deployParachute = () => {
    if (!gameStarted || gameOver || parachuteDeployed) return
    setParachuteDeployed(true)
  }

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      if (gameOverRef.current) return

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, "#000033")
      gradient.addColorStop(0.5, "#0066cc")
      gradient.addColorStop(1, "#99ccff")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw ground
      ctx.fillStyle = "#663300"
      ctx.fillRect(0, CANVAS_HEIGHT - GROUND_LEVEL, CANVAS_WIDTH, GROUND_LEVEL)

      // Calculate spacecraft position based on altitude
      const maxAltitude = 5000
      const minY = 50
      const maxY = CANVAS_HEIGHT - GROUND_LEVEL - 30
      const y = maxY - (altitudeRef.current / maxAltitude) * (maxY - minY)

      // Draw spacecraft
      ctx.save()
      ctx.translate(CANVAS_WIDTH / 2, y)

      // Draw parachute if deployed
      if (parachuteDeployedRef.current) {
        ctx.beginPath()
        ctx.moveTo(0, -30)
        ctx.bezierCurveTo(-40, -80, -60, -60, -50, -30)
        ctx.lineTo(0, -30)
        ctx.bezierCurveTo(40, -80, 60, -60, 50, -30)
        ctx.closePath()
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw strings
        ctx.beginPath()
        ctx.moveTo(-50, -30)
        ctx.lineTo(-10, 0)
        ctx.moveTo(50, -30)
        ctx.lineTo(10, 0)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw capsule
      ctx.beginPath()
      ctx.moveTo(0, -15)
      ctx.lineTo(15, 0)
      ctx.lineTo(15, 15)
      ctx.lineTo(-15, 15)
      ctx.lineTo(-15, 0)
      ctx.closePath()
      ctx.fillStyle = "silver"
      ctx.fill()
      ctx.strokeStyle = "black"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()

      // Draw altitude and velocity
      ctx.fillStyle = "white"
      ctx.font = "16px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Altitude: ${Math.round(altitudeRef.current)} m`, 20, 30)
      ctx.fillText(`Velocity: ${Math.round(velocityRef.current)} m/s`, 20, 60)
      ctx.fillText(`Parachute: ${parachuteDeployedRef.current ? "Deployed" : "Not Deployed"}`, 20, 90)

      // Update altitude and velocity
      const drag = parachuteDeployedRef.current ? PARACHUTE_DRAG : SPACECRAFT_DRAG
      const acceleration = GRAVITY - (drag * AIR_DENSITY * (velocityRef.current * velocityRef.current)) / 1000

      const newVelocity = velocityRef.current + acceleration * 0.1
      const newAltitude = Math.max(0, altitudeRef.current - newVelocity * 0.1)

      // Update state less frequently to avoid re-renders
      setVelocity(newVelocity)
      setAltitude(newAltitude)

      // Check if landed
      if (newAltitude <= 0) {
        setAltitude(0)
        setGameOver(true)

        if (newVelocity <= SAFE_LANDING_VELOCITY) {
          setSuccess(true)
          setMessage("Successful landing! Your velocity was within safe limits.")
          setTimeout(() => {
            onComplete()
          }, 1500)
        } else {
          setMessage(`Landing too hard! Impact velocity: ${Math.round(newVelocity)} m/s`)
        }
        return
      }

      // Check if parachute deployed too early (drift risk)
      if (parachuteDeployedRef.current && newAltitude > 3000) {
        setMessage("Warning: Deploying parachute at high altitude increases drift risk!")
      }
    }

    const intervalId = setInterval(gameLoop, 50)
    return () => clearInterval(intervalId)
  }, [gameStarted, gameOver, onComplete])

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-2xl mb-4">Parachute Deployment Challenge</h2>

      <Card className="bg-black border-gray-700 mb-4">
        <CardContent className="p-0">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2 border-gray-600" />
        </CardContent>
      </Card>

      {message && (
        <div className={`p-4 ${success ? "bg-green-900/50" : "bg-yellow-900/50"} rounded-md text-center mb-4 w-full`}>
          <p>{message}</p>
        </div>
      )}

      {!gameStarted && (
        <div className="w-full space-y-4 mb-4">
          <p className="text-center">
            Deploy your parachute at the right altitude to ensure a safe landing. Too high = risk of drift. Too low =
            insufficient deceleration.
          </p>
          <Button onClick={startGame} className="w-full">
            Start Descent
          </Button>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div className="w-full space-y-4 mb-4">
          <Button onClick={deployParachute} disabled={parachuteDeployed} className="w-full">
            Deploy Parachute
          </Button>
        </div>
      )}

      {gameOver && (
        <Button variant="outline" onClick={resetGame} className="mb-4">
          Try Again
        </Button>
      )}

      <div className="text-sm text-gray-400">
        <p>Ideal deployment altitude depends on air density and descent velocity.</p>
        <p>Safe landing velocity: less than {SAFE_LANDING_VELOCITY} m/s</p>
      </div>
    </div>
  )
}

