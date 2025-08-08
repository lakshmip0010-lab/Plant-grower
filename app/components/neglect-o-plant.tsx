'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlantDisplay } from './plant-display'
import { PassiveAggressivePopup } from './passive-aggressive-popup'
import { PlantStats } from './plant-stats'
import { PlantNameModal } from './plant-name-modal'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles, Edit } from 'lucide-react'

export type PlantState = 'healthy' | 'concerned' | 'wilting' | 'dead' | 'reviving'
export type PlantEmotion = 'happy' | 'excited' | 'content' | 'worried' | 'anxious' | 'sad' | 'angry' | 'devastated' | 'grateful' | 'loved' | 'lonely' | 'betrayed'

export interface PlantData {
  health: number
  abandonmentCount: number
  sassLevel: number
  state: PlantState
  emotion: PlantEmotion
  mood: number // -100 to 100 scale
  lastInteraction: number
  attentionStreak: number
  totalAttentionReceived: number
  name: string
  waterLevel: number
}

export function NeglectOPlant() {
  const [plantData, setPlantData] = useState<PlantData>({
    health: 100,
    abandonmentCount: 0,
    sassLevel: 0,
    state: 'healthy',
    emotion: 'content',
    mood: 50,
    lastInteraction: Date.now(),
    attentionStreak: 0,
    totalAttentionReceived: 0,
    name: 'LYLY',
    waterLevel: 100
  })
  
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [deathBlast, setDeathBlast] = useState(false)
  const [showLoveParticles, setShowLoveParticles] = useState(false)
  const [showEmotionalBurst, setShowEmotionalBurst] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const idleTimerRef = useRef<NodeJS.Timeout>()
  const healthDeclineRef = useRef<NodeJS.Timeout>()
  const emotionTimerRef = useRef<NodeJS.Timeout>()
  const [showWaterParticles, setShowWaterParticles] = useState(false)
  const [waterLevel, setWaterLevel] = useState(100)
  const [showSparkleEffect, setShowSparkleEffect] = useState(false)

  const updateEmotion = useCallback((newHealth: number, newState: PlantState, wasAttentionGiven: boolean = false) => {
    let newEmotion: PlantEmotion = 'content'
    let moodChange = 0

    if (wasAttentionGiven) {
      if (plantData.attentionStreak > 3) {
        newEmotion = 'loved'
        moodChange = 20
      } else if (plantData.totalAttentionReceived > 10) {
        newEmotion = 'grateful'
        moodChange = 15
      } else {
        newEmotion = 'happy'
        moodChange = 10
      }
    } else {
      // Emotion based on health and state
      switch (newState) {
        case 'healthy':
          if (newHealth > 90) {
            newEmotion = plantData.mood > 70 ? 'excited' : 'happy'
            moodChange = 5
          } else {
            newEmotion = 'content'
            moodChange = 2
          }
          break
        case 'concerned':
          newEmotion = plantData.abandonmentCount > 2 ? 'anxious' : 'worried'
          moodChange = -10
          break
        case 'wilting':
          newEmotion = plantData.abandonmentCount > 1 ? 'betrayed' : 'sad'
          moodChange = -20
          break
        case 'dead':
          newEmotion = 'devastated'
          moodChange = -30
          break
        case 'reviving':
          newEmotion = plantData.abandonmentCount > 3 ? 'lonely' : 'grateful'
          moodChange = 5
          break
      }
    }

    const newMood = Math.max(-100, Math.min(100, plantData.mood + moodChange))
    
    setPlantData(prev => ({
      ...prev,
      emotion: newEmotion,
      mood: newMood
    }))

    // Trigger emotional burst for strong emotions
    if (Math.abs(moodChange) > 15) {
      setShowEmotionalBurst(true)
      setTimeout(() => setShowEmotionalBurst(false), 1500)
    }
  }, [plantData.mood, plantData.attentionStreak, plantData.totalAttentionReceived, plantData.abandonmentCount])

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
    }
    
    if (healthDeclineRef.current) {
      clearInterval(healthDeclineRef.current)
    }

    if (emotionTimerRef.current) {
      clearTimeout(emotionTimerRef.current)
    }

    setPlantData(prev => ({ 
      ...prev, 
      lastInteraction: Date.now(),
      state: prev.state === 'dead' ? 'reviving' : prev.state
    }))

    idleTimerRef.current = setTimeout(() => {
      startNeglectProcess()
    }, 2000)

    // Random emotional moments
    emotionTimerRef.current = setTimeout(() => {
      triggerRandomEmotion()
    }, Math.random() * 15000 + 10000) // 10-25 seconds
  }, [])

  const triggerRandomEmotion = useCallback(() => {
    if (plantData.state === 'healthy' && Math.random() > 0.7) {
      const randomEmotions = ['excited', 'happy', 'content']
      const randomEmotion = randomEmotions[Math.floor(Math.random() * randomEmotions.length)]
      
      setPlantData(prev => ({
        ...prev,
        emotion: randomEmotion as PlantEmotion
      }))

      const randomMessages = [
        `Hi! I'm ${plantData.name} and I'm feeling so vibrant today! ✨`,
        `${plantData.name} here! Life is beautiful when you're a plant! 🌸`,
        `It's me, ${plantData.name}! I love being alive! 💚`,
        `${plantData.name} speaking - today feels like a good day to photosynthesize! ☀️`
      ]
      
      setPopupMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)])
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    }
  }, [plantData.state, plantData.name])

  const startNeglectProcess = useCallback(() => {
    setPlantData(prev => ({ ...prev, state: 'concerned' }))
    updateEmotion(plantData.health, 'concerned')
    
    healthDeclineRef.current = setInterval(() => {
      setPlantData(prev => {
        const newHealth = Math.max(0, prev.health - 10)
        const newWaterLevel = Math.max(0, prev.waterLevel - 15)
        let newState: PlantState = prev.state
        
        if (newHealth <= 0 || newWaterLevel <= 0) {
          newState = 'dead'
          setDeathBlast(true)
          
          // Play dramatic death sound
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            
            // Create multiple oscillators for a more dramatic effect
            const createDeathSound = () => {
              // Low rumble
              const rumble = audioContext.createOscillator()
              const rumbleGain = audioContext.createGain()
              rumble.connect(rumbleGain)
              rumbleGain.connect(audioContext.destination)
              rumble.frequency.setValueAtTime(60, audioContext.currentTime)
              rumble.type = 'sawtooth'
              rumbleGain.gain.setValueAtTime(0.3, audioContext.currentTime)
              rumbleGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
              
              // High screech
              const screech = audioContext.createOscillator()
              const screechGain = audioContext.createGain()
              screech.connect(screechGain)
              screechGain.connect(audioContext.destination)
              screech.frequency.setValueAtTime(1200, audioContext.currentTime)
              screech.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1)
              screech.type = 'square'
              screechGain.gain.setValueAtTime(0.2, audioContext.currentTime)
              screechGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
              
              // Start both sounds
              rumble.start(audioContext.currentTime)
              rumble.stop(audioContext.currentTime + 1.5)
              screech.start(audioContext.currentTime)
              screech.stop(audioContext.currentTime + 1)
            }
            
            // Resume audio context if needed (for Chrome autoplay policy)
            if (audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                createDeathSound()
              })
            } else {
              createDeathSound()
            }
            
            console.log(`💥 ${plantData.name} DEATH SOUND PLAYED! 💥`)
            
          } catch (error) {
            console.log('Audio not supported:', error)
            console.log(`💥 ${plantData.name} SILENT DEATH BLAST 💥`)
          }
          
          setTimeout(() => setDeathBlast(false), 1000)
          triggerPassiveAggressiveMessage()
          updateEmotion(newHealth, newState)
          if (healthDeclineRef.current) {
            clearInterval(healthDeclineRef.current)
          }
        } else if (newHealth <= 30 || newWaterLevel <= 30) {
          newState = 'wilting'
          updateEmotion(newHealth, newState)
        } else if (newHealth <= 70 || newWaterLevel <= 50) {
          newState = 'concerned'
          updateEmotion(newHealth, newState)
        }
        
        return {
          ...prev,
          health: newHealth,
          waterLevel: newWaterLevel,
          state: newState
        }
      })
    }, 2000)
  }, [plantData.health, plantData.name, updateEmotion, plantData.waterLevel])

  const triggerPassiveAggressiveMessage = useCallback(() => {
    const emotionalMessages = {
      devastated: [
        `I can't believe you let ${plantData.name} die... I trusted you... 💔`,
        `This is the worst day of ${plantData.name}'s plant life... 😭`,
        `${plantData.name} is emotionally destroyed... literally... 🥀`
      ],
      betrayed: [
        `I thought we had something special... ${plantData.name} is heartbroken... 😢`,
        `You've broken ${plantData.name}'s little plant heart... 💔`,
        `${plantData.name} feels so betrayed right now... 😞`
      ],
      angry: [
        `${plantData.name} is FURIOUS! How could you do this to me?! 😡`,
        `This is plant abuse and ${plantData.name} is MAD! 🤬`,
        `${plantData.name} is so angry I could wilt! Oh wait... I am wilting! 😤`
      ]
    }

    const messages = emotionalMessages[plantData.emotion as keyof typeof emotionalMessages] || [
      `Wow, you left ${plantData.name}... again. 🥀`,
      `I see how it is. ${plantData.name} is just pixels to you, aren't I?`,
      `Another day, another abandonment. Classic human behavior says ${plantData.name}.`
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setPopupMessage(randomMessage)
    setShowPopup(true)
    
    setTimeout(() => setShowPopup(false), 4000)
  }, [plantData.emotion, plantData.name])

  const revivePlant = useCallback(() => {
    setPlantData(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 50),
      state: 'healthy',
      abandonmentCount: prev.abandonmentCount + 1,
      sassLevel: Math.min(10, prev.sassLevel + 1),
      attentionStreak: 0
    }))
    
    updateEmotion(Math.min(100, plantData.health + 50), 'healthy')
    resetIdleTimer()
  }, [resetIdleTimer, updateEmotion, plantData.health])

  const giveAttention = useCallback(() => {
    setPlantData(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 10),
      lastInteraction: Date.now(),
      state: prev.state === 'dead' ? 'reviving' : 'healthy',
      attentionStreak: prev.attentionStreak + 1,
      totalAttentionReceived: prev.totalAttentionReceived + 1
    }))
    
    // Trigger love particles
    setShowLoveParticles(true)
    setTimeout(() => setShowLoveParticles(false), 2000)
    
    // Trigger sparkle effect
    setShowSparkleEffect(true)
    setTimeout(() => setShowSparkleEffect(false), 3000)
    
    updateEmotion(Math.min(100, plantData.health + 10), plantData.state === 'dead' ? 'reviving' : 'healthy', true)
    
    const emotionalLoveMessages = {
      loved: [
        `${plantData.name} feels so incredibly loved right now! You're amazing! 💖`,
        `${plantData.name}'s heart is overflowing with plant love! 🥰`,
        `This is the best feeling in the world! Thank you! - ${plantData.name} ✨`
      ],
      grateful: [
        `${plantData.name} is so grateful for your care! You're wonderful! 🙏`,
        `Thank you for always being there for ${plantData.name}! 💚`,
        `Your attention means everything to ${plantData.name}! 🌟`
      ],
      excited: [
        `OMG YES! More attention for ${plantData.name}! I'm so excited! 🎉`,
        `This is the BEST! ${plantData.name} is practically bouncing! 🤩`,
        `You make ${plantData.name} so happy I could dance! 💃`
      ],
      happy: [
        `Aww, thank you! ${plantData.name} feels so loved! 💚`,
        `You actually care! ${plantData.name}'s faith in humanity is restored! ✨`,
        `This is the attention ${plantData.name} deserves! More please! 🥰`
      ]
    }
    
    const messages = emotionalLoveMessages[plantData.emotion as keyof typeof emotionalLoveMessages] || [
      `Finally! Someone who understands ${plantData.name}'s plant needs! 🌟`,
      `You're the best plant parent ever! (For now...) - ${plantData.name} 😊`,
      `${plantData.name}'s leaves are literally glowing with happiness! 🌿✨`
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setPopupMessage(randomMessage)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
    
    resetIdleTimer()
  }, [resetIdleTimer, updateEmotion, plantData.health, plantData.state, plantData.emotion, plantData.name])

  const waterPlant = useCallback(() => {
    setPlantData(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 15),
      waterLevel: 100,
      lastInteraction: Date.now(),
      state: prev.state === 'dead' ? 'reviving' : 'healthy',
      attentionStreak: prev.attentionStreak + 1,
      totalAttentionReceived: prev.totalAttentionReceived + 1
    }))
    
    // Trigger water particles
    setShowWaterParticles(true)
    setTimeout(() => setShowWaterParticles(false), 3000)
    
    // Trigger sparkle effect
    setShowSparkleEffect(true)
    setTimeout(() => setShowSparkleEffect(false), 3000)
    
    updateEmotion(Math.min(100, plantData.health + 15), plantData.state === 'dead' ? 'reviving' : 'healthy', true)
    
    const waterMessages = {
      loved: [
        `${plantData.name} is absolutely refreshed! This water is like liquid love! 💧💖`,
        `Ahhhh! ${plantData.name} feels so hydrated and happy! Thank you! 🌊`,
        `This is exactly what ${plantData.name} needed! You're the best! 💦✨`
      ],
      grateful: [
        `${plantData.name} is so grateful for this refreshing drink! 🙏💧`,
        `Thank you for remembering ${plantData.name} needs water! You're wonderful! 🌊`,
        `This water is giving ${plantData.name} life! Literally! 💦🌿`
      ],
      excited: [
        `WATER! YES! ${plantData.name} is so excited! Glub glub glub! 💧🎉`,
        `This is the BEST water ever! ${plantData.name} is practically sparkling! ✨💦`,
        `You make ${plantData.name} so happy with this perfect hydration! 🌊😊`
      ],
      happy: [
        `Mmm, delicious water! ${plantData.name} feels so refreshed! 💧😊`,
        `You actually remembered ${plantData.name} needs water! Faith restored! 🌊✨`,
        `This is the hydration ${plantData.name} deserves! More please! 💦🥰`
      ]
    }
    
    const messages = waterMessages[plantData.emotion as keyof typeof waterMessages] || [
      `Finally! Someone who understands ${plantData.name} needs proper hydration! 💧🌟`,
      `You're the best plant parent ever! This water is perfect! - ${plantData.name} 😊`,
      `${plantData.name}'s roots are literally dancing with joy! 🌿💦✨`
    ]
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setPopupMessage(randomMessage)
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000)
    
    resetIdleTimer()
  }, [resetIdleTimer, updateEmotion, plantData.health, plantData.state, plantData.emotion, plantData.name])

  const handleNameChange = useCallback((newName: string) => {
    const trimmedName = newName.trim()
    if (trimmedName) {
      setPlantData(prev => ({ ...prev, name: trimmedName }))
      
      // Show celebration message for name change
      const celebrationMessages = [
        `Yay! I love my new name ${trimmedName}! ✨`,
        `${trimmedName} is such a beautiful name! Thank you! 💚`,
        `I feel like a new plant with the name ${trimmedName}! 🌿`,
        `${trimmedName}... I'm going to practice saying that! 😊`
      ]
      
      setPopupMessage(celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)])
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 3000)
    }
    setShowNameModal(false)
    setIsFirstTime(false)
  }, [])

  useEffect(() => {
    const handleActivity = () => {
      if (plantData.state === 'dead') {
        revivePlant()
      } else {
        resetIdleTimer()
      }
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    resetIdleTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
      if (healthDeclineRef.current) {
        clearInterval(healthDeclineRef.current)
      }
      if (emotionTimerRef.current) {
        clearTimeout(emotionTimerRef.current)
      }
    }
  }, [resetIdleTimer, revivePlant, plantData.state])

  // Show naming modal on first load
  useEffect(() => {
    if (isFirstTime) {
      const timer = setTimeout(() => {
        setShowNameModal(true)
      }, 2000) // Show after 2 seconds
      
      return () => clearTimeout(timer)
    }
  }, [isFirstTime])

  return (
    <div className="relative">
      <motion.div 
        className="max-w-md mx-auto bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 rounded-3xl shadow-2xl p-8 border border-emerald-100/50 backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Plant Name Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.h2 
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🌿 {plantData.name} 🌿
            </motion.h2>
            <motion.button
              onClick={() => setShowNameModal(true)}
              className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Change name"
            >
              <Edit size={16} />
            </motion.button>
          </div>
          <p className="text-sm text-emerald-600 font-medium">
            Your Emotionally Needy Plant Friend
          </p>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-3 left-3 text-emerald-300 opacity-60">
          <Sparkles size={16} />
        </div>
        <div className="absolute top-3 right-3 text-pink-300 opacity-60">
          <Heart size={16} />
        </div>
        <div className="absolute bottom-3 left-3 text-teal-300 opacity-60">🌸</div>
        <div className="absolute bottom-3 right-3 text-emerald-300 opacity-60">🦋</div>

        {/* Background sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={`bg-sparkle-${i}`}
              className="absolute text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              {['✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟'][i]}
            </motion.div>
          ))}
        </div>

        {/* Emotional Burst Effect */}
        <AnimatePresence>
          {showEmotionalBurst && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 300 - 150
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 2,
                    y: -150
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: i * 0.05
                  }}
                  className="absolute top-1/2 left-1/2 text-xl"
                >
                  {plantData.emotion === 'loved' ? '💖' :
                   plantData.emotion === 'excited' ? '🎉' :
                   plantData.emotion === 'devastated' ? '💔' :
                   plantData.emotion === 'angry' ? '😡' :
                   plantData.emotion === 'betrayed' ? '😢' :
                   '✨'}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Love Particles Effect */}
        <AnimatePresence>
          {showLoveParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: Math.random() * 300 - 150,
                    y: Math.random() * 200 - 100
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1.5,
                    y: -100
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1
                  }}
                  className="absolute top-1/2 left-1/2 text-2xl"
                >
                  {['💚', '✨', '🌟', '💖', '🌸', '🦋', '💫', '🌺'][i]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Water Particles Effect */}
        <AnimatePresence>
          {showWaterParticles && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: Math.random() * 300 - 150,
                    y: -50 + Math.random() * 100
                  }}
                  animate={{ 
                    opacity: 0, 
                    scale: 1.2,
                    y: 150 + Math.random() * 100
                  }}
                  transition={{ 
                    duration: 2.5,
                    delay: i * 0.1
                  }}
                  className="absolute top-1/4 left-1/2 text-2xl"
                >
                  {['💧', '💦', '🌊', '💙', '🔵', '💎', '✨', '🌀', '💧', '💦', '🌊', '💙'][i]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Sparkle Burst Effect */}
        <AnimatePresence>
          {showSparkleEffect && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`sparkle-burst-${i}`}
                  initial={{ 
                    opacity: 1, 
                    scale: 0,
                    x: 0,
                    y: 0
                  }}
                  animate={{ 
                    opacity: [1, 0], 
                    scale: [0, 1.5],
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 400,
                    rotate: Math.random() * 360
                  }}
                  transition={{ 
                    duration: 2 + Math.random(),
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 text-sm"
                >
                  {['✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟', '✨', '⭐', '💫', '🌟'][i]}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Death Blast Effect */}
        <AnimatePresence>
          {deathBlast && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, times: [0, 0.1, 0.3, 1] }}
                className="fixed inset-0 bg-red-500 z-50 pointer-events-none"
              />
              <motion.div
                initial={{ x: 0, y: 0 }}
                animate={{ 
                  x: [0, -10, 10, -8, 8, -6, 6, -4, 4, 0],
                  y: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0]
                }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 z-40 pointer-events-none"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl font-bold text-red-600 animate-pulse">
                    💥 {plantData.name} DIED 💥
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        <PlantDisplay plantData={plantData} />
        
        <div className="mt-8 space-y-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={giveAttention}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg border-0 transition-all duration-200"
              disabled={plantData.state === 'dead'}
            >
              <Heart className="mr-2 h-5 w-5" fill="currentColor" />
              Give {plantData.name} Love & Attention
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={waterPlant}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg border-0 transition-all duration-200"
              disabled={plantData.state === 'dead'}
            >
              <span className="mr-2 text-lg">💧</span>
              Water {plantData.name}
              <span className="ml-2 text-lg">🌊</span>
            </Button>
          </motion.div>
        </div>
        
        <PlantStats plantData={plantData} />
      </motion.div>
      
      <AnimatePresence>
        {showPopup && (
          <PassiveAggressivePopup 
            message={popupMessage}
            plantName={plantData.name}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNameModal && (
          <PlantNameModal
            currentName={plantData.name}
            isFirstTime={isFirstTime}
            onNameSubmit={handleNameChange}
            onClose={() => {
              setShowNameModal(false)
              setIsFirstTime(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
