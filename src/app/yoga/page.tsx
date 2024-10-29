'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function YogaNavigation() {
  const [yogaName, setYogaName] = useState('')
  const router = useRouter()

  const handleNavigate = () => {
    if (yogaName) {
      const encodedYogaName = encodeURIComponent(yogaName)
      router.push(`/yoga-embed?query=${encodedYogaName}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Navigate to Yoga Tutorial</CardTitle>
          <CardDescription>Enter a yoga name to view its tutorial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              placeholder="Enter yoga name"
              value={yogaName}
              onChange={(e) => setYogaName(e.target.value)}
            />
            <Button onClick={handleNavigate}>Go to Tutorial</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}