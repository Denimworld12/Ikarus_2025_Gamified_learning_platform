"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface OrbitalMechanicsPuzzleProps {
  onComplete: () => void
}

export default function OrbitalMechanicsPuzzle({ onComplete }: OrbitalMechanicsPuzzleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(50)
  const [launched, setLaunched] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [satellite, setSatellite] = useState({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    trail: [] as { x: number; y: number }[],
  })

  // Constants
  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 600
  const PLANET_RADIUS = 50
  const GRAVITY_CONSTANT = 0.2
  const PLANET_MASS = 5000
  const ORBIT_RADIUS = 200

  // Create refs to track state without triggering re-renders
  const satelliteRef = useRef(satellite)
  const successRef = useRef(success)
  const failedRef = useRef(failed)

  const resetSimulation = () => {
    setSatellite({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2 - 100,
      vx: 0,
      vy: 0,
      trail: [],
    })
    setLaunched(false)
    setSuccess(false)
    setFailed(false)
  }

  useEffect(() => {
    resetSimulation()
  }, [])

  const launchSatellite = () => {
    if (launched) return

    const radians = (angle * Math.PI) / 180
    const velocity = power / 10

    setSatellite((prev) => ({
      ...prev,
      vx: Math.cos(radians) * velocity,
      vy: Math.sin(radians) * velocity,
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
    const planetY = CANVAS_HEIGHT / 2

    // Update refs when state changes
    satelliteRef.current = satellite
    successRef.current = success
    failedRef.current = failed

    let animationFrameId: number

    const animate = () => {
      if (successRef.current || failedRef.current) return

      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw background
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw stars
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random() * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw orbit path
      ctx.beginPath()
      ctx.arc(planetX, planetY, ORBIT_RADIUS, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(100, 100, 255, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw planet
      ctx.beginPath()
      ctx.arc(planetX, planetY, PLANET_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = "blue"
      ctx.fill()

      // Draw satellite trail
      if (satelliteRef.current.trail.length > 1) {
        ctx.beginPath()
        ctx.moveTo(satelliteRef.current.trail[0].x, satelliteRef.current.trail[0].y)
        for (let i = 1; i < satelliteRef.current.trail.length; i++) {
          ctx.lineTo(satelliteRef.current.trail[i].x, satelliteRef.current.trail[i].y)
        }
        ctx.strokeStyle = "rgba(255, 255, 0, 0.5)"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw satellite
      ctx.beginPath()
      ctx.arc(satelliteRef.current.x, satelliteRef.current.y, 5, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()

      // Update satellite position
      setSatellite((prev) => {
        // Calculate distance to planet
        const dx = planetX - prev.x
        const dy = planetY - prev.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Check if satellite crashed into planet
        if (distance < PLANET_RADIUS) {
          setFailed(true)
          failedRef.current = true
          return prev
        }

        // Check if satellite is too far away
        if (distance > CANVAS_WIDTH) {
          setFailed(true)
          failedRef.current = true
          return prev
        }

        // Check if satellite is in stable orbit
        // (distance close to ORBIT_RADIUS for a full circle)
        if (prev.trail.length > 100) {
          const isOrbit = prev.trail.every((point) => {
            const d = Math.sqrt(Math.pow(planetX - point.x, 2) + Math.pow(planetY - point.y, 2))
            return Math.abs(d - ORBIT_RADIUS) < 30
          })

          if (isOrbit) {
            setSuccess(true)
            successRef.current = true
            setTimeout(() => {
              onComplete()
            }, 1500)
            return prev
          }
        }

        // Calculate gravitational force
        const force = (GRAVITY_CONSTANT * PLANET_MASS) / (distance * distance)
        const angle = Math.atan2(dy, dx)

        // Apply force to velocity
        const newVx = prev.vx + Math.cos(angle) * force
        const newVy = prev.vy + Math.sin(angle) * force

        // Update position
        const newX = prev.x + newVx
        const newY = prev.y + newVy

        // Update trail
        const newTrail = [...prev.trail]
        if (newTrail.length > 200) {
          newTrail.shift()
        }
        newTrail.push({ x: newX, y: newY })

        return {
          ...prev,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          trail: newTrail,
        }
      })

      // Continue animation if game is still active
      if (!successRef.current && !failedRef.current) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [launched, success, failed, onComplete, satellite])

  useEffect(() => {
    satelliteRef.current = satellite
    successRef.current = success
    failedRef.current = failed
  }, [satellite, success, failed])

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <h2 className="text-2xl mb-4">Orbital Mechanics Puzzle</h2>

      <Card className="bg-black border-gray-700 mb-4">
        <CardContent className="p-0">
          <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border-2 border-gray-600" />
        </CardContent>
      </Card>

      {success && (
        <div className="p-4 bg-green-900/50 rounded-md text-center mb-4 w-full">
          <h3 className="text-xl font-bold text-green-400">Stable Orbit Achieved!</h3>
          <p>You've successfully placed the satellite in orbit.</p>
        </div>
      )}

      {failed && (
        <div className="p-4 bg-red-900/50 rounded-md text-center mb-4 w-full">
          <h3 className="text-xl font-bold text-red-400">Mission Failed</h3>
          <p>Your satellite either crashed or escaped the gravitational field.</p>
          <Button variant="outline" className="mt-2" onClick={resetSimulation}>
            Try Again
          </Button>
        </div>
      )}

      {!launched && !success && !failed && (
        <div className="w-full space-y-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm">Launch Angle: {angle}°</label>
            <Slider value={[angle]} min={0} max={360} step={1} onValueChange={(value) => setAngle(value[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Launch Power: {power}%</label>
            <Slider value={[power]} min={10} max={100} step={1} onValueChange={(value) => setPower(value[0])} />
          </div>

          <Button onClick={launchSatellite} className="w-full">
            Launch Satellite
          </Button>
        </div>
      )}

      {launched && !success && !failed && (
        <Button variant="outline" onClick={resetSimulation} className="mb-4">
          Reset Simulation
        </Button>
      )}

      <div className="text-sm text-gray-400">
        <p>Adjust the launch angle and power to achieve a stable orbit around the planet.</p>
        <p>The goal is to maintain a distance close to the blue orbit line.</p>
      </div>
    </div>
  )
}

