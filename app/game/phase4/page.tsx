"use client"

import dynamic from 'next/dynamic'

// Dynamically import the component with SSR disabled
const GamePhase4Component = dynamic(() => import('@/components/GamePhase4Component'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-slate-900 dark:to-indigo-950">
      <div className="text-white text-xl">Loading landing sequence...</div>
    </div>
  )
})

// This tells Next.js to always render this page dynamically
export const dynamic = 'force-dynamic'

export default function Phase4Page() {
  return <GamePhase4Component />
}

