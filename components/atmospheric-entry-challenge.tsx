"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface AtmosphericEntryChallengeProps {
  onComplete: () => void
}

export default function AtmosphericEntryChallenge({ onComplete }: AtmosphericEntryChallengeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(25)
  const [launched, setLaunched] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [failureReason, setFailureReason] = useState("")
  const [spacecraft, setSpacecraft] = useState({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    heat: 0,
    trail: [] as { x: number; y: number }[],
  })

  // Constants - simplified for better gameplay
  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 400
  const PLANET_RADIUS = 150
  const SPACECRAFT_SIZE = 10
  const IDEAL_ANGLE_MIN = 20
  const IDEAL_ANGLE_MAX = 30

  const resetSimulation = () => {
    setSpacecraft({
      x: 50,
      y: 50,
      vx: 2, // Reduced initial velocity
      vy: 0,
      angle: 0,
      heat: 0,
      trail: [],
    })
    setLaunched(false)
    setSuccess(false)
    setFailed(false)
    setFailureReason("")
  }

  useEffect(() => {
    resetSimulation()
  }, [])

  const startEntry = () => {
    if (launched) return

    setSpacecraft((prev) => ({
      ...prev,
      angle: angle,
    }))

    setLaunched(true)
  }

  useEffect(() => {
    if (!launched || success || failed) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const planetX = CANVAS_WIDTH / 2
    const planetY = CANVAS_HEIGHT + PLANET_RADIUS - 100

    // Animation frame ID for cleanup
    let animationFrameId: number

    const animate = () => {
      if (success || failed) return

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw space background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, "#000428")
      gradient.addColorStop(1, "#004e92")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw stars
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random() * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw planet atmosphere
      ctx.beginPath()
      ctx.arc(planetX, planetY, PLANET_RADIUS + 50, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(100, 150, 255, 0.2)"
      ctx.fill()

      // Draw planet
      ctx.beginPath()
      ctx.arc(planetX, planetY, PLANET_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(50, 100, 200, 1)"
      ctx.fill()

      // Draw spacecraft trail
      if (spacecraft.trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(spacecraft.trail[0].x, spacecraft.trail[0].y)
        for (let i = 1; i < spacecraft.trail.length; i++) {
          ctx.lineTo(spacecraft.trail[i].x, spacecraft.trail[i].y)
        }
        ctx.strokeStyle = spacecraft.heat > 70 ? "rgba(255, 100, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw spacecraft with heat indicator
      ctx.save()
      ctx.translate(spacecraft.x, spacecraft.y)
      ctx.rotate((spacecraft.angle * Math.PI) / 180)

      // Heat shield
      ctx.beginPath()
      ctx.moveTo(-SPACECRAFT_SIZE, SPACECRAFT_SIZE)
      ctx.lineTo(SPACECRAFT_SIZE, SPACECRAFT_SIZE)
      ctx.lineTo(0, -SPACECRAFT_SIZE)
      ctx.closePath()

      // Color based on heat
      if (spacecraft.heat > 90) {
        ctx.fillStyle = "red"
      } else if (spacecraft.heat > 70) {
        ctx.fillStyle = "orange"
      } else if (spacecraft.heat > 50) {
        ctx.fillStyle = "yellow"
      } else {
        ctx.fillStyle = "white"
      }

      ctx.fill()
      ctx.restore()

      // Update spacecraft position
      // Calculate distance to planet center
      const dx = planetX - spacecraft.x
      const dy = planetY - spacecraft.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Check if spacecraft is in atmosphere
      const inAtmosphere = distance < PLANET_RADIUS + 50

      // Calculate new position
      let newVx = spacecraft.vx
      let newVy = spacecraft.vy
      let newHeat = spacecraft.heat

      if (inAtmosphere) {
        // Apply gravity and atmospheric effects - simplified for better gameplay
        const gravity = 0.05
        newVy += gravity

        // Calculate heat based on angle and speed
        const speed = Math.sqrt(newVx * newVx + newVy * newVy)

        // Too steep = more heat
        if (spacecraft.angle < IDEAL_ANGLE_MIN) {
          newHeat += (IDEAL_ANGLE_MIN - spacecraft.angle) * 0.3 + speed * 0.3
        }
        // Too shallow = skip off atmosphere
        else if (spacecraft.angle > IDEAL_ANGLE_MAX && spacecraft.y < 200) {
          newVx *= 1.01
          newVy *= 0.9
        }
        // Just right = gradual descent
        else {
          newHeat += speed * 0.1
        }

        // Apply atmospheric drag
        newVx *= 0.99
        newVy *= 0.99
      }

      const newX = spacecraft.x + newVx
      const newY = spacecraft.y + newVy

      // Update trail
      const newTrail = [...spacecraft.trail]
      if (newTrail.length > 100) {
        newTrail.shift()
      }
      newTrail.push({ x: newX, y: newY })

      // Check failure conditions
      if (newHeat > 100) {
        setFailed(true)
        setFailureReason("Your spacecraft burned up in the atmosphere!")
        return
      }

      // Check if spacecraft hit the planet
      if (distance < PLANET_RADIUS) {
        setFailed(true)
        setFailureReason("Your spacecraft crashed into the planet!")
        return
      }

      // Check if spacecraft is out of bounds
      if (newX < 0 || newX > CANVAS_WIDTH || newY > CANVAS_HEIGHT) {
        setFailed(true)
        setFailureReason("Your spacecraft went off course!")
        return
      }

      // Check success condition - stable descent through atmosphere
      // Simplified success condition for better gameplay
      if (inAtmosphere && newY > 300 && newHeat < 90 && Math.abs(newVx) < 2 && Math.abs(newVy) < 3) {
        setSuccess(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
        return
      }

      // Update spacecraft state
      setSpacecraft({
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        heat: newHeat,
        angle: spacecraft.angle,
        trail: newTrail,
      })

      // Continue animation if game is still active
      if (!success && !failed) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [launched, success, failed, spacecraft, onComplete, angle])

  // Add a simple auto-play option for easier testing
  const autoPlay = () => {
    setAngle(25) // Set to ideal angle
    setTimeout(() => {
      startEntry()
    }, 500)
  }

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-2xl mb-4">Atmospheric Entry Challenge</h2>

      <Card className="bg-blue-900/30 border-blue-700 mb-4">
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border-2 border-blue-600 w-full"
          />
        </CardContent>
      </Card>

      {success && (
        <div className="p-4 bg-green-900/50 rounded-md text-center mb-4 w-full">
          <h3 className="text-xl font-bold text-green-400">Successful Atmospheric Entry!</h3>
          <p>You've safely entered the planet's atmosphere.</p>
        </div>
      )}

      {failed && (
        <div className="p-4 bg-red-900/50 rounded-md text-center mb-4 w-full">
          <h3 className="text-xl font-bold text-red-400">Entry Failed</h3>
          <p>{failureReason}</p>
          <Button
            variant="outline"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
            onClick={resetSimulation}
          >
            Try Again
          </Button>
        </div>
      )}

      {!launched && !success && !failed && (
        <div className="w-full space-y-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm">Entry Angle: {angle}°</label>
            <Slider value={[angle]} min={10} max={40} step={0.5} onValueChange={(value) => setAngle(value[0])} />
            <p className="text-xs text-blue-300">Tip: The ideal entry angle is between 20° and 30°</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={startEntry} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Launch Spacecraft
            </Button>
            <Button
              onClick={autoPlay}
              variant="outline"
              className="bg-blue-800/50 hover:bg-blue-700 text-white border-blue-500"
            >
              Auto-Play
            </Button>
          </div>
        </div>
      )}

      <div className="text-sm text-blue-300 mt-2">
        <p>Choose the right entry angle to safely enter the planet's atmosphere.</p>
        <p>Too steep and you'll burn up, too shallow and you'll bounce off.</p>
      </div>
    </div>
  )
}

