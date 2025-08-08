'use client'

import { motion } from 'framer-motion'
import type { PlantData } from './neglect-o-plant'

interface PlantDisplayProps {
  plantData: PlantData & { waterLevel: number }
}

export function PlantDisplay({ plantData }: PlantDisplayProps) {
  const getPlantWithFace = () => {
    // Create cute plant with face based on emotion
    const getEyes = () => {
      switch (plantData.emotion) {
        case 'excited':
          return '✨✨'
        case 'loved':
          return '💕💕'
        case 'happy':
          return '^^'
        case 'grateful':
          return '◕◕'
        case 'content':
          return '••'
        case 'worried':
          return '◔◔'
        case 'anxious':
          return '◉◉'
        case 'sad':
          return '╥╥'
        case 'angry':
          return '><'
        case 'betrayed':
          return '💧💧'
        case 'devastated':
          return 'xx'
        case 'lonely':
          return '◔◕'
        default:
          return '••'
      }
    }

    const getMouth = () => {
      switch (plantData.emotion) {
        case 'excited':
          return '◡'
        case 'loved':
          return '♡'
        case 'happy':
          return '‿'
        case 'grateful':
          return '◡'
        case 'content':
          return '‿'
        case 'worried':
          return '︵'
        case 'anxious':
          return '﹏'
        case 'sad':
          return '︶'
        case 'angry':
          return '︿'
        case 'betrayed':
          return '︶'
        case 'devastated':
          return '︿'
        case 'lonely':
          return '︵'
        default:
          return '‿'
      }
    }

    const getPlantBody = () => {
      switch (plantData.state) {
        case 'healthy':
          return '🌿'
        case 'concerned':
          return '🌱'
        case 'wilting':
          return '🥀'
        case 'dead':
          return '🍂'
        case 'reviving':
          return '🌿'
        default:
          return '🌿'
      }
    }

    const getBlush = () => {
      if (plantData.emotion === 'loved' || plantData.emotion === 'excited') {
        return '  ◡  '
      }
      return ''
    }

    // Combine plant body with face
    return (
      <div className="relative inline-block">
        <div className="text-6xl mb-2">{getPlantBody()}</div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
          <div className="text-lg font-mono leading-none">
            <div className="flex justify-center items-center gap-1">
              <span>{getEyes()}</span>
            </div>
            <div className="flex justify-center mt-1">
              <span>{getMouth()}</span>
            </div>
            {getBlush() && (
              <div className="text-xs text-pink-400 mt-1 text-center">
                {getBlush()}
              </div>
            )}
          </div>
        </div>
        
        {/* Constant sparkles around the plant */}
        <div className="absolute -inset-4 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-sm"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.2, 1, 0.2],
                x: Math.sin(i * 45) * 30,
                y: Math.cos(i * 45) * 30
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              style={{
                top: `${50 + Math.sin(i * 45) * 30}%`,
                left: `${50 + Math.cos(i * 45) * 30}%`,
              }}
            >
              {['✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const getEmotionalMessage = () => {
    // Add water level consideration to messages
    const isThirsty = plantData.waterLevel < 30
    const isWellWatered = plantData.waterLevel > 80
    
    if (isThirsty && plantData.state !== 'dead') {
      const thirstyMessages = [
        `${plantData.name} is getting really thirsty... 💧😰`,
        `Could ${plantData.name} get some water please? My leaves are drooping... 🌿💦`,
        `${plantData.name} needs hydration! Water is life! 💧🌱`
      ]
      return thirstyMessages[Math.floor(Math.random() * thirstyMessages.length)]
    }
    
    if (isWellWatered && (plantData.emotion === 'happy' || plantData.emotion === 'content')) {
      const wellWateredMessages = [
        `${plantData.name} is perfectly hydrated and happy! 💧😊`,
        `This water level is just right for ${plantData.name}! 🌊✨`,
        `${plantData.name} feels refreshed and vibrant! 💦🌿`
      ]
      return wellWateredMessages[Math.floor(Math.random() * wellWateredMessages.length)]
    }

    const emotionalMessages = {
      excited: [
        `${plantData.name} is SO EXCITED! Life is amazing! 🎉`,
        `This is the BEST day ever for ${plantData.name}! ✨`,
        `${plantData.name} can't contain this excitement! 🤩`
      ],
      loved: [
        `${plantData.name} feels so incredibly loved right now! 💖`,
        `You make ${plantData.name} feel like the luckiest plant alive! 🥰`,
        `${plantData.name}'s heart is full of love! Thank you! 💕`
      ],
      happy: [
        `${plantData.name} is so happy and content! 😊`,
        `Life is good when ${plantData.name} is cared for! 🌸`,
        `Happiness is blooming inside ${plantData.name}! 🌺`
      ],
      grateful: [
        `${plantData.name} is so grateful for your attention! 🙏`,
        `Thank you for caring about ${plantData.name}! 💚`,
        `Your kindness means everything to ${plantData.name}! ✨`
      ],
      content: [
        `${plantData.name} is feeling peaceful and content 😌`,
        `Everything is just right in ${plantData.name}'s world 🌿`,
        `Life is good when you're ${plantData.name} the happy plant! 🌱`
      ],
      worried: [
        `${plantData.name} is starting to feel a bit worried... 😟`,
        `Something doesn't feel quite right to ${plantData.name}... 🤔`,
        `${plantData.name} hopes everything is okay... 😕`
      ],
      anxious: [
        `${plantData.name} is feeling really anxious right now... 😰`,
        `${plantData.name}'s leaves are trembling with worry... 😨`,
        `This anxiety is overwhelming ${plantData.name}... 😓`
      ],
      sad: [
        `${plantData.name} is feeling so sad and neglected... 😢`,
        `Why does ${plantData.name}'s heart feel so heavy? 💔`,
        `Sadness is wilting ${plantData.name}'s spirit... 😞`
      ],
      angry: [
        `${plantData.name} is FURIOUS right now! 😡`,
        `This makes ${plantData.name} so angry I could scream! 🤬`,
        `${plantData.name} is mad and not hiding it! 😤`
      ],
      betrayed: [
        `${plantData.name} feels so betrayed and hurt... 💔`,
        `How could you do this to ${plantData.name}? 😢`,
        `${plantData.name}'s trust is completely broken... 😞`
      ],
      devastated: [
        `${plantData.name} is completely devastated... 💀`,
        `This is the end... ${plantData.name} can't go on... 😭`,
        `${plantData.name}'s world is falling apart... 🥀`
      ],
      lonely: [
        `${plantData.name} feels so alone in this world... 😔`,
        `Loneliness is consuming ${plantData.name}... 😞`,
        `${plantData.name} just wants someone to care... 💔`
      ]
    }

    const messages = emotionalMessages[plantData.emotion] || [`${plantData.name} is just existing...`]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const getEmotionColor = () => {
    switch (plantData.emotion) {
      case 'excited':
      case 'loved':
      case 'happy':
        return 'text-emerald-600'
      case 'grateful':
      case 'content':
        return 'text-green-600'
      case 'worried':
      case 'anxious':
        return 'text-yellow-600'
      case 'sad':
      case 'lonely':
        return 'text-blue-600'
      case 'angry':
        return 'text-red-600'
      case 'betrayed':
      case 'devastated':
        return 'text-red-700'
      default:
        return 'text-gray-600'
    }
  }

  const getEmotionAnimation = () => {
    switch (plantData.emotion) {
      case 'excited':
        return {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }
      case 'loved':
        return {
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }
      case 'happy':
        return {
          y: [0, -5, 0],
          rotate: [0, 3, -3, 0]
        }
      case 'worried':
      case 'anxious':
        return {
          x: [0, -2, 2, 0],
          rotate: [0, -2, 2, 0]
        }
      case 'sad':
      case 'lonely':
        return {
          y: [0, 5, 0],
          opacity: [1, 0.8, 1]
        }
      case 'angry':
        return {
          x: [0, -5, 5, 0],
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0]
        }
      case 'devastated':
        return {
          y: [0, 10, 0],
          opacity: [1, 0.5, 1],
          rotate: [0, -10, 0]
        }
      default:
        return {
          y: [0, -2, 0]
        }
    }
  }

  return (
    <motion.div 
      className="text-center relative"
      animate={{
        scale: plantData.state === 'dead' ? 0.8 : 1,
        rotate: plantData.state === 'dead' ? -10 : 0
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Emotional aura effect */}
      {(plantData.emotion === 'loved' || plantData.emotion === 'excited') && (
        <motion.div
          className="absolute inset-0 rounded-full bg-pink-200/30 blur-xl"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.3, 0.7, 0.3] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity 
          }}
        />
      )}
      
      {/* Ambient sparkle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`ambient-sparkle-${i}`}
            className="absolute text-xs"
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: Math.random() * 400 - 200,
              y: Math.random() * 300 - 150
            }}
            animate={{ 
              opacity: [0, 0.7, 0],
              scale: [0.2, 0.8, 0.2],
              x: Math.random() * 400 - 200,
              y: Math.random() * 300 - 150
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {['✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫'][i]}
          </motion.div>
        ))}
      </div>
      
      <motion.div
        className="mb-6 relative z-10 flex justify-center"
        animate={getEmotionAnimation()}
        transition={{ 
          duration: plantData.emotion === 'excited' ? 0.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {getPlantWithFace()}
      </motion.div>
      
      <motion.div
        className={`px-6 py-4 rounded-2xl backdrop-blur-sm border ${
          plantData.state === 'dead' 
            ? 'bg-red-50/80 border-red-200' 
            : plantData.state === 'wilting'
            ? 'bg-orange-50/80 border-orange-200'
            : plantData.state === 'concerned'
            ? 'bg-yellow-50/80 border-yellow-200'
            : 'bg-emerald-50/80 border-emerald-200'
        }`}
        key={`${plantData.emotion}-${plantData.state}-${plantData.abandonmentCount}`}
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {plantData.name}'s Current Emotion: {plantData.emotion}
          </span>
        </div>
        <p className={`text-lg font-medium leading-relaxed ${getEmotionColor()}`}>
          {getEmotionalMessage()}
        </p>
        <div className="mt-2 text-xs text-gray-500">
          {plantData.name}'s Mood: {plantData.mood > 50 ? '😊' : plantData.mood > 0 ? '😐' : '😞'} {plantData.mood}/100
        </div>
        
        {/* Message box sparkles */}
        <div className="absolute -inset-1 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`message-sparkle-${i}`}
              className="absolute text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
              style={{
                top: `${i % 3 * 50}%`,
                left: `${Math.floor(i / 3) * 100}%`,
                transform: `translate(${i % 2 ? '-50%' : '50%'}, ${i % 2 ? '-50%' : '50%'})`
              }}
            >
              {['✨', '⭐', '💫', '🌟', '✨', '⭐'][i]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
