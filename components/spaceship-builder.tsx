"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { RefreshCw } from "lucide-react"

interface SpaceshipBuilderProps {
  onComplete: () => void
}

interface SpaceshipPart {
  id: string
  name: string
  description: string
  correctPosition: string
  imageUrl?: string
}

interface Positions {
  top: SpaceshipPart[]
  middle: SpaceshipPart[]
  bottom: SpaceshipPart[]
  outer: SpaceshipPart[]
}

export default function SpaceshipBuilder({ onComplete }: SpaceshipBuilderProps) {
  const [message, setMessage] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  // Available parts to drag
  const initialParts = [
    {
      id: "thrusters",
      name: "Thrusters",
      description: "Provides propulsion for the spacecraft",
      correctPosition: "bottom",
      imageUrl: "/placeholder.svg?height=100&width=100", // Replace with your image
    },
    {
      id: "fuel-tanks",
      name: "Fuel Tanks",
      description: "Stores liquid hydrogen and oxygen",
      correctPosition: "middle",
      imageUrl: "/placeholder.svg?height=100&width=100", // Replace with your image
    },
    {
      id: "ai-module",
      name: "AI Module",
      description: "Controls navigation and life support systems",
      correctPosition: "top",
      imageUrl: "/placeholder.svg?height=100&width=100", // Replace with your image
    },
    {
      id: "shielding",
      name: "Radiation Shielding",
      description: "Protects from cosmic radiation",
      correctPosition: "outer",
      imageUrl: "/placeholder.svg?height=100&width=100", // Replace with your image
    },
  ]

  const [availableParts, setAvailableParts] = useState<SpaceshipPart[]>(initialParts)

  const [positions, setPositions] = useState<Positions>({
    top: [],
    middle: [],
    bottom: [],
    outer: [],
  })

  const handleDragEnd = (result: any) => {
    const { source, destination } = result

    // Dropped outside a valid area
    if (!destination) return

    // Moving from available parts to a position
    if (source.droppableId === "available-parts") {
      const part = availableParts[source.index]
      const newAvailableParts = [...availableParts]
      newAvailableParts.splice(source.index, 1)
      setAvailableParts(newAvailableParts)

      // Add to destination
      setPositions({
        ...positions,
        [destination.droppableId]: [...positions[destination.droppableId as keyof typeof positions], part],
      })

      // Check if part is in correct position
      if (part.correctPosition === destination.droppableId) {
        setMessage(`Correct! The ${part.name} belongs in the ${destination.droppableId} position.`)
      } else {
        setMessage(`Hmm, the ${part.name} might work better in a different position.`)
      }
    }

    // Check if all parts are placed and in correct positions
    setTimeout(() => {
      const allPartsPlaced = availableParts.length === 0
      const allPartsCorrect = Object.entries(positions).every(([position, parts]) => {
        return parts.every((part: SpaceshipPart) => part.correctPosition === position)
      })

      if (allPartsPlaced && allPartsCorrect) {
        setMessage("Great job! Your spaceship is assembled correctly!")
        setIsComplete(true)
      }
    }, 500)
  }

  // Reset the spaceship builder
  const resetBuilder = () => {
    setAvailableParts(initialParts)
    setPositions({
      top: [],
      middle: [],
      bottom: [],
      outer: [],
    })
    setMessage("")
    setIsComplete(false)
  }

  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Spaceship Assembly</h2>
        <Button variant="outline" size="sm" onClick={resetBuilder} className="flex items-center gap-1">
          <RefreshCw size={16} />
          Reset
        </Button>
      </div>
      <p className="mb-6">Drag and drop the spaceship components to their correct positions.</p>

      {message && (
        <div
          className={`p-3 rounded-md mb-4 ${isComplete ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"}`}
        >
          {message}
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-2">Available Components</h3>
            <Droppable droppableId="available-parts">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-muted p-4 rounded-md min-h-[200px]"
                >
                  {availableParts.length === 0 ? (
                    <p className="text-muted-foreground text-center">All parts used</p>
                  ) : (
                    availableParts.map((part, index) => (
                      <Draggable key={part.id} draggableId={part.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-background border rounded-md p-3 mb-2 cursor-grab flex items-center gap-3"
                          >
                            {part.imageUrl && (
                              <img
                                src={part.imageUrl || "/placeholder.svg"}
                                alt={part.name}
                                className="w-12 h-12 object-contain"
                              />
                            )}
                            <div>
                              <div className="font-medium">{part.name}</div>
                              <div className="text-sm text-muted-foreground">{part.description}</div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div>
            <h3 className="font-medium mb-2">Spaceship Assembly</h3>
            <div className="grid grid-rows-3 gap-2 relative">
              <Droppable droppableId="top">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted p-2 rounded-md text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">Top Section</div>
                    {positions.top.length > 0 ? (
                      positions.top.map((part: SpaceshipPart) => (
                        <div
                          key={part.id}
                          className="bg-background border rounded-md p-2 flex items-center justify-center"
                        >
                          {part.imageUrl && (
                            <img
                              src={part.imageUrl || "/placeholder.svg"}
                              alt={part.name}
                              className="w-10 h-10 object-contain mr-2"
                            />
                          )}
                          {part.name}
                        </div>
                      ))
                    ) : (
                      <div className="h-12"></div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="middle">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted p-2 rounded-md text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">Middle Section</div>
                    {positions.middle.length > 0 ? (
                      positions.middle.map((part: SpaceshipPart) => (
                        <div
                          key={part.id}
                          className="bg-background border rounded-md p-2 flex items-center justify-center"
                        >
                          {part.imageUrl && (
                            <img
                              src={part.imageUrl || "/placeholder.svg"}
                              alt={part.name}
                              className="w-10 h-10 object-contain mr-2"
                            />
                          )}
                          {part.name}
                        </div>
                      ))
                    ) : (
                      <div className="h-12"></div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="bottom">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted p-2 rounded-md text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">Bottom Section</div>
                    {positions.bottom.length > 0 ? (
                      positions.bottom.map((part: SpaceshipPart) => (
                        <div
                          key={part.id}
                          className="bg-background border rounded-md p-2 flex items-center justify-center"
                        >
                          {part.imageUrl && (
                            <img
                              src={part.imageUrl || "/placeholder.svg"}
                              alt={part.name}
                              className="w-10 h-10 object-contain mr-2"
                            />
                          )}
                          {part.name}
                        </div>
                      ))
                    ) : (
                      <div className="h-12"></div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="outer">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="absolute inset-0 -m-2 border-4 border-dashed border-muted rounded-lg pointer-events-none"
                  >
                    <div className="absolute top-1 right-2 bg-muted px-2 py-1 rounded text-xs">Outer Layer</div>
                    <div className="absolute bottom-2 right-2">
                      {positions.outer.length > 0 && positions.outer[0] && (
                        <div className="bg-background border rounded-md p-2 pointer-events-auto flex items-center">
                          {positions.outer[0].imageUrl && (
                            <img
                              src={positions.outer[0].imageUrl || "/placeholder.svg"}
                              alt={positions.outer[0].name}
                              className="w-8 h-8 object-contain mr-2"
                            />
                          )}
                          {positions.outer[0].name}
                        </div>
                      )}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>

      {isComplete && (
        <div className="text-center">
          <Button onClick={onComplete} size="lg">
            Launch Spaceship
          </Button>
        </div>
      )}
    </div>
  )
}

