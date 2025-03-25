"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import SideNavbar from "@/components/side-navbar"

export default function Home() {
  const [playerName, setPlayerName] = useState("Explorer")

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      setPlayerName(storedName)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <SideNavbar />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6 tracking-wider">Command Center</h1>

          {/* Welcome Message */}
          <div className="bg-blue-800/30 rounded-xl p-6 border border-blue-500/30 mb-8 text-center w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome, {playerName}!</h2>
            <p className="text-blue-200">
              Your space exploration journey is about to begin. Prepare to embark on an educational adventure through
              the cosmos, where you'll learn about mathematics, physics, chemistry, biology, and coding.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">Status</h3>
              <div className="text-blue-200">
                <div className="flex justify-between mb-2">
                  <span>Level:</span>
                  <span>42</span>
                </div>
                <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: "75%" }}></div>
                </div>
                <div className="text-xs text-right mt-1">12,500 / 15,000 XP</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">Achievements</h3>
              <div className="text-blue-200">
                <div className="flex justify-between mb-1">
                  <span>Total Trophies:</span>
                  <span>15</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Latest:</span>
                  <span>Code Ninja 🥷</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-2">Friends</h3>
              <div className="text-blue-200">
                <div className="flex justify-between mb-1">
                  <span>Online:</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Requests:</span>
                  <span>2</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-blue-800/30 rounded-xl p-4 border border-blue-500/30 shadow-lg md:col-span-2 lg:col-span-3"
            >
              <h3 className="text-xl font-bold text-white mb-2">Mission Progress</h3>
              <div className="grid grid-cols-4 gap-2 text-blue-200">
                <div className="bg-blue-900/50 p-2 rounded-lg text-center">
                  <div className="font-bold">Phase 1</div>
                  <div className="text-green-400">Complete</div>
                </div>
                <div className="bg-blue-900/50 p-2 rounded-lg text-center">
                  <div className="font-bold">Phase 2</div>
                  <div className="text-green-400">Complete</div>
                </div>
                <div className="bg-blue-900/50 p-2 rounded-lg text-center">
                  <div className="font-bold">Phase 3</div>
                  <div className="text-yellow-400">In Progress</div>
                </div>
                <div className="bg-blue-900/50 p-2 rounded-lg text-center">
                  <div className="font-bold">Phase 4</div>
                  <div className="text-gray-400">Locked</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Start Button with Glitch Effect */}
          <Link href="/game/phase1">
            <motion.button
              className="mt-8 text-3xl font-bold text-white tracking-widest relative z-10 px-6 py-3 bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
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
          </Link>

          {/* Glitch Animation Styles */}
          <style jsx>{`
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
          `}</style>
        </div>
      </div>
    </div>
  )
}

