'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from '../themeContext'
import { Sun, Moon, Search, Sparkles, Loader2 } from 'lucide-react'
import Image from 'next/image'


const API_KEY = 'AIzaSyCkf0VyuJGm4qdrgTlRfW5CKIaxEWgTIGk'
export default function YogaTutorial() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [yogasana, setYogasana] = useState("Surya Namaskar")
  const [videoId, setVideoId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchYogaVideo = async (query: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query + ' yoga tutorial'
        )}&key=${API_KEY}&type=video&maxResults=1`
      )
  
      if (!response.ok) {
        throw new Error('Failed to fetch video')
      }
  
      const data = await response.json()
  
      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId)
      } else {
        setError('No videos found for this yogasana')
      }
    } catch (error) {
      setError('Please try again later. API quota might have been exceeded.')
      console.error('Error fetching video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchYogaVideo(yogasana)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchYogaVideo(yogasana)
  }

  const getYogaRecommendation = () => {
    const yogaAsanas = [
      "Tadasana", "Vrikshasana", "Adho Mukha Svanasana", "Trikonasana", 
      "Virabhadrasana", "Bhujangasana", "Balasana", "Shavasana"
    ]
    const randomYoga = yogaAsanas[Math.floor(Math.random() * yogaAsanas.length)]
    setYogasana(randomYoga)
    searchYogaVideo(randomYoga)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#012A2E] text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image 
            src="/app_logo.png" 
            alt="Ayur Vaidya Pro Logo" 
            height={95} 
            width={65} 
            className="drop-shadow-md"
            priority
          />
          <h1 className="text-2xl font-bold text-white">Yoga Tutorial</h1>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleDarkMode} 
          className="bg-white/20 hover:bg-white/30 text-white border-white/50"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-[#023940] border-[#024950]">
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-white">Search for a Yogasana Tutorial</CardTitle>
            <CardDescription className="dark:text-gray-300">Enter the name of a yogasana to find a tutorial video</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={yogasana}
                onChange={(e) => setYogasana(e.target.value)}
                placeholder="Enter yogasana name"
                className="flex-grow border-[#024950] focus:ring-[#036b74] dark:bg-[#012A2E] dark:border-[#036b74]"
              />
              <Button 
                type="submit"
                className="bg-[#024950] hover:bg-[#036b74] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
              <Button 
                type="button" 
                onClick={getYogaRecommendation}
                className="bg-[#036b74] hover:bg-[#047c87] text-white"
                disabled={isLoading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Recommend
              </Button>
            </form>
            
            <div className="rounded-lg overflow-hidden border border-[#024950] dark:border-[#036b74]">
              {isLoading ? (
                <div className="flex justify-center items-center h-[480px] bg-gray-50 dark:bg-[#012A2E]">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-[#024950] dark:text-[#036b74]" />
                    <p className="text-[#024950] dark:text-gray-300">Loading video...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-[480px] bg-gray-50 dark:bg-[#012A2E]">
                  <div className="text-center p-6">
                    <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
                    <Button 
                      onClick={() => searchYogaVideo(yogasana)}
                      className="bg-[#024950] hover:bg-[#036b74] text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : videoId ? (
                <div className="aspect-w-16 aspect-h-9" style={{ height: '480px' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${yogasana} Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[480px] bg-gray-50 dark:bg-[#012A2E]">
                  <p className="text-[#024950] dark:text-gray-300">Search for a yogasana to see a tutorial video</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 p-4 bg-[#024950] text-center">
        <p className="text-sm text-white">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}