"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { SettingsIcon, Volume2, Palette, Sun, Moon, LogOut } from "lucide-react"
import SideNavbar from "@/components/side-navbar"

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    volume: 50,
    theme: "dark",
    soundEffects: true,
    musicVolume: 30,
  })

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const toggleSetting = (name: string) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }))
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950 text-blue-300 p-4 md:p-8">
      <SideNavbar />

      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 flex items-center">
            <SettingsIcon className="mr-4" /> Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sound Settings */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
              <Volume2 className="mr-2" /> Sound
            </h3>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-blue-300">Master Volume</label>
                <span>{settings.volume}%</span>
              </div>
              <input
                type="range"
                name="volume"
                min="0"
                max="100"
                value={settings.volume}
                onChange={handleSliderChange}
                className="w-full h-2 bg-blue-800/50 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Sound Effects</span>
              <button
                onClick={() => toggleSetting("soundEffects")}
                className={`
                  w-12 h-6 rounded-full relative transition-colors duration-300
                  ${settings.soundEffects ? "bg-blue-600" : "bg-blue-800/50"}
                `}
              >
                <span
                  className={`
                    absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300
                    ${settings.soundEffects ? "translate-x-6" : "translate-x-1"}
                  `}
                ></span>
              </button>
            </div>
          </motion.div>

          {/* Theme Settings */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center">
              <Palette className="mr-2" /> Theme
            </h3>

            <div className="flex space-x-4">
              <button
                onClick={() => setSettings((prev) => ({ ...prev, theme: "dark" }))}
                className={`
                  flex items-center justify-center w-1/2 p-3 rounded-lg
                  ${settings.theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-800/50 text-blue-300"}
                `}
              >
                <Moon className="mr-2" /> Dark Mode
              </button>
              <button
                onClick={() => setSettings((prev) => ({ ...prev, theme: "light" }))}
                className={`
                  flex items-center justify-center w-1/2 p-3 rounded-lg
                  ${settings.theme === "light" ? "bg-blue-600 text-white" : "bg-blue-800/50 text-blue-300"}
                `}
              >
                <Sun className="mr-2" /> Light Mode
              </button>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800 md:col-span-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-blue-400">Logout</h3>
                <p className="text-gray-400 mt-2">End your current session and return to login screen</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-red-700 transition"
              >
                <LogOut className="mr-2" /> Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

