"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizontal, Bot, User } from "lucide-react"
import { getChatCompletion } from "@/lib/api"
import { isBrowser } from "@/lib/browser"

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  currentSubject: string
}

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatbotModal({ isOpen, onClose, currentSubject }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: getWelcomeMessage(currentSubject),
        },
      ])
    }
  }, [isOpen, messages.length, currentSubject])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Format messages for API
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call OpenAI API with a subject context
      const contextMessage = {
        role: "system",
        content: `You are Icarus, an educational AI assistant focusing on ${currentSubject}. Provide helpful, accurate information to help students understand space concepts.`
      };

      // Use API if available, otherwise fallback to simulated response
      let response;
      if (isBrowser) {
        response = await getChatCompletion([contextMessage, ...apiMessages]);
      } else {
        response = getSimulatedResponse(input, currentSubject);
      }

      const botResponse = {
        role: "assistant" as const,
        content: response,
      };
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      // Fallback to simulated response
      const botResponse = {
        role: "assistant" as const,
        content: getSimulatedResponse(input, currentSubject),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 bg-blue-900 border-blue-700 text-white">
        <DialogHeader className="p-4 border-b border-blue-700">
          <DialogTitle className="flex items-center gap-2 text-white">
            <Bot className="h-5 w-5" />
            Icarus - AI Assistant
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "assistant" ? "bg-blue-800/50" : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    <span className="text-xs font-medium">{message.role === "assistant" ? "Icarus" : "You"}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-blue-800/50">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium">Icarus</span>
                  </div>
                  <div className="mt-2 flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-bounce" />
                    <div
                      className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-blue-700 mt-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Icarus a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-blue-800/50 border-blue-600 text-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Welcome message based on subject
function getWelcomeMessage(subject: string): string {
  return `Hi there! I'm Icarus, your AI assistant. I see you're working on ${subject}. I can provide educational information and help you understand the concepts. What would you like to know?`
}

// Simulated responses - in a real implementation, this would be replaced with OpenAI API calls
function getSimulatedResponse(input: string, subject: string): string {
  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("help") || lowerInput.includes("hint")) {
    if (subject.includes("math")) {
      return "For math problems, try breaking them down into smaller steps. Remember your formulas for area, volume, and trigonometry. Would you like me to explain a specific concept?"
    } else if (subject.includes("physics")) {
      return "Physics questions often involve formulas like F=ma or the equations of motion. Think about the forces involved and how they interact. Need help with a specific physics concept?"
    } else if (subject.includes("chemistry")) {
      return "For chemistry questions, consider the properties of elements, chemical reactions, and molecular structures. The periodic table is your friend! What specific chemistry concept are you struggling with?"
    } else if (subject.includes("biology")) {
      return "Biology questions often relate to living systems, cells, or human physiology. Think about how different systems work together. What specific biology topic would you like me to explain?"
    } else if (subject.includes("coding")) {
      return "When solving coding problems, think about the logic step by step. Break down the problem into smaller parts. Would you like me to explain a specific programming concept?"
    } else if (subject.includes("zero gravity")) {
      return "In zero gravity environments, objects continue moving in the same direction at a constant velocity unless acted upon by a force. This is Newton's First Law of Motion. For navigation, you need to apply thrust in the opposite direction to slow down or change course."
    } else if (subject.includes("gravitational")) {
      return "Gravitational fields affect the trajectory of objects in space. The force of gravity between two objects is proportional to their masses and inversely proportional to the square of the distance between them. When navigating near asteroids, you need to account for their gravitational pull."
    } else if (subject.includes("orbital")) {
      return "Orbital mechanics involves understanding how objects orbit around each other in space. To achieve a stable orbit, you need the right balance of velocity and altitude. Too slow, and you'll fall; too fast, and you'll escape the gravitational pull."
    } else if (subject.includes("fuel")) {
      return "Fuel efficiency is crucial for space missions. The Tsiolkovsky rocket equation relates the change in velocity to the exhaust velocity and the initial and final mass of the spacecraft. Efficient burns at the right time can save significant amounts of fuel."
    } else if (subject.includes("atmospheric")) {
      return "Atmospheric entry is one of the most challenging phases of space travel. The spacecraft needs to enter at the right angle - too steep and it will burn up, too shallow and it will bounce off the atmosphere. The heat shield protects the spacecraft from temperatures that can reach thousands of degrees."
    } else if (subject.includes("aerodynamics")) {
      return "Parachutes work by creating drag, which slows down the spacecraft's descent through the atmosphere. The timing of deployment is critical - too early and you risk drift or damage, too late and the deceleration might not be sufficient for a safe landing."
    } else if (subject.includes("landing")) {
      return "Spacecraft landing requires precise control of descent rate. Thrusters are used to counteract gravity and slow the descent. The landing gear must be deployed at the right time to absorb the impact of touchdown."
    } else if (subject.includes("planetary")) {
      return "Planetary science involves analyzing the composition, atmosphere, and conditions of planets. This data is crucial for determining habitability and planning future missions. What specific aspect of planetary science are you interested in?"
    } else {
      return "I'm here to help! What specific concept are you struggling with? I can explain it in more detail."
    }
  }

  if (lowerInput.includes("explain") || lowerInput.includes("what is")) {
    if (lowerInput.includes("gravity")) {
      return "Gravity is a fundamental force that attracts objects with mass toward each other. On Earth, gravity accelerates objects at approximately 9.8 m/s². The formula for gravitational force is F = G(m₁m₂)/r², where G is the gravitational constant, m₁ and m₂ are the masses, and r is the distance between them."
    } else if (lowerInput.includes("rocket") || lowerInput.includes("thrust")) {
      return "Rockets work based on Newton's Third Law: for every action, there is an equal and opposite reaction. When a rocket expels gas downward (action), the rocket experiences an upward force (reaction). This is how thrust is generated. The thrust depends on the mass flow rate and exhaust velocity."
    } else if (lowerInput.includes("orbit") || lowerInput.includes("satellite")) {
      return "An orbit is a path that an object takes around another object due to gravity. Satellites stay in orbit because they're moving forward at the same rate that they're falling toward Earth. This creates a continuous 'free fall' around the planet. Different orbital heights have different velocities needed to maintain orbit."
    } else if (lowerInput.includes("parachute")) {
      return "Parachutes work by increasing drag, which opposes the motion of the falling object. The large surface area of the parachute creates air resistance, slowing the descent to a safe speed. The timing of deployment is critical - too early can cause drift, too late may not provide enough deceleration."
    } else if (lowerInput.includes("atmosphere")) {
      return "A planet's atmosphere is the layer of gases surrounding it, held in place by gravity. Atmospheres can vary greatly in composition - Earth's is primarily nitrogen and oxygen, while Mars has mostly carbon dioxide. The density of the atmosphere affects how spacecraft must be designed for entry and landing."
    } else {
      return (
        "That's an interesting question about " +
        subject +
        "! In a real implementation, I would connect to OpenAI to provide you with a detailed explanation. The key concepts to understand here involve physics principles, mathematical calculations, and practical applications in space exploration."
      )
    }
  }

  return (
    "I'm here to help with your space mission! In a real implementation, I would connect to OpenAI to provide more detailed and personalized responses about " +
    subject +
    ". Is there a specific aspect you'd like to learn more about?"
  )
}

