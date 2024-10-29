'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from '../themeContext'
import { Sun, Moon, Search, Sparkles } from 'lucide-react'

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
      setError('An error occurred while fetching the video')
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold">Yoga Tutorial</h1>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Search for a Yogasana Tutorial</CardTitle>
            <CardDescription>Enter the name of a yogasana to find a tutorial video</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
              <Input
                type="text"
                value={yogasana}
                onChange={(e) => setYogasana(e.target.value)}
                placeholder="Enter yogasana name"
                className="flex-grow"
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button type="button" onClick={getYogaRecommendation}>
                <Sparkles className="h-4 w-4 mr-2" />
                Get Yoga Recommendation
              </Button>
            </form>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading video...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error}</p>
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
              <div className="flex justify-center items-center h-64">
                <p>Search for a yogasana to see a tutorial video</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <footer className="mt-12 p-4 bg-white dark:bg-gray-800 border-t text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}