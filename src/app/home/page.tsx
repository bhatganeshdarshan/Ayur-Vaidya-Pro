'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Sun, Leaf, User, Calendar, Activity, Heart, AlertTriangle, Cigarette, Ruler, Weight, Mic, MicOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"
import themeTypes from '../../../theme-types'
import { useTheme } from '../themeContext'
import { useUserContext } from '../UserContext'

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }

  namespace google {
    namespace translate {
      class TranslateElement {
        constructor(options: object, elementId: string)
      }
    }
  }
}

export default function HomePage() {
  const {darkMode , toggleDarkMode} = useTheme();
  // const [darkMode, setDarkMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentField, setCurrentField] = useState('')
  const router = useRouter()
  const { setUserData, setJsonMessage } = useUserContext();

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode)
  //   document.documentElement.classList.toggle('dark')
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const userData = Object.fromEntries(formData.entries()); 
    
    try {
      const response = await fetch('/api/arliai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: userData }), 
      });
  
      const result = await response.json();
      const message = result.choices[0]['message'].content;
      console.log("result : \n", result);

      try {
        const json_message = JSON.parse(message);
        console.log("json message \n", json_message);
        setUserData(userData);
        setJsonMessage(json_message);
      } catch (error) {
        console.error("Couldn't parse JSON message");
      }
    } catch (error) {
      console.error('Error submitting data', error);
    }
  
    router.push('/main-page');
  };
  

  const startListening = (fieldId: string) => {
    setIsListening(true)
    setCurrentField(fieldId)

    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        toast({
          title: "Listening...",
          description: "Speak now to input your data.",
        })
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const field = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement
        if (field) {
          field.value = transcript
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      })
    }
  }

  const stopListening = () => {
    setIsListening(false)
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.stop()
    }
  }

  // useEffect(() => {
  //   const addGoogleTranslate = () => {
  //     const script = document.createElement('script')
  //     script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`
  //     document.body.appendChild(script)

  //     window.googleTranslateElementInit = () => {
  //       new window.google.translate.TranslateElement(
  //         { pageLanguage: 'en', includedLanguages: 'hi,ta,te,kn,ml,gu,pa,bn,mr,ur' },
  //         'google_translate_element'
  //       )
  //     }
  //   }

  //   addGoogleTranslate()
  // }, [])


  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
          <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        </div>
        {/* <div id='google_translate_element'></div> */}
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
                  <div className="flex items-center space-x-2">
                    <Input id="name" name="name" required className="w-full" />
                    <Button type="button" size="icon" variant="outline" onClick={() => startListening('name')}>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Age</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input id="age" name="age" type="number" required className="w-full" />
                    <Button type="button" size="icon" variant="outline" onClick={() => startListening('age')}>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
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
                <div className="flex items-center space-x-2">
                  <Textarea id="medicalHistory" name="medicalHistory" className="min-h-[100px] w-full" />
                  <Button type="button" size="icon" variant="outline" onClick={() => startListening('medicalHistory')}>
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Specific Allergies</span>
                </Label>
                <div className="flex items-center space-x-2">
                  <Input id="allergies" name="allergies" className="w-full" />
                  <Button type="button" size="icon" variant="outline" onClick={() => startListening('allergies')}>
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
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
                  <div className="flex items-center space-x-2">
                    <Input id="height" name="height" type="number" required className="w-full" />
                    <Button type="button" size="icon" variant="outline" onClick={() => startListening('height')}>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center space-x-2">
                    <Weight className="h-4 w-4" />
                    <span>Weight (kg)</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input id="weight" name="weight" type="number" required className="w-full" />
                    <Button type="button" size="icon" variant="outline" onClick={() => startListening('weight')}>
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">Register</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      {isListening && (
        <div className="fixed bottom-4 right-4">
          <Button variant="destructive" onClick={stopListening}>
            <MicOff className="h-4 w-4 mr-2" />
            Stop Listening
          </Button>
        </div>
      )}
    </div>
  )
}