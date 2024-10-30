"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Phone, Mail, Sun, Moon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useTheme } from '../themeContext'

const doctors = [

  {
    name: "Dr. Rajesh Patel",
    specialty: "Digestive & Metabolic",
    description: "Expert in Ayurvedic remedies for digestive issues and metabolic disorders.",
    rating: 4.9,
    phone: "+91 98765 43211",
    email: "rajesh.patel@example.com",
    img: "t1.jpeg"
  },
  {
    name: "Dr. Mahesh Gupta",
    specialty: "Joint, Spine & Muscle",
    description: "Focuses on Ayurvedic therapies for musculoskeletal conditions and pain management.",
    rating: 4.7,
    phone: "+91 98765 43212",
    email: "mahesh.gupta@example.com",
    img: "t2.jpeg",
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Neurological Disorders",
    description: "Specializes in Ayurvedic treatments for various neurological conditions.",
    rating: 4.8,
    phone: "+91 98765 43213",
    email: "vikram.singh@example.com",
    img: "t3.jpeg"
  },

]

export default function Component() {
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useTheme()

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
          <h1 className="text-2xl font-bold text-white">Our Abhyanga Assistants </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="bg-white/20 hover:bg-white/30 text-white border-white/50"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#024950] dark:text-white">Expert Ayurvedic Practitioners</h2>
          <p className="text-[#036b74] dark:text-gray-300">Connect with our experienced doctors for personalized Ayurvedic treatment plans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <Card 
              key={index} 
              className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#023940] border-[#024950] dark:border-[#036b74]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={`/${doctor.img}`}
                  alt={doctor.name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="top center"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-[#024950] dark:text-white">{doctor.name}</CardTitle>
                <CardDescription className="text-[#036b74] dark:text-gray-300 font-medium">
                  {doctor.specialty}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-0">
                <p className="mb-4 text-gray-600 dark:text-gray-300">{doctor.description}</p>
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-1 fill-current" />
                  <span className="font-semibold text-[#024950] dark:text-white">{doctor.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                  <Phone className="w-5 h-5 mr-2 text-[#036b74]" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 mr-2 text-[#036b74]" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
              </CardContent>
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-[#024950] hover:bg-[#036b74] text-white transition-colors"
                  onClick={() => router.push('/appoint')}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="mt-12 p-4 bg-[#024950] text-center">
        <p className="text-sm text-white">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}