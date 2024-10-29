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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"
import { useTheme } from '../themeContext'
import { useUserContext } from '../UserContext'

export default function HomePage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isListening, setIsListening] = useState(false)
  const [currentField, setCurrentField] = useState('')
  const [showMedicalHistory, setShowMedicalHistory] = useState(false)
  const router = useRouter()
  const { setUserData, setJsonMessage } = useUserContext();


  const options = [
    { value: "hypertension", label: "Hypertension" },
    { value: "diabetes_mellitus", label: "Diabetes Mellitus (Type 1 and Type 2)" },
    { value: "hyperlipidemia", label: "Hyperlipidemia (High Cholesterol)" },
    { value: "obesity", label: "Obesity" },
    { value: "asthma", label: "Asthma" },
    { value: "copd", label: "Chronic Obstructive Pulmonary Disease (COPD)" },
    { value: "heart_disease", label: "Heart Disease (Coronary Artery Disease)" },
    { value: "depression", label: "Depression" },
    { value: "anxiety_disorders", label: "Anxiety Disorders" },
    { value: "osteoarthritis", label: "Osteoarthritis" },
    { value: "chronic_kidney_disease", label: "Chronic Kidney Disease" },
    { value: "stroke", label: "Stroke" },
    { value: "gerd", label: "Gastroesophageal Reflux Disease (GERD)" },
    { value: "sleep_apnea", label: "Sleep Apnea" },
    { value: "rheumatoid_arthritis", label: "Rheumatoid Arthritis" },
    { value: "thyroid_disorders", label: "Thyroid Disorders (Hypothyroidism/Hyperthyroidism)" },
    { value: "anemia", label: "Anemia" },
    { value: "peripheral_artery_disease", label: "Peripheral Artery Disease" },
    { value: "fibromyalgia", label: "Fibromyalgia" },
    { value: "multiple_sclerosis", label: "Multiple Sclerosis" },
    { value: "parkinsons_disease", label: "Parkinson’s Disease" },
    { value: "schizophrenia", label: "Schizophrenia" },
    { value: "bipolar_disorder", label: "Bipolar Disorder" },
    { value: "allergic_rhinitis", label: "Allergic Rhinitis" },
    { value: "psoriasis", label: "Psoriasis" },
    { value: "eczema", label: "Eczema (Atopic Dermatitis)" },
    { value: "glaucoma", label: "Glaucoma" },
    { value: "hearing_loss", label: "Hearing Loss" },
    { value: "gallbladder_disease", label: "Gallbladder Disease" },
    { value: "peptic_ulcer_disease", label: "Peptic Ulcer Disease" },
    { value: "gout", label: "Gout" },
    { value: "liver_disease", label: "Liver Disease (e.g., Hepatitis)" },
    { value: "cancer", label: "Cancer (various types)" },
    { value: "hiv_aids", label: "HIV/AIDS" },
    { value: "tuberculosis", label: "Tuberculosis" },
    { value: "urinary_incontinence", label: "Urinary Incontinence" },
    { value: "ibd", label: "Inflammatory Bowel Disease (IBD)" },
    { value: "chronic_pain_syndrome", label: "Chronic Pain Syndrome" },
    { value: "ptsd", label: "Post-Traumatic Stress Disorder (PTSD)" },
    { value: "alcohol_use_disorder", label: "Alcohol Use Disorder" },
    { value: "substance_use_disorders", label: "Substance Use Disorders" },
    { value: "eating_disorders", label: "Eating Disorders (e.g., Anorexia, Bulimia)" },
    { value: "osteoporosis", label: "Osteoporosis" },
    { value: "sickle_cell_disease", label: "Sickle Cell Disease" },
    { value: "thromboembolic_disorders", label: "Thromboembolic Disorders (e.g., Deep Vein Thrombosis)" },
    { value: "osteomyelitis", label: "Osteomyelitis" },
    { value: "chronic_sinusitis", label: "Chronic Sinusitis" },
    { value: "celiac_disease", label: "Celiac Disease" },
    { value: "post_surgical_complications", label: "Post-Surgical Complications" },
    { value: "endometriosis", label: "Endometriosis" },
  ];
  



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
                <Label htmlFor="comorbidities" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Comorbidities</span>
                </Label>
                <Select name="comorbidities">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select comorbidities" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="none">None</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="bp">Blood Pressure</SelectItem>
                    <SelectItem value="heart">Heart Disease</SelectItem>
                    <SelectItem value="asthma">Asthma</SelectItem> */}
                    {options.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
                  </SelectContent>
                </Select>
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
                <Label className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Do you want to specify other problems?</span>
                </Label>
                <RadioGroup name="specifyProblems" className="flex space-x-4" onValueChange={(value) => setShowMedicalHistory(value === 'yes')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-problems" />
                    <Label htmlFor="yes-problems">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-problems" />
                    <Label htmlFor="no-problems">No</Label>
                  </div>
                </RadioGroup>
              </div>
              {showMedicalHistory && (
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
              )}
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