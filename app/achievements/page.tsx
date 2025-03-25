"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Lock, Unlock } from "lucide-react"
import SideNavbar from "@/components/side-navbar"

const achievementsData = [
  {
    id: 1,
    name: "Code Ninja",
    description: "Complete 100 coding challenges",
    points: 1000,
    icon: "🥷",
    achieved: true,
  },
  {
    id: 2,
    name: "Time Master",
    description: "Solve challenge under 5 minutes",
    points: 500,
    icon: "⏱️",
    achieved: true,
  },
  {
    id: 3,
    name: "Algorithm Architect",
    description: "Create 10 unique algorithms",
    points: 2000,
    icon: "🏗️",
    achieved: false,
  },
  {
    id: 4,
    name: "Bug Hunter",
    description: "Find and fix 50 bugs",
    points: 1500,
    icon: "🐞",
    achieved: false,
  },
  {
    id: 5,
    name: "Night Owl",
    description: "Code for 24 hours straight",
    points: 3000,
    icon: "🦉",
    achieved: false,
  },
]

export default function AchievementsPage() {
  const [filter, setFilter] = useState("all")

  const filteredAchievements = achievementsData.filter((achievement) => {
    if (filter === "achieved") return achievement.achieved
    if (filter === "locked") return !achievement.achieved
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950 text-blue-300 p-4 md:p-8">
      <SideNavbar />

      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-400">Achievements</h1>
          <div className="flex space-x-2">
            {["all", "achieved", "locked"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full ${
                  filter === type ? "bg-blue-600 text-white" : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`
                p-6 rounded-xl border transition-all duration-300
                ${
                  achievement.achieved
                    ? "bg-blue-900/30 border-blue-800 hover:bg-blue-900/50"
                    : "bg-blue-800/20 border-blue-700/50 opacity-60"
                }
              `}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-5xl">{achievement.icon}</div>
                {achievement.achieved ? <Trophy className="text-blue-500" /> : <Lock className="text-gray-500" />}
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-400">{achievement.name}</h3>
              <p className="text-sm mb-4 text-gray-400">{achievement.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{achievement.points} pts</span>
                {achievement.achieved ? <Unlock className="text-green-500" /> : <Lock className="text-red-500" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

