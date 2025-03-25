"use client"

import dynamic from 'next/dynamic'

// Dynamically import the component with SSR disabled
const GamePhase2Component = dynamic(() => import('@/components/GamePhase2Component'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="text-white text-xl">Loading game...</div>
    </div>
  )
})

// Force dynamic rendering with no static rendering
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function Phase2Page() {
  return <GamePhase2Component />
}

