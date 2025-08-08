'use client'

import { motion } from 'framer-motion'
import type { PlantData } from './neglect-o-plant'

interface PlantStatsProps {
  plantData: PlantData & { waterLevel: number }
}

export function PlantStats({ plantData }: PlantStatsProps) {
  const getMoodColor = () => {
    if (plantData.mood > 70) return 'from-green-400 to-emerald-500'
    if (plantData.mood > 30) return 'from-yellow-400 to-orange-500'
    if (plantData.mood > -30) return 'from-orange-400 to-red-500'
    return 'from-red-500 to-red-700'
  }

  const getPlantFaceEmoji = () => {
    // Create a simple plant face for stats
    switch (plantData.emotion) {
      case 'excited': return '🌿✨'
      case 'loved': return '🌿💕'
      case 'happy': return '🌿😊'
      case 'grateful': return '🌿🙏'
      case 'content': return '🌿😌'
      case 'worried': return '🌱😟'
      case 'anxious': return '🌱😰'
      case 'sad': return '🥀😢'
      case 'angry': return '🌿😡'
      case 'betrayed': return '🥀💔'
      case 'devastated': return '🍂😭'
      case 'lonely': return '🌱😔'
      default: return '🌿😐'
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Health Bar */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100">
        <div className="flex justify-between text-sm font-semibold mb-2 text-emerald-700">
          <span className="flex items-center gap-1">
            💚 Health
          </span>
          <span>{plantData.health}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full transition-colors duration-300 ${
              plantData.health > 70
                ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                : plantData.health > 30
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${plantData.health}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Mood Bar */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-100">
        <div className="flex justify-between text-sm font-semibold mb-2 text-purple-700">
          <span className="flex items-center gap-1">
            {getPlantFaceEmoji()} Mood
          </span>
          <span>{plantData.mood}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full transition-colors duration-300 bg-gradient-to-r ${getMoodColor()}`}
            initial={{ width: '50%' }}
            animate={{ width: `${(plantData.mood + 100) / 2}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Water Level Bar */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-100">
        <div className="flex justify-between text-sm font-semibold mb-2 text-blue-700">
          <span className="flex items-center gap-1">
            💧 Water Level
          </span>
          <span>{plantData.waterLevel}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-3 rounded-full transition-colors duration-300 ${
              plantData.waterLevel > 70
                ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                : plantData.waterLevel > 30
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            initial={{ width: '100%' }}
            animate={{ width: `${plantData.waterLevel}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-100 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl font-bold text-red-600 mb-1">
            {plantData.abandonmentCount}
          </div>
          <div className="text-xs text-red-500 font-medium flex items-center justify-center gap-1">
            💔 Times Abandoned
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {plantData.attentionStreak}
          </div>
          <div className="text-xs text-blue-500 font-medium flex items-center justify-center gap-1">
            🔥 Attention Streak
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {plantData.sassLevel}/10
          </div>
          <div className="text-xs text-purple-500 font-medium flex items-center justify-center gap-1">
            😤 Sass Level
          </div>
        </motion.div>

        <motion.div 
          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-3xl font-bold text-green-600 mb-1">
            {plantData.totalAttentionReceived}
          </div>
          <div className="text-xs text-green-500 font-medium flex items-center justify-center gap-1">
            💚 Total Love Given
          </div>
        </motion.div>
      </div>

      {/* Emotional State */}
      <motion.div 
        className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm text-emerald-600 font-medium mb-1 flex items-center justify-center gap-1">
          🌸 Current Emotion
        </div>
        <div className="font-bold text-xl capitalize mb-2">
          {getPlantFaceEmoji()} {plantData.emotion}
        </div>
        <div className="text-sm text-gray-600">
          Physical State: {plantData.state.charAt(0).toUpperCase() + plantData.state.slice(1)}
          {plantData.abandonmentCount > 0 && ' (& Sassy)'}
        </div>
      </motion.div>
    </div>
  )
}
