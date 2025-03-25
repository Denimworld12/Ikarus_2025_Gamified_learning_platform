"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const [showPortal, setShowPortal] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = {
      username: "",
      email: "",
      password: "",
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "Email must end with @gmail.com"
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Store player name in localStorage
      localStorage.setItem("playerName", formData.username)

      setShowPortal(true)
      setTimeout(() => router.push("/start"), 3000) // Redirect after portal animation
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center relative bg-black">
      {/* Background GIF (Original size, centered) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/placeholder.svg?height=1080&width=1920" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Portal animation on login (Original size, centered) */}
      {showPortal ? (
        <div className="absolute flex items-center justify-center w-full h-full">
          <img src="/placeholder.svg?height=600&width=600" alt="Portal Animation" className="w-auto h-auto" />
        </div>
      ) : (
        <motion.div
          className="relative w-96 p-8 rounded-lg border-2 border-blue-500 text-blue-400 text-lg bg-black/80 shadow-lg shadow-blue-500"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center text-2xl font-bold mb-6">Enter the System</h2>

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-blue-400">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-transparent border-b-2 border-blue-500 focus:outline-none text-blue-400 text-lg"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-400">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-transparent border-b-2 border-blue-500 focus:outline-none text-blue-400 text-lg"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-400">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-transparent border-b-2 border-blue-500 focus:outline-none text-blue-400 text-lg"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full py-2 mt-6 bg-blue-500 text-black font-bold rounded hover:bg-blue-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  )
}

