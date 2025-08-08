'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface PassiveAggressivePopupProps {
  message: string
  plantName: string
  onClose: () => void
}

export function PassiveAggressivePopup({ message, plantName, onClose }: PassiveAggressivePopupProps) {
  const isPositive = message.includes('💚') || message.includes('✨') || message.includes('🥰') || message.includes('🌟') || message.includes('😊') || message.includes('🌿✨')
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className={`fixed top-4 right-4 px-5 py-4 rounded-2xl shadow-2xl max-w-sm z-50 border-2 backdrop-blur-sm ${
        isPositive
          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-800'
          : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 text-red-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <motion.span 
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              {isPositive ? '💚' : '🥀'}
            </motion.span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold mb-1 flex items-center gap-1">
              {isPositive ? '🌸' : '💔'} {plantName} Says:
            </p>
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>
        <motion.button
          onClick={onClose}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-white/50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={16} />
        </motion.button>
      </div>
      
      {/* Add sparkles to positive messages */}
      {isPositive && (
        <div className="absolute -inset-2 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`popup-sparkle-${i}`}
              className="absolute text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              {['✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟'][i]}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
