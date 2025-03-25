"use client"

import { useEffect, useRef, useState } from "react"
import { useKeyPress } from "@/hooks/use-key-press"

interface GameMapProps {
  currentPosition: number
  totalPositions: number
  onCheckpointReached: (position: number) => void
}

export default function GameMap({ currentPosition, totalPositions, onCheckpointReached }: GameMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 200 })
  const [checkpoints, setCheckpoints] = useState<{ x: number; y: number; reached: boolean }[]>([])
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)

  // Character movement with arrow keys
  const leftPressed = useKeyPress("ArrowLeft")
  const rightPressed = useKeyPress("ArrowRight")
  const upPressed = useKeyPress("ArrowUp")
  const downPressed = useKeyPress("ArrowDown")

  // Initialize checkpoints
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.width
    const height = canvas.height

    // Create checkpoints along the path
    const newCheckpoints = []
    for (let i = 0; i < totalPositions; i++) {
      const x = 100 + i * ((width - 200) / (totalPositions - 1))
      const y = 200 + Math.sin(i * 0.8) * 80
      newCheckpoints.push({ x, y, reached: i < currentPosition })
    }
    setCheckpoints(newCheckpoints)

    // Set initial player position at the first checkpoint or current checkpoint
    if (newCheckpoints.length > 0) {
      const startPos = newCheckpoints[currentPosition] || newCheckpoints[0]
      setPlayerPosition({ x: startPos.x, y: startPos.y })
    }
  }, [totalPositions, currentPosition])

  // Handle player movement
  useEffect(() => {
    const moveSpeed = 5

    if (leftPressed) {
      setPlayerPosition((prev) => ({ ...prev, x: Math.max(30, prev.x - moveSpeed) }))
    }
    if (rightPressed) {
      setPlayerPosition((prev) => ({ ...prev, x: Math.min(canvasRef.current?.width || 800 - 30, prev.x + moveSpeed) }))
    }
    if (upPressed) {
      setPlayerPosition((prev) => ({ ...prev, y: Math.max(30, prev.y - moveSpeed) }))
    }
    if (downPressed) {
      setPlayerPosition((prev) => ({ ...prev, y: Math.min(canvasRef.current?.height || 400 - 30, prev.y + moveSpeed) }))
    }

    // Check if player reached a checkpoint
    checkpoints.forEach((checkpoint, index) => {
      if (!checkpoint.reached) {
        const distance = Math.sqrt(
          Math.pow(playerPosition.x - checkpoint.x, 2) + Math.pow(playerPosition.y - checkpoint.y, 2),
        )

        if (distance < 30) {
          // Mark checkpoint as reached
          const updatedCheckpoints = [...checkpoints]
          updatedCheckpoints[index].reached = true
          setCheckpoints(updatedCheckpoints)

          // Update current checkpoint
          if (index > currentCheckpoint) {
            setCurrentCheckpoint(index)
            onCheckpointReached(index)
          }
        }
      }
    })
  }, [
    leftPressed,
    rightPressed,
    upPressed,
    downPressed,
    playerPosition,
    checkpoints,
    currentCheckpoint,
    onCheckpointReached,
  ])

  // Draw the game map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background (placeholder - will be replaced with image)
    ctx.fillStyle = "#f0f9ff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw path
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 10
    ctx.lineCap = "round"

    if (checkpoints.length > 0) {
      ctx.moveTo(checkpoints[0].x, checkpoints[0].y)
      for (let i = 1; i < checkpoints.length; i++) {
        ctx.lineTo(checkpoints[i].x, checkpoints[i].y)
      }
    }
    ctx.stroke()

    // Draw checkpoints
    checkpoints.forEach((checkpoint, index) => {
      ctx.beginPath()
      ctx.arc(checkpoint.x, checkpoint.y, 15, 0, Math.PI * 2)

      if (checkpoint.reached) {
        // Completed checkpoint
        ctx.fillStyle = "#22c55e"
      } else {
        // Future checkpoint
        ctx.fillStyle = "#d1d5db"
      }

      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 3
      ctx.stroke()

      // Checkpoint number
      ctx.fillStyle = "#fff"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText((index + 1).toString(), checkpoint.x, checkpoint.y)
    })

    // Draw player character (placeholder - will be replaced with image)
    ctx.beginPath()
    ctx.fillStyle = "#3b82f6"
    ctx.arc(playerPosition.x, playerPosition.y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw character details
    ctx.beginPath()
    ctx.fillStyle = "#1e40af"
    ctx.arc(playerPosition.x - 7, playerPosition.y - 5, 4, 0, Math.PI * 2) // Left eye
    ctx.arc(playerPosition.x + 7, playerPosition.y - 5, 4, 0, Math.PI * 2) // Right eye
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = "#1e40af"
    ctx.lineWidth = 2
    ctx.arc(playerPosition.x, playerPosition.y + 5, 8, 0, Math.PI) // Smile
    ctx.stroke()
  }, [playerPosition, checkpoints])

  return (
    <div className="bg-card rounded-lg p-4 h-[400px] w-full relative">
      <canvas ref={canvasRef} width={1200} height={600} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded text-xs">
        Use arrow keys to move the character to each checkpoint
      </div>
    </div>
  )
}

