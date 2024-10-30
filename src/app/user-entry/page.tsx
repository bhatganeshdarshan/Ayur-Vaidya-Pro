'use client'

import { useCallback, useRef, useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useTheme } from '../themeContext'
import { Camera, Leaf, Moon, Sun, Upload, Plus, Minus, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import Webcam from 'react-webcam'
import { useUserContext } from '../UserContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function UserParametersForm() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    symptoms: [''],
    causes: [''],
    tonguePic: '',
    tongueColour: '',
    tongueNature: '',
    vaata: 0,
    pitta: 0,
    kapha: 0,
    naadi: '',
    foodCycle: '',
    waterCycle: '',
    sleepCycle: '',
    furtherQueries: ''
  })
  
  const { setUserData, setJsonMessage, userData, jsonMessage } = useUserContext();
  const [animateSliders, setAnimateSliders] = useState(false)
  const [showWebcam, setShowWebcam] = useState(false)
  const [isLoadingDoshas, setIsLoadingDoshas] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const router = useRouter();
  
  useEffect(() => {
    const storedDoshas = localStorage.getItem('doshas')
    if (storedDoshas) {
      const { vaata, pitta, kapha } = JSON.parse(storedDoshas)
      setFormData(prev => ({ ...prev, vaata, pitta, kapha }))
      setAnimateSliders(true)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayInputChange = (index: number, field: 'symptoms' | 'causes') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = [...formData[field]]
    newArray[index] = e.target.value
    setFormData(prev => ({ ...prev, [field]: newArray }))
  }

  const addArrayField = (field: 'symptoms' | 'causes') => () => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayField = (field: 'symptoms' | 'causes', index: number) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: string) => (value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    setJsonMessage(formData);
    
    try {
      const response = await fetch('/api/arliai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: userData , patientEntries : formData}), 
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
  }

  const predictDoshas = () => {
    setIsLoadingDoshas(true)
    setTimeout(() => {
      const dummyPrediction = {
        vaata: Math.floor(Math.random() * 101),
        pitta: Math.floor(Math.random() * 101),
        kapha: Math.floor(Math.random() * 101),
      }

      setFormData(prev => ({
        ...prev,
        vaata: dummyPrediction.vaata,
        pitta: dummyPrediction.pitta,
        kapha: dummyPrediction.kapha,
      }))

      localStorage.setItem('doshas', JSON.stringify(dummyPrediction))
      setAnimateSliders(true)
      setIsLoadingDoshas(false)
    }, 7000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, tonguePic: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      setFormData(prev => ({ ...prev, tonguePic: imageSrc }))
      setShowWebcam(false)
    }
  }, [webcamRef])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image src="/app_logo.png" alt="Ayur Vaidya Pro Logo" height={95} width={65} className="drop-shadow-md" />
          <h1 className="text-2xl font-bold text-white">Ayur Vaidya Pro</h1>
        </div>
        <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#024950] dark:text-white">Hello, {userData ? userData['name'] : ''}</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">Please enter the following details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-[#024950] dark:text-white">Symptoms</Label>
                {formData.symptoms.map((symptom, index) => (
                  <div key={`symptom-${index}`} className="flex items-center space-x-2">
                    <Input
                      value={symptom}
                      onChange={handleArrayInputChange(index, 'symptoms')}
                      required
                      className="border-[#024950] dark:border-gray-600"
                    />
                    {index === formData.symptoms.length - 1 ? (
                      <Button type="button" onClick={addArrayField('symptoms')} variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={removeArrayField('symptoms', index)} variant="outline" size="icon">
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label className="text-[#024950] dark:text-white">Causes</Label>
                {formData.causes.map((cause, index) => (
                  <div key={`cause-${index}`} className="flex items-center space-x-2">
                    <Input
                      value={cause}
                      onChange={handleArrayInputChange(index, 'causes')}
                      required
                      className="border-[#024950] dark:border-gray-600"
                    />
                    {index === formData.causes.length - 1 ? (
                      <Button type="button" onClick={addArrayField('causes')} variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={removeArrayField('causes', index)} variant="outline" size="icon">
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tonguePic" className="text-[#024950] dark:text-white">Tongue Picture</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="tonguePic"
                    name="tonguePic"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('tonguePic')?.click()}
                    className="border-[#024950] text-[#024950] hover:bg-[#024950] hover:text-white dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowWebcam(prev => !prev)}
                    className="border-[#024950] text-[#024950] hover:bg-[#024950] hover:text-white dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {showWebcam ? 'Hide Camera' : 'Use Camera'}
                  </Button>
                </div>
                {showWebcam && (
                  <div className="mt-4">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: 'user' }}
                      className="w-full max-w-md mx-auto"
                    />
                    <Button type="button" onClick={captureImage} className="mt-2 bg-[#024950] text-white hover:bg-[#036b74]">
                      Capture Image
                    </Button>
                  </div>
                )}
                {formData.tonguePic && (
                  <div className="mt-4">
                    <img src={formData.tonguePic} alt="Tongue" className="w-full max-w-md mx-auto" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tongueColour" className="text-[#024950] dark:text-white">Tongue Colour</Label>
                  <Select onValueChange={handleSelectChange('tongueColour')}>
                    <SelectTrigger className="border-[#024950] dark:border-gray-600">
                      <SelectValue placeholder="Select tongue colour" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="pale">Pale</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tongueNature" className="text-[#024950] dark:text-white">Tongue Nature</Label>
                  <Select onValueChange={handleSelectChange('tongueNature')}>
                    <SelectTrigger className="border-[#024950] dark:border-gray-600">
                      <SelectValue placeholder="Select tongue nature" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moist">Moist</SelectItem>
                      <SelectItem value="dry">Dry</SelectItem>
                      <SelectItem value="cracked">Cracked</SelectItem>
                      <SelectItem value="coated">Coated</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="button" 
                onClick={predictDoshas} 
                className="w-full bg-[#024950] text-white hover:bg-[#036b74]"
                disabled={isLoadingDoshas}
              >
                {isLoadingDoshas ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Predicting Doshas...
                  </>
                ) : (
                  'Predict Vata, Pitta, Kapha'
                )}
              </Button>

              {['vaata', 'pitta', 'kapha'].map((dosha) => (
                <div key={dosha} className="space-y-2">
                  <Label htmlFor={dosha} 
                    className="text-[#024950] dark:text-white"
                  >
                    {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                  </Label>
                  <div className="relative pt-1">
                    <Slider
                      id={dosha}
                      min={0}
                      max={100}
                      step={1}
                      value={[formData[dosha as keyof typeof formData] as number]}
                      onValueChange={handleSliderChange(dosha)}
                      className="z-0"
                    />
                    <motion.div
                      className="absolute left-0 top-1 h-2 bg-[#024950] rounded-full z-10"
                      style={{ width: animateSliders ? `${formData[dosha as keyof typeof formData]}%` : '0%' }}
                      initial={{ width: '0%' }}
                      animate={{ width: animateSliders ? `${formData[dosha as keyof typeof formData]}%` : '0%' }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    {formData[dosha as keyof typeof formData]}%
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="naadi" className="text-[#024950] dark:text-white">Naadi</Label>
                <Select onValueChange={handleSelectChange('naadi')}>
                  <SelectTrigger className="border-[#024950] dark:border-gray-600">
                    <SelectValue placeholder="Select naadi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vata">Vata</SelectItem>
                    <SelectItem value="pitta">Pitta</SelectItem>
                    <SelectItem value="kapha">Kapha</SelectItem>
                    <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                    <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                    <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {['foodCycle', 'waterCycle', 'sleepCycle'].map((cycle) => (
                <div key={cycle} className="space-y-2">
                  <Label htmlFor={cycle} className="text-[#024950] dark:text-white">{cycle.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} (hours)</Label>
                  <Input
                    id={cycle}
                    name={cycle}
                    type="number"
                    min={0}
                    max={24}
                    value={formData[cycle as keyof typeof formData]}
                    onChange={handleInputChange}
                    required
                    className="border-[#024950] dark:border-gray-600"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <Label htmlFor="furtherQueries" className="text-[#024950] dark:text-white">Further Queries</Label>
                <Textarea
                  id="furtherQueries"
                  name="furtherQueries"
                  value={formData.furtherQueries}
                  onChange={handleInputChange}
                  rows={4}
                  className="border-[#024950] dark:border-gray-600"
                />
              </div>

              <Button type="submit" className="w-full bg-[#024950] text-white hover:bg-[#036b74]">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}