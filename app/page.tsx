'use client'

import { NeglectOPlant } from './components/neglect-o-plant'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-2xl opacity-20 animate-bounce">🌸</div>
        <div className="absolute top-20 right-20 text-xl opacity-30 animate-pulse">✨</div>
        <div className="absolute bottom-20 left-20 text-lg opacity-25 animate-bounce delay-1000">🦋</div>
        <div className="absolute bottom-10 right-10 text-2xl opacity-20 animate-pulse delay-500">🌺</div>
        <div className="absolute top-1/2 left-5 text-sm opacity-15 animate-bounce delay-700">🍃</div>
        <div className="absolute top-1/3 right-5 text-sm opacity-25 animate-pulse delay-300">💫</div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 bg-clip-text text-transparent mb-3 drop-shadow-sm">
            🌱 Your Virtual Plant Friend
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">✨</span>
            <p className="text-emerald-700 font-medium">
              The world's most emotionally dependent virtual plant
            </p>
            <span className="text-lg">✨</span>
          </div>
          <p className="text-emerald-600 text-sm italic">
            Give your plant a name and watch the magic happen! 👀
          </p>
        </div>
        <NeglectOPlant />
      </div>
    </main>
  )
}
