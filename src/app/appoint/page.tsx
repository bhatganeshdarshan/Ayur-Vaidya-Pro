'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useTheme } from '../themeContext'
import { Sun, Moon, CalendarDays, Clock, MessageSquare } from 'lucide-react'
import Image from 'next/image'

export default function AppointmentBooking() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [duration, setDuration] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log(date)
      console.log(time)
      console.log(duration)
      console.log(message)

      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, time, duration, message })
      })

      if (response.ok) {
        alert('Appointment request submitted!')
      } else {
        alert('Failed to submit the appointment request.')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

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
          <h1 className="text-2xl font-bold text-white">Book Appointment</h1>
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

      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto bg-white dark:bg-[#023940] border-[#024950] dark:border-[#036b74]">
          <CardHeader>
            <CardTitle className="text-[#024950] dark:text-white flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              Book an Appointment with Ayurvedic Doctor
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Please select your preferred date, time, and provide any necessary details.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-[#024950] dark:text-white">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border border-[#024950] dark:border-[#036b74] bg-white dark:bg-[#012A2E]"
                  disabled={(date) => date < new Date()}
                  styles={{
                    head_cell: { color: '#024950' },
                    cell: { color: '#024950' },
                    day: { color: '#024950' },
                    nav_button: { color: '#024950' },
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="text-[#024950] dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select Time
                </Label>
                <Select onValueChange={setTime}>
                  <SelectTrigger 
                    id="time"
                    className="border-[#024950] dark:border-[#036b74] dark:bg-[#012A2E]"
                  >
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-[#024950] dark:text-white">Appointment Duration</Label>
                <Select onValueChange={setDuration}>
                  <SelectTrigger 
                    id="duration"
                    className="border-[#024950] dark:border-[#036b74] dark:bg-[#012A2E]"
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1 hour 30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="message" 
                  className="text-[#024950] dark:text-white flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Message to Doctor (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter any specific concerns or questions you have for the doctor"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-[#024950] dark:border-[#036b74] dark:bg-[#012A2E] min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-[#024950] hover:bg-[#036b74] text-white transition-colors"
                disabled={!date || !time || !duration || loading}
              >
                {loading ? 'Submitting...' : 'Book Appointment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="mt-12 p-4 bg-[#024950] text-center">
        <p className="text-sm text-white">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}