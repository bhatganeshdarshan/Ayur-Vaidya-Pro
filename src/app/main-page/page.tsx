'use client'

import { useState } from 'react'
import { Moon, Sun, UserCog, Stethoscope, Shield, Pill, Heart, Flower2, AlertCircle, ShoppingBag, ArrowRight, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { useTheme } from '../themeContext'
import { useUserContext } from '../UserContext'
import Image from 'next/image'

export default function MainPage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const { userData, jsonMessage } = useUserContext();

  console.log(JSON.stringify(jsonMessage, null, 2));
  console.log(JSON.stringify(userData,null,2));

  const options = [
    { title: 'Disease Prediction and Curing', icon: Stethoscope, description: 'Get personalized disease predictions and treatment plans', path: '/prescription-report' , src : '/report_gen.jpeg?height=200&width=300' },
    { title: 'Prevention', icon: Shield, description: 'Learn preventive measures for various health conditions', path: '/prevention' , src : '/prevention.jpeg?height=200&width=300' },
    { title: 'Allopathy Complementary', icon: Pill, description: 'Explore complementary Ayurvedic treatments', path: '/locate-nearby' , src : '/complementary.jpeg?height=200&width=300'},
    { title: 'Overall Health and Well-being', icon: Heart, description: 'Achieve balance in body, mind, and spirit', path: '/' , src : '/health.jpeg?height=200&width=300' },
    { title: 'Yoga and Meditation', icon: Flower2, description: 'Discover ancient practices for health and wellness', path: '/yoga-embed' , src : '/yoga.jpeg?height=200&width=300' },
  ]

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image src="/app_logo.png" alt="Ayur Vaidya Pro Logo" height={95} width={65} className="drop-shadow-md" />
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">Ayur Vaidya Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={()=>router.push('/doctors')}>
                Book Appointment
          </Button>
          <Button variant="outline" size="icon" onClick={() => router.push('/home')} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            <UserCog className="h-4 w-4" />
            <span className="sr-only">User settings</span>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20 pb-10">
          {options.map((option, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800 border-[#024950] border">
              <div className="relative">
                <Image
                  src={option.src}
                  alt={option.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#024950]/80 to-transparent"></div>
                <CardHeader className="absolute bottom-0 left-0 right-0 pt-2 text-white">
                  <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                    <option.icon className="h-5 w-5" />
                    <span>{option.title}</span>
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent className="pt-4">
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">{option.description}</CardDescription>
                <Button 
                  className="w-full mt-4 bg-[#024950] text-white hover:bg-[#036b74] transition-all duration-300" 
                  variant="outline" 
                  onClick={() => router.push(option.path)}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="mt-12 p-4 bg-[#024950] text-center text-white">
        <p className="text-sm">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
      <div className="fixed bottom-24 right-6 group mb-12 mt-8">
        <Button
          onClick={() => router.push('/locate-nearby')}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#024950] hover:bg-[#036b74] text-white"
        >
          <MapPin className="h-6 w-6" />
          <span className="sr-only">Nearby Hospitals and Yoga Centers</span>
        </Button>
        <div className="absolute bottom-20 right-0 flex items-center justify-end space-x-2 animate-bounce">
          <span className="text-sm font-medium bg-white dark:bg-gray-800 text-[#024950] dark:text-gray-100 py-1 px-2 rounded shadow-md">
            Nearby
          </span>
          <ArrowRight className="h-5 w-5 text-[#024950] dark:text-[#036b74]" />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 group pt-16 mt-16">
        <Button
          onClick={() => router.push('/store')}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#024950] hover:bg-[#036b74] text-white"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="sr-only">Ayurvedic Products</span>
        </Button>
        <div className="absolute bottom-20 right-0 flex items-center justify-end space-x-2 animate-bounce">
          <span className="text-sm font-medium bg-white dark:bg-gray-800 text-[#024950] dark:text-gray-100 py-1 px-2 rounded shadow-md">
            Store
          </span>
          <ArrowRight className="h-5 w-5 text-[#024950] dark:text-[#036b74]" />
        </div>
      </div>
    </div>
  )
}