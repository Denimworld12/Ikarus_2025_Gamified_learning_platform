"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Star, Trophy, Play, Users2, UserRoundIcon as UserRoundPen, Settings } from "lucide-react"

const navItems = [
  { id: 1, icon: <Star size={24} />, label: "Status", link: "/" },
  { id: 2, icon: <Trophy size={24} />, label: "Achievements", link: "/achievements" },
  { id: 3, icon: <Play size={24} />, label: "Start", link: "/start" },
  { id: 4, icon: <Users2 size={24} />, label: "Friends", link: "/profile" },
  { id: 5, icon: <UserRoundPen size={24} />, label: "Profile", link: "/profile" },
  { id: 6, icon: <Settings size={24} />, label: "Settings", link: "/settings" },
]

export default function SideNavbar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div
      className={`${isMobile ? "fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md p-2" : "fixed left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-6"}`}
    >
      {isMobile ? (
        // Mobile bottom navigation
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <Link key={item.id} href={item.link} className="flex flex-col items-center py-2">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${pathname === item.link ? "bg-blue-900 text-blue-300" : "bg-black text-blue-500"}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
              </motion.div>
              <span className="text-xs text-blue-300 mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      ) : (
        // Desktop side navigation
        <>
          {navItems.map((item) => (
            <motion.div key={item.id} className="relative flex items-center group" whileHover={{ x: 20 }}>
              {/* Tooltip */}
              <div className="absolute left-16 bg-blue-900 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg">
                {item.label}
              </div>

              {/* Icon with Link */}
              <motion.div
                className={`flex items-center justify-center w-14 h-14 rounded-full ${pathname === item.link ? "bg-blue-900 text-blue-300" : "bg-black text-blue-500"} border border-blue-800`}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Link href={item.link} className="flex items-center justify-center w-full h-full">
                  {item.icon}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  )
}

