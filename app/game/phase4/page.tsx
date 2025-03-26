"use client"

import { lazy } from 'react'
import dynamicImport from 'next/dynamic'

// Force dynamic rendering with no static rendering
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

// Dynamically import the component with SSR disabled
const GamePhase4Component = dynamicImport(() => import('@/components/GamePhase4Component'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="text-white text-xl">Loading landing sequence...</div>
    </div>
  )
})

export default function Phase4Page() {
  return <GamePhase4Component />
}

