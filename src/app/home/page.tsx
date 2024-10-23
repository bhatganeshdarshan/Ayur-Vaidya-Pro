'use client'

import { useState } from 'react'
import { Moon, Sun, Leaf, User, Calendar, Activity, Heart, AlertTriangle, Cigarette, Ruler, Weight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { NextRouter, useRouter } from 'next/router'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'

interface RouterTypes{
  router : AppRouterInstance , 
  handleClick : ()=> void ,
}

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const userData = Object.fromEntries(formData.entries())
    console.log(userData)
  }

  const router = useRouter();

  const handleClick = () => {
    router.push('/main-page');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to Ayur Vaidya Pro</CardTitle>
            <CardDescription className="text-center text-lg">
              Please provide your details to get personalized medicine predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </Label>
                  <Input id="name" name="name" required className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Age</span>
                  </Label>
                  <Input id="age" name="age" type="number" required className="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Comorbidities</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="diabetes" name="comorbidities" value="diabetes" />
                    <Label htmlFor="diabetes">Diabetes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bp" name="comorbidities" value="bp" />
                    <Label htmlFor="bp">Blood Pressure</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="heart" name="comorbidities" value="heart" />
                    <Label htmlFor="heart">Heart Disease</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="asthma" name="comorbidities" value="asthma" />
                    <Label htmlFor="asthma">Asthma</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Gender</span>
                </Label>
                <RadioGroup defaultValue="male" name="gender" className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Medical History</span>
                </Label>
                <Textarea id="medicalHistory" name="medicalHistory" className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Specific Allergies</span>
                </Label>
                <Input id="allergies" name="allergies" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Cigarette className="h-4 w-4" />
                  <span>Bad Habits</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="smoke" name="badHabits" value="smoke" />
                    <Label htmlFor="smoke">Smoke</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="drink" name="badHabits" value="drink" />
                    <Label htmlFor="drink">Drink</Label>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4" />
                    <span>Height (cm)</span>
                  </Label>
                  <Input id="height" name="height" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Weight className="h-4 w-4" />
                    <span>Weight (kg)</span>
                  </Label>
                  <Input id="weight" name="weight" type="number" required />
                </div>
              </div>
              <Button type="submit" className="w-full" onClick={handleClick} >Register</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}