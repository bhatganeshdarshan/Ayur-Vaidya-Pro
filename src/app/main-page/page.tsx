'use client'

import { useState } from 'react'
import { Moon, Sun, UserCog, Stethoscope, Shield, Pill, Heart, Flower2, AlertCircle, ShoppingBag, ArrowRight, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useTheme } from '../themeContext'
import { useUserContext } from '../UserContext'

export default function MainPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const { userData, jsonMessage } = useUserContext();

  console.log(JSON.stringify(jsonMessage, null, 2));

  const options = [
    { title: 'Disease Prediction and Curing', icon: Stethoscope, description: 'Get personalized disease predictions and treatment plans', path: '/prescription-report' },
    { title: 'Prevention', icon: Shield, description: 'Learn preventive measures for various health conditions', path: '/' },
    { title: 'Allopathy Complementary', icon: Pill, description: 'Explore complementary Ayurvedic treatments', path: '/locate-nearby' },
    { title: 'Overall Health and Well-being', icon: Heart, description: 'Achieve balance in body, mind, and spirit', path: '/' },
    { title: 'Yoga and Meditation', icon: Flower2, description: 'Discover ancient practices for health and wellness', path: '/' },
    { title: 'Allopathy Side Effects', icon: AlertCircle, description: 'Understand and manage side effects of allopathic medicines', path: '/' },
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Flower2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/home')}>
            <UserCog className="h-4 w-4" />
            <span className="sr-only">User settings</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20 pb-10">
          {options.map((option, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <option.icon className="h-5 w-5 text-primary" />
                  <span>{option.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{option.description}</CardDescription>
                <Button className="w-full mt-4" variant="outline" onClick={() => router.push(option.path)}>
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="mt-12 p-4 bg-white dark:bg-gray-800 border-t text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
      <div className="fixed bottom-24 right-6 group mb-12 mt-8">
        <Button
          onClick={() => router.push('/locate-nearby')}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <MapPin className="h-6 w-6" />
          <span className="sr-only">Nearby Hospitals and Yoga Centers</span>
        </Button>
        <div className="absolute bottom-20 right-0 flex items-center justify-end space-x-2 animate-bounce">
          <span className="text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1 px-2 rounded shadow-md">
            Nearby
          </span>
          <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 group pt-16 mt-16">
        <Button
          onClick={() => router.push('/store')}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700 text-white"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="sr-only">Ayurvedic Products</span>
        </Button>
        <div className="absolute bottom-20 right-0 flex items-center justify-end space-x-2 animate-bounce">
          <span className="text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1 px-2 rounded shadow-md">
            Store
          </span>
          <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
  )
}