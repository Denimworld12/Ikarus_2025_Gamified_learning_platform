"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface LandingControlChallengeProps {
  onComplete: () => void
}

export default function LandingControlChallenge({ onComplete }: LandingControlChallengeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [code, setCode] = useState(
    `function landing_sequence(altitude, velocity) {
  // Write your landing control code here
  // Example:
  if (altitude < 1000 && velocity > 50) {
    return "FIRE_THRUSTERS";
  } else if (altitude < 100 && velocity > 10) {
    return "DEPLOY_LANDING_GEAR";
  }
  return "MONITOR";
}`,
  )
  const [output, setOutput] = useState("")
  const [running, setRunning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [lander, setLander] = useState({
    altitude: 500, // Reduced initial altitude for simpler gameplay
    velocity: 30, // Reduced initial velocity
    fuel: 100,
    landingGearDeployed: false,
    thrustersActive: false,
  })

  // Constants
  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 400
  const GRAVITY = 1.0 // Reduced gravity for easier control
  const THRUST_POWER = 2.0
  const SAFE_LANDING_VELOCITY = 5

  // Create refs to track state without triggering re-renders
  const landerRef = useRef(lander)
  const successRef = useRef(success)
  const failedRef = useRef(failed)
  const outputRef = useRef(output)
  const codeRef = useRef(code)

  // Update refs when state changes
  useEffect(() => {
    landerRef.current = lander
    successRef.current = success
    failedRef.current = failed
    outputRef.current = output
    codeRef.current = code
  }, [lander, success, failed, output, code])

  const resetSimulation = () => {
    setLander({
      altitude: 500,
      velocity: 30,
      fuel: 100,
      landingGearDeployed: false,
      thrustersActive: false,
    })
    setOutput("")
    setRunning(false)
    setSuccess(false)
    setFailed(false)
  }

  const runCode = () => {
    resetSimulation()
    setRunning(true)
  }

  useEffect(() => {
    if (!running || success || failed) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw sky
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, "#000428")
      gradient.addColorStop(1, "#004e92")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Draw stars
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = "white"
        ctx.beginPath()
        ctx.arc(Math.random() * CANVAS_WIDTH, Math.random() * CANVAS_HEIGHT, Math.random() * 1.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw ground
      ctx.fillStyle = "#666"
      ctx.fillRect(0, CANVAS_HEIGHT - 30, CANVAS_WIDTH, 30)

      // Draw landing pad
      ctx.fillStyle = "#999"
      ctx.fillRect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT - 30, 100, 5)

      // Calculate lander position
      const y = CANVAS_HEIGHT - 30 - landerRef.current.altitude / 10

      // Draw lander
      ctx.save()
      ctx.translate(CANVAS_WIDTH / 2, y)

      // Draw thrusters if active
      if (landerRef.current.thrustersActive && landerRef.current.fuel > 0) {
        ctx.beginPath()
        ctx.moveTo(-10, 15)
        ctx.lineTo(0, 30 + Math.random() * 10)
        ctx.lineTo(10, 15)
        ctx.closePath()
        ctx.fillStyle = "orange"
        ctx.fill()
      }

      // Draw lander body
      ctx.beginPath()
      ctx.moveTo(0, -15)
      ctx.lineTo(15, 15)
      ctx.lineTo(-15, 15)
      ctx.closePath()
      ctx.fillStyle = "silver"
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw landing gear if deployed
      if (landerRef.current.landingGearDeployed) {
        ctx.beginPath()
        ctx.moveTo(-15, 15)
        ctx.lineTo(-20, 25)
        ctx.moveTo(15, 15)
        ctx.lineTo(20, 25)
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.restore()

      // Draw telemetry
      ctx.fillStyle = "white"
      ctx.font = "14px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`Altitude: ${Math.round(landerRef.current.altitude)} m`, 20, 30)
      ctx.fillText(`Velocity: ${Math.round(landerRef.current.velocity)} m/s`, 20, 50)
      ctx.fillText(`Fuel: ${Math.round(landerRef.current.fuel)}%`, 20, 70)
      ctx.fillText(`Thrusters: ${landerRef.current.thrustersActive ? "ACTIVE" : "INACTIVE"}`, 20, 90)
      ctx.fillText(`Landing Gear: ${landerRef.current.landingGearDeployed ? "DEPLOYED" : "RETRACTED"}`, 20, 110)

      // Run user code
      try {
        // Create a safe function from user code
        const userFunction = new Function(
          "altitude",
          "velocity",
          `
          ${codeRef.current}
          return landing_sequence(altitude, velocity);
        `,
        )

        const command = userFunction(landerRef.current.altitude, landerRef.current.velocity)

        // Process command
        let newThrustersActive = landerRef.current.thrustersActive
        let newLandingGearDeployed = landerRef.current.landingGearDeployed
        let newFuel = landerRef.current.fuel

        if (command === "FIRE_THRUSTERS" && landerRef.current.fuel > 0) {
          newThrustersActive = true
          newFuel = Math.max(0, landerRef.current.fuel - 1)
        } else {
          newThrustersActive = false
        }

        if (command === "DEPLOY_LANDING_GEAR") {
          newLandingGearDeployed = true
        }

        // Log output
        const newOutput =
          outputRef.current +
          `Altitude: ${Math.round(landerRef.current.altitude)}m, Velocity: ${Math.round(landerRef.current.velocity)}m/s, Command: ${command}\n`
        setOutput(newOutput)

        // Update lander state
        const acceleration = GRAVITY - (newThrustersActive && newFuel > 0 ? THRUST_POWER : 0)
        const newVelocity = landerRef.current.velocity + acceleration * 0.1
        const newAltitude = Math.max(0, landerRef.current.altitude - newVelocity * 0.1)

        // Update lander state
        setLander({
          altitude: newAltitude,
          velocity: newVelocity,
          fuel: newFuel,
          landingGearDeployed: newLandingGearDeployed,
          thrustersActive: newThrustersActive,
        })

        // Check if landed
        if (newAltitude <= 0) {
          setRunning(false)

          if (newVelocity <= SAFE_LANDING_VELOCITY && newLandingGearDeployed) {
            setSuccess(true)
            const successOutput = outputRef.current + "\nLanding successful! Safe touchdown achieved."
            setOutput(successOutput)
            setTimeout(() => {
              onComplete()
            }, 1500)
          } else {
            setFailed(true)
            let failureOutput = outputRef.current
            if (!newLandingGearDeployed) {
              failureOutput += "\nCrash! Landing gear was not deployed."
            } else {
              failureOutput += `\nCrash! Landing velocity too high: ${Math.round(newVelocity)} m/s`
            }
            setOutput(failureOutput)
          }
          return
        }
      } catch (error) {
        const errorOutput = outputRef.current + `Error: ${error}\n`
        setOutput(errorOutput)
        setRunning(false)
        setFailed(true)
        return
      }

      // Continue game loop if still running
      if (!successRef.current && !failedRef.current) {
        setTimeout(gameLoop, 100)
      }
    }

    // Start the game loop
    const timeoutId = setTimeout(gameLoop, 100)
    return () => clearTimeout(timeoutId)
  }, [running, onComplete])

  return (
    <div className="flex flex-col p-4 text-white">
      <h2 className="text-2xl mb-4">Landing Control Challenge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-lg mb-2">Python Control Script</h3>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono h-[300px] bg-blue-900/30 text-blue-100 border-blue-700"
            disabled={running}
          />
          <div className="flex gap-2 mt-2">
            <Button onClick={runCode} disabled={running} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Run Simulation
            </Button>
            <Button
              variant="outline"
              onClick={resetSimulation}
              className="flex-1 bg-blue-800/50 hover:bg-blue-700 text-white border-blue-500"
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-blue-900/30 border-blue-700">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-2 border-blue-600 w-full"
              />
            </CardContent>
          </Card>

          <div className="bg-blue-900/30 p-2 rounded-md h-[150px] overflow-y-auto font-mono text-sm text-blue-100 border border-blue-700">
            <pre>{output}</pre>
          </div>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-900/50 rounded-md text-center mb-4">
          <h3 className="text-xl font-bold text-green-400">Landing Successful!</h3>
          <p>Your code safely landed the spacecraft.</p>
        </div>
      )}

      {failed && (
        <div className="p-4 bg-red-900/50 rounded-md text-center mb-4">
          <h3 className="text-xl font-bold text-red-400">Landing Failed</h3>
          <p>Check the output log for details on what went wrong.</p>
        </div>
      )}

      <div className="text-sm text-blue-300">
        <p>Write a Python function to control the landing sequence.</p>
        <p>Your function should return one of these commands:</p>
        <ul className="list-disc list-inside ml-4">
          <li>"FIRE_THRUSTERS" - Slow your descent (uses fuel)</li>
          <li>"DEPLOY_LANDING_GEAR" - Prepare for touchdown</li>
          <li>"MONITOR" - No action</li>
        </ul>
        <p className="mt-2">Safe landing requires:</p>
        <ul className="list-disc list-inside ml-4">
          <li>Velocity less than {SAFE_LANDING_VELOCITY} m/s at touchdown</li>
          <li>Landing gear deployed</li>
        </ul>
      </div>
    </div>
  )
}

