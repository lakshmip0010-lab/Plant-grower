'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkles, Heart } from 'lucide-react'

interface PlantNameModalProps {
  currentName: string
  isFirstTime: boolean
  onNameSubmit: (name: string) => void
  onClose: () => void
}

export function PlantNameModal({ currentName, isFirstTime, onNameSubmit, onClose }: PlantNameModalProps) {
  const [name, setName] = useState(currentName)
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedName = name.trim()
    
    if (!trimmedName) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }
    
    if (trimmedName.length > 20) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }

    onNameSubmit(trimmedName)
  }

  const suggestedNames = [
    'Lily', 'Rosie', 'Ivy', 'Sage', 'Fern', 'Daisy', 
    'Basil', 'Mint', 'Willow', 'Poppy', 'Clover', 'Sunny'
  ]

  const handleSuggestionClick = (suggestedName: string) => {
    setName(suggestedName)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className={`bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-emerald-100/50 backdrop-blur-sm relative ${
          isShaking ? 'animate-pulse' : ''
        }`}
      >
        {/* Close button */}
        {!isFirstTime && (
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-2 hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🌿
          </motion.div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent mb-2">
            {isFirstTime ? "Let's Name Your Plant!" : "Rename Your Plant"}
          </h2>
          <p className="text-emerald-600 text-sm">
            {isFirstTime 
              ? "Every plant needs a special name to feel loved! 💚"
              : "Give your plant friend a new identity! ✨"
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="plantName" className="block text-sm font-semibold text-emerald-700 mb-2">
              Plant Name
            </label>
            <motion.input
              id="plantName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a cute name..."
              className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:border-emerald-500 transition-colors bg-white/60 backdrop-blur-sm ${
                isShaking ? 'border-red-400 bg-red-50/60' : 'border-emerald-200'
              }`}
              maxLength={20}
              animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              autoFocus
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">
                {name.length}/20 characters
              </span>
              {isShaking && (
                <span className="text-xs text-red-500">
                  Please enter a valid name (1-20 characters)
                </span>
              )}
            </div>
          </div>

          {/* Name suggestions */}
          <div>
            <p className="text-sm font-semibold text-emerald-700 mb-3">
              ✨ Or pick from these cute suggestions:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {suggestedNames.map((suggestedName) => (
                <motion.button
                  key={suggestedName}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestedName)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    name === suggestedName
                      ? 'bg-emerald-200 text-emerald-800 border-2 border-emerald-400'
                      : 'bg-emerald-100/60 text-emerald-700 border-2 border-transparent hover:bg-emerald-200/60 hover:border-emerald-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestedName}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg border-0 transition-all duration-200"
              >
                <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                {isFirstTime ? "Meet My Plant!" : "Update Name"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            
            {isFirstTime && (
              <motion.button
                type="button"
                onClick={() => onNameSubmit(currentName)}
                className="w-full text-emerald-600 hover:text-emerald-800 text-sm font-medium py-2 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Keep the name "{currentName}"
              </motion.button>
            )}
          </div>
        </form>

        {/* Decorative elements */}
        <div className="absolute top-6 left-6 text-emerald-300 opacity-60">
          <Sparkles size={16} />
        </div>
        <div className="absolute bottom-6 right-6 text-pink-300 opacity-60">
          <Heart size={16} />
        </div>
      </motion.div>
    </motion.div>
  )
}
