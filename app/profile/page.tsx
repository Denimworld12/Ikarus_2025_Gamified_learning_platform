"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, Save, UserRoundIcon as UserRoundPen, Trophy, Code } from "lucide-react"
import SideNavbar from "@/components/side-navbar"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "Explorer",
    email: "explorer@nexus.com",
    bio: "Quantum programmer exploring the digital frontier",
    skills: ["React", "Python", "Machine Learning", "Cybersecurity"],
    totalTrophies: 15,
    totalPoints: 7500,
  })

  useEffect(() => {
    // Get player name from localStorage
    const storedName = localStorage.getItem("playerName")
    if (storedName) {
      setProfileData((prev) => ({
        ...prev,
        username: storedName,
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950 text-blue-300 p-4 md:p-8">
      <SideNavbar />

      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 flex items-center">
            <UserRoundPen className="mr-4" /> Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`
              px-4 py-2 rounded-full flex items-center
              ${isEditing ? "bg-green-600 text-white" : "bg-blue-600 text-white"}
            `}
          >
            {isEditing ? (
              <>
                <Save className="mr-2" /> Save
              </>
            ) : (
              <>
                <Edit className="mr-2" /> Edit
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Details */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800 md:col-span-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full bg-blue-800/50 text-blue-300 p-2 rounded mt-2 border border-blue-700"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-blue-400 mt-2">{profileData.username}</h2>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full bg-blue-800/50 text-blue-300 p-2 rounded mt-2 border border-blue-700"
                  />
                ) : (
                  <p className="text-lg text-blue-300 mt-2">{profileData.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-400">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full bg-blue-800/50 text-blue-300 p-2 rounded mt-2 h-24 border border-blue-700"
                  />
                ) : (
                  <p className="text-base text-blue-300 mt-2">{profileData.bio}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Stats */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800 flex flex-col"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Trophy className="text-blue-500 mr-2" />
                <span className="text-lg font-semibold">Total Trophies</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">{profileData.totalTrophies}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Code className="text-blue-500 mr-2" />
                <span className="text-lg font-semibold">Total Points</span>
              </div>
              <span className="text-2xl font-bold text-blue-400">{profileData.totalPoints}</span>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="bg-blue-900/30 rounded-xl p-6 border border-blue-800 md:col-span-3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold mb-4 text-blue-400">Skills</h3>
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <input
                  type="text"
                  placeholder="Add skills (comma separated)"
                  className="w-full bg-blue-800/50 text-blue-300 p-2 rounded border border-blue-700"
                />
              ) : (
                profileData.skills.map((skill, index) => (
                  <span key={index} className="bg-blue-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

