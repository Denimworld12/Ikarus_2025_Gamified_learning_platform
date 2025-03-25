"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getLocalStorage } from "@/lib/storage"

export default function Start() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState("Explorer")

  useEffect(() => {
    // Get player name from localStorage
    const storedName = getLocalStorage('playerName', 'Explorer')
    setPlayerName(storedName)
  }, [])

  const handleStart = () => {
    router.push("/game/phase1")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 p-8 flex flex-col items-center justify-center relative">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-6 tracking-wider">Command Center</h1>

      {/* Welcome Message */}
      <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-500/30 mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome, {playerName}!</h2>
        <p className="text-blue-200">
          Your space exploration journey is about to begin. Prepare to embark on an educational adventure through the
          cosmos, where you'll learn about mathematics, physics, chemistry, biology, and coding.
        </p>
      </div>

      {/* Mission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-8">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-2">Mission Objectives</h3>
          <ul className="list-disc list-inside text-blue-200 space-y-1">
            <li>Navigate to the launchpad</li>
            <li>Build and customize your spaceship</li>
            <li>Master space navigation techniques</li>
            <li>Successfully land on a distant planet</li>
          </ul>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg"
        >
          <h3 className="text-xl font-bold text-white mb-2">Your AI Assistant</h3>
          <p className="text-blue-200">
            Icarus will be your AI companion throughout this journey. Ask for help whenever you're stuck on a challenge,
            and Icarus will provide educational guidance to help you succeed.
          </p>
        </motion.div>
      </div>

      {/* Start Button with Glitch Effect */}
      <motion.button
        className="mt-8 text-3xl font-bold text-white tracking-widest relative z-50 px-6 py-3 bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 rounded-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStart}
      >
        <span className="relative">START</span>
        <span className="absolute top-0 left-0 w-full h-full text-red-500 animate-glitch" aria-hidden="true">
          START
        </span>
        <span className="absolute top-0 left-0 w-full h-full text-blue-500 animate-glitch2" aria-hidden="true">
          START
        </span>
        <span className="absolute top-0 left-0 w-full h-full text-green-500 animate-glitch3" aria-hidden="true">
          START
        </span>
      </motion.button>

      {/* Glitch Animation Styles */}
      <style>
        {`
          @keyframes glitch {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(2px, -2px); }
            60% { transform: translate(-2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0, 0); }
          }
          .animate-glitch { animation: glitch 0.2s infinite; }
          .animate-glitch2 { animation: glitch 0.2s infinite reverse; }
          .animate-glitch3 { animation: glitch 0.3s infinite; }
        `}
      </style>
    </div>
  )
}

