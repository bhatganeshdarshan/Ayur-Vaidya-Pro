'use client'

import { useState } from 'react'
import { Moon, Sun, Leaf, Heart, Zap, Pill, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import themeTypes from '../../../theme-types'
import { useTheme } from '../themeContext'

const features = [
  { icon: Leaf, title: "Ayurvedic Wisdom", description: "Access ancient healing knowledge" },
  { icon: Heart, title: "Personalized Care", description: "Tailored treatments for your well-being" },
  { icon: Zap, title: "Holistic Approach", description: "Balance mind, body, and spirit" },
  { icon: Pill, title: "Modern Integration", description: "Combining tradition with science" },
]


export default function Onboarding() {
    const {darkMode , toggleDarkMode} = useTheme();
//   const [darkMode, setDarkMode] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const router = useRouter();

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     document.documentElement.classList.toggle('dark')
//   }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1))
  }

  const CurrentIcon = features[currentSlide].icon

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md"
      >
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Ayur Vaidya Pro</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </motion.header>
      <div className="w-full max-w-4xl relative">
        <Card className="bg-white dark:bg-gray-800">
          <CardContent className="p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                {CurrentIcon && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  >
                    <CurrentIcon className="w-24 h-24 text-primary mb-6" />
                  </motion.div>
                )}
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold mb-4"
                >
                  {features[currentSlide].title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                >
                  {features[currentSlide].description}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
          onClick={nextSlide}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
      <div className="mt-8 flex justify-center space-x-2">
        {features.map((_, index) => (
          <motion.button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90 text-white" onClick={()=>router.push(
            '/home'
        )}>
          Start Your Healing Journey
        </Button>
      </motion.div>
    </div>
  )
}